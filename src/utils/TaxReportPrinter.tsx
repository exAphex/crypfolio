import {TaxReport} from '../components/models/taxreport/TaxReport';
import jsPDF from 'jspdf';
import autoTable, {RowInput} from 'jspdf-autotable';
import {getFormattedDate} from './DateConverter';
import {getAssetLatestPrice, toEuro} from './PriceUtils';
import {
  getTransactionType,
  TransactionType,
} from '../components/models/transaction';
import {
  extractTaxableTransactions,
  processTransactionToHolding,
} from './CryptoCalculator';
import {TaxableTransaction} from '../components/models/taxreport/TaxableTransaction';
import {
  CryptoAsset,
  getCryptoAssetFromSymbol,
} from '../components/models/CryptoAsset';
import {TaxReportError} from '../components/models/TaxReportError';
import {TaxableHolding} from '../components/models/taxreport/TaxableHolding';
import moment from 'moment';
import {TaxableSale} from '../components/models/taxreport/TaxableSale';

class PrintedTaxReport {
  income: TaxableTransaction[] = [];
  sales: TaxableSale[] = [];
  holdingsAfter: TaxableHolding[] = [];
  assets: CryptoAsset[] = [];

  calculateIncome(report: TaxReport) {
    for (const a of report.accounts) {
      for (const t of a.transactions) {
        const tempAsset = getCryptoAssetFromSymbol(t.symbol, report.assets);
        if (!tempAsset) {
          throw new TaxReportError(
            'Could not find asset with symbol: ' + t.symbol,
            'Add a new asset with the mentioned symbol in the "Assets" view',
          );
        }
        // Previous years
        if (t.date.getFullYear() === report.taxYear) {
          switch (t.type) {
            case TransactionType.STAKING_REWARD:
              this.income.push(
                new TaxableTransaction(a, t, tempAsset.getPrice(t.date)),
              );
              break;
            case TransactionType.DISTRIBUTION:
              this.income.push(
                new TaxableTransaction(a, t, tempAsset.getPrice(t.date)),
              );
              break;
          }
        }
      }
    }
  }

  calculateHoldings(report: TaxReport) {
    this.holdingsAfter = [];
    for (const a of report.accounts) {
      const accHolding = new TaxableHolding(a);
      for (const t of a.transactions) {
        if (t.date.getFullYear() <= report.taxYear) {
          accHolding.holdings = processTransactionToHolding(
            t,
            accHolding.holdings,
          );
        }
      }
      this.holdingsAfter.push(accHolding);
    }
  }

  calculateSales(report: TaxReport) {
    const transactions = extractTaxableTransactions(report.accounts)
      .sort((l, u) => {
        return l.date > u.date ? 1 : -1;
      })
      .map((b) => {
        const tempAsset = getCryptoAssetFromSymbol(b.assetSymbol, this.assets);
        if (!tempAsset) {
          throw new TaxReportError(
            'Could not find asset with symbol: ' + b.assetSymbol,
            'Add a new asset with the mentioned symbol in the "Assets" view',
          );
        }
        b.price = tempAsset.getPrice(b.date);
        return b;
      });
    const fifoStreamTransactions = extractTaxableTransactions(report.accounts)
      .sort((l, u) => {
        return l.date > u.date ? 1 : -1;
      })
      .map((b) => {
        const tempAsset = getCryptoAssetFromSymbol(b.assetSymbol, this.assets);
        if (!tempAsset) {
          throw new TaxReportError(
            'Could not find asset with symbol: ' + b.assetSymbol,
            'Add a new asset with the mentioned symbol in the "Assets" view',
          );
        }
        b.price = tempAsset.getPrice(b.date);
        return b;
      });
    for (const t of transactions) {
      if (t.type === TransactionType.SELL) {
        const profit = this.calculateFifoProfit(t, fifoStreamTransactions);
      }
    }
  }

  calculateFifoProfit(
    sale: TaxableTransaction,
    fifoStream: TaxableTransaction[],
  ): number {
    let profit = 0;
    let fifoAmount = sale.amount * -1;

    for (const t of fifoStream) {
      if (fifoAmount <= 0) {
        break;
      }

      if (
        sale.assetSymbol === t.assetSymbol &&
        t.amount > 0 &&
        (t.type === TransactionType.BUY ||
          t.type === TransactionType.DISTRIBUTION ||
          t.type === TransactionType.STAKING_REWARD)
      ) {
        const timeDiffYears = moment(sale.date).diff(t.date, 'years', true);
        if (fifoAmount >= t.amount) {
          if (timeDiffYears < 1) {
            this.sales.push(new TaxableSale(sale, t.amount, t));
            profit += t.amount * sale.price - t.amount * t.price;
          }
          fifoAmount -= t.amount;
          t.amount = 0;
        } else {
          if (timeDiffYears < 1) {
            this.sales.push(new TaxableSale(sale, fifoAmount, t));
            profit += fifoAmount * sale.price - fifoAmount * t.price;
          }
          t.amount -= fifoAmount;
          fifoAmount = 0;
          break;
        }
      }
    }
    if (fifoAmount > 0) {
      this.sales.push(new TaxableSale(sale, fifoAmount));
    }
    return profit;
  }

