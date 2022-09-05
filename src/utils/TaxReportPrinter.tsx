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

class PrintedTaxReport {
  income: TaxableTransaction[] = [];
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
        let profit = this.calculateFifoProfit(t, fifoStreamTransactions);
        console.log(t);
        console.log(profit);
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
          t.type === TransactionType.DEPOSIT ||
          t.type === TransactionType.DISTRIBUTION ||
          t.type === TransactionType.STAKING_REWARD)
      ) {
        const timeDiffYears = moment(sale.date).diff(t.date, 'years', true);
        if (fifoAmount >= t.amount) {
          if (timeDiffYears < 1) {
            profit += t.amount * sale.price - t.amount * t.price;
          }
          fifoAmount -= t.amount;
          t.amount = 0;
        } else {
          if (timeDiffYears < 1) {
            profit += fifoAmount * sale.price - fifoAmount * t.price;
          }
          t.amount -= fifoAmount;
          fifoAmount = 0;
          break;
        }
      }
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
  doc.text('Crypfolio Tax Report', 50, 140);
  doc.setFontSize(14);
  doc.text('Report for year: ' + report.taxYear, 75, 150);
  doc.addPage(undefined, 'landscape');

  addIncomePage(doc, printedTaxReport);
  addHoldingsPage(doc, printedTaxReport);

  doc.save('table.pdf');
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

  autoTable(doc, {
    head: [
      [
        'Account',
        'Date',
        'Asset',
        'Type',
        'Amount',
        'Price per unit',
        'Total value',
      ],
    ],
    body: incomeLines,
    foot: [['Total', '', '', '', '', '', toEuro(incomeTotal)]],
    showFoot: 'lastPage',
  });
}

function addHoldingsPage(doc: jsPDF, report: PrintedTaxReport) {
  let holdingsLine: RowInput[] = [];
  for (const h of report.holdingsAfter) {
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

    doc.addPage();
    doc.text(h.account.name, 14, 20);
    autoTable(doc, {
      startY: 25,
      head: [['Symbol', 'Amount', 'Price per unit', 'Total']],
      body: holdingsLine,
      foot: [['Total', '', '', toEuro(total)]],
      showFoot: 'lastPage',
    });
  }
}