  constructor(report: TaxReport) {
    this.assets = report.assets;
    this.calculateIncome(report);
    this.calculateHoldings(report);
    this.calculateSales(report);
  }
}

export function printTaxReport(report: TaxReport) {
  const doc = new jsPDF();
  const printedTaxReport = new PrintedTaxReport(report);
  doc.setFontSize(32);
  doc.text('Crypfolio Steuerbericht', 50, 140);
  doc.setFontSize(14);
  doc.text('Steuerjahr: ' + report.taxYear, 85, 150);
  addSummaryPage(doc, printedTaxReport);
  addSalePage(doc, printedTaxReport);
  addIncomePage(doc, printedTaxReport);
  addHoldingsPage(doc, printedTaxReport);
  addFooters(doc);
  doc.save('table.pdf');
}
function addFooters(doc: jsPDF) {
  const pageCount = doc.internal.pages.length - 1;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      'Seite ' + String(i) + '/' + String(pageCount),
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      {
        align: 'center',
      },
    );
  }
}

function addSummaryPage(doc: jsPDF, taxReport: PrintedTaxReport) {
  const salesIncomeLines: RowInput[] = [];
  const incomeLines: RowInput[] = [];
  let salesCost: number = 0;
  let salesProfit: number = 0;
  let salesPrice: number = 0;
  let stakingIncome: number = 0;
  let distributionIncome: number = 0;
  let lastY = 0;

  for (const s of taxReport.sales) {
    salesPrice += s.salePrice * s.amount;
    if (!s.noBuy) {
      salesCost += s.buyPrice * s.amount;
    }
    salesProfit += s.amount * s.salePrice - s.buyPrice * s.amount;
  }

  for (const i of taxReport.income) {
    if (i.type === TransactionType.STAKING_REWARD) {
      stakingIncome += i.amount * i.price;
    } else if (i.type === TransactionType.DISTRIBUTION) {
      distributionIncome += i.amount * i.price;
    }
  }

  salesIncomeLines.push(['Veräußerungspreis:', toEuro(salesPrice)]);
  salesIncomeLines.push(['Anschaffungskosten:', toEuro(salesCost * -1)]);

  incomeLines.push(['Summe Staking:', toEuro(stakingIncome)]);
  incomeLines.push(['Summe Belohnungen/Bonus:', toEuro(distributionIncome)]);

  doc.addPage();
  doc.setFontSize(22);
  doc.text('Zusammenfassung', 14, 20);
  doc.setFontSize(14);
  doc.text(
    'Sonstige Einkünfte aus privaten Veräußerungsgeschäften nach § 23 EStG',
    14,
    30,
  );
  doc.setFontSize(14);
  autoTable(doc, {
    columnStyles: {
      1: {
        halign: 'right',
      },
    },
    didParseCell: (data) => {
      data.table.foot.forEach((footRow) => {
        footRow.cells[1].styles.halign = 'right';
      });
    },
    startY: 35,
    body: salesIncomeLines,
    foot: [
      [
        'Veräußerungsgewinn /-verlust innerhalb der 1-jährigen Haltefrist:',
        toEuro(salesProfit),
      ],
    ],
    showFoot: 'lastPage',
  });
  lastY = (doc as any).lastAutoTable.finalY + 20;
  doc.text('Sonstige Einkünfte nach § 22 Nr. 3 EStG', 14, lastY);
  doc.setFontSize(14);
  autoTable(doc, {
    startY: lastY + 5,
    body: incomeLines,
    columnStyles: {
      1: {
        halign: 'right',
      },
    },
    didParseCell: (data) => {
      data.table.foot.forEach((footRow) => {
        footRow.cells[1].styles.halign = 'right';
      });
    },
    foot: [
      [
        'Summe sonstiger Einkünfte:',
        toEuro(distributionIncome + stakingIncome),
      ],
    ],
    showFoot: 'lastPage',
  });
}

function addIncomePage(doc: jsPDF, taxReport: PrintedTaxReport) {
  const incomeLines: RowInput[] = [];
  let incomeTotal = 0;
  let taxableIncome: TaxableTransaction[] = taxReport.income;

  taxableIncome = taxableIncome.sort((l, u) => {
    return l.date > u.date ? 1 : -1;
  });
  for (const i of taxableIncome) {
    incomeTotal += i.amount * i.price;
    incomeLines.push([
      i.accountName,
      getFormattedDate(i.date),
      i.assetSymbol,
      getTransactionType(i.type),
      i.amount.toFixed(8),
      toEuro(i.price),
      toEuro(i.amount * i.price),
    ]);
  }
  incomeLines.push();
  doc.addPage();
  doc.setFontSize(22);
  doc.text('Auszug - sonstige Einkünfte', 14, 20);

  autoTable(doc, {
    startY: 25,
    head: [
      ['Konto', 'Datum', 'Asset', 'Typ', 'Anzahl', 'Preis pro Einheit', 'Wert'],
    ],
    body: incomeLines,
    columnStyles: {
      4: {
        halign: 'right',
      },
      5: {
        halign: 'right',
      },
      6: {
        halign: 'right',
      },
    },
    didParseCell: (data) => {
      data.table.foot.forEach((footRow) => {
        footRow.cells[6].styles.halign = 'right';
      });
    },
    foot: [['Summe', '', '', '', '', '', toEuro(incomeTotal)]],
    showFoot: 'lastPage',
  });
}

function addSalePage(doc: jsPDF, taxReport: PrintedTaxReport) {
  const incomeLines: RowInput[] = [];
  let incomeTotal = 0;
  let sales: TaxableSale[] = taxReport.sales;

  sales = sales.sort((l, u) => {
    return l.saleDate === u.saleDate
      ? l.buyDate > u.buyDate
        ? 1
        : -1
      : l.saleDate > u.saleDate
      ? 1
      : -1;
  });
  for (const i of sales) {
    const profit = i.amount * i.salePrice - i.buyPrice * i.amount;
    incomeTotal += profit;
    if (i.noBuy) {
      incomeLines.push([
        i.amount.toFixed(8),
        i.symbol,
        '',
        i.saleAccountName,
        '',
        getFormattedDate(i.saleDate),
        toEuro(0),
        toEuro(i.salePrice * i.amount),
        toEuro(profit),
      ]);
    } else {
      incomeLines.push([
        i.amount.toFixed(8),
        i.symbol,
        i.buyAccountName,
        i.saleAccountName,
        getFormattedDate(i.buyDate),
        getFormattedDate(i.saleDate),
        toEuro(i.buyPrice * i.amount),
        toEuro(i.salePrice * i.amount),
        toEuro(profit),
      ]);
    }
  }
  incomeLines.push();

  doc.addPage(undefined, 'landscape');
  doc.setFontSize(22);
  doc.text('Auszug - Einkünfte aus privaten Veräußerungsgeschäften', 14, 20);
  autoTable(doc, {
    startY: 25,
    head: [
      [
        'Anzahl',
        'Asset',
        'Kauf bei',
        'Verkauf bei',
        'Einkaufsdatum',
        'Verkaufsdatum',
        'Kosten',
        'Verkaufspreis',
        'Profit',
      ],
    ],
    columnStyles: {
      0: {
        halign: 'right',
      },
      6: {
        halign: 'right',
      },
      7: {
        halign: 'right',
      },
      8: {
        halign: 'right',
      },
    },
    didParseCell: (data) => {
      data.table.foot.forEach((footRow) => {
        footRow.cells[8].styles.halign = 'right';
      });
    },
    body: incomeLines,
    foot: [['Summe', '', '', '', '', '', '', '', toEuro(incomeTotal)]],
    showFoot: 'lastPage',
  });
}

function addHoldingsPage(doc: jsPDF, report: PrintedTaxReport) {
  let holdingsLine: RowInput[] = [];
  doc.addPage();
  doc.setFontSize(22);
  doc.text('Bestand', 14, 20);
  let lastY = 30;
  for (const h of report.holdingsAfter) {
    doc.setFontSize(14);
    doc.text(h.account.name, 14, lastY);
    const balances = h.holdings
      .map((b) => {
        b.price = getAssetLatestPrice(b.symbol, report.assets);
        return b;
      })
      .sort((l, u) => {
        return l.price * l.amount < u.price * u.amount ? 1 : -1;
      });

    let total = 0;
    balances.forEach((b) => {
      total += b.amount * b.price;
    });

    holdingsLine = [];
    for (const b of balances) {
      if (Number(b.amount.toFixed(8)) === 0) {
        continue;
      }
      holdingsLine.push([
        b.symbol,
        b.amount.toFixed(8),
        toEuro(b.price),
        toEuro(b.amount * b.price),
      ]);
    }

    autoTable(doc, {
      startY: lastY + 5,
      columnStyles: {
        1: {
          halign: 'right',
        },
        2: {
          halign: 'right',
        },
        3: {
          halign: 'right',
        },
      },
      didParseCell: (data) => {
        data.table.foot.forEach((footRow) => {
          footRow.cells[3].styles.halign = 'right';
        });
      },
      head: [['Asset', 'Anzahl', 'Preis pro Einheit', 'Wert']],
      body: holdingsLine,
      foot: [['Summe', '', '', toEuro(total)]],
      showFoot: 'lastPage',
    });
    lastY = (doc as any).lastAutoTable.finalY + 20;
  }
}
