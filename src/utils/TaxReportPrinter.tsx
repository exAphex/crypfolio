import {TaxReport} from '../components/models/taxreport/TaxReport';
import jsPDF from 'jspdf';
import autoTable, {RowInput} from 'jspdf-autotable';
import {getFormattedDate} from './DateConverter';
import {getAssetLatestPrice, toEuro} from './PriceUtils';
import {getTransactionType} from '../components/models/transaction';
import {getBalance} from './CryptoCalculator';

export function printTaxReport(report: TaxReport) {
  const doc = new jsPDF();
  doc.setFontSize(32);
  doc.text('Crypfolio Tax Report', 50, 140);
  doc.setFontSize(14);
  doc.text('Report for year: ' + report.taxYear, 75, 150);
  doc.addPage(undefined, 'landscape');

  addIncomePage(doc, report);
  addHoldingsPage(doc, report);

  doc.save('table.pdf');
}

function addIncomePage(doc: jsPDF, report: TaxReport) {
  const incomeLines: RowInput[] = [];
  let incomeTotal = 0;
  report.taxableIncome = report.taxableIncome.sort((l, u) => {
    return l.date > u.date ? 1 : -1;
  });
  for (const i of report.taxableIncome) {
    incomeTotal += i.amount * i.price;
    incomeLines.push([
      i.accountName,
      getFormattedDate(i.date),
      i.assetSymbol,
      getTransactionType(i.type),
      i.amount.toFixed(8),
      toEuro(i.amount * i.price),
    ]);
  }
  incomeLines.push();

  autoTable(doc, {
    head: [['Account', 'Date', 'Asset', 'Type', 'Amount', 'Total value']],
    body: incomeLines,
    foot: [['Total', '', '', '', '', toEuro(incomeTotal)]],
    showFoot: 'lastPage',
  });
}

function addHoldingsPage(doc: jsPDF, report: TaxReport) {
  let holdingsLine: RowInput[] = [];
  for (const a of report.accounts) {
    const balances = getBalance(a.transactions)
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
    doc.text(a.name, 14, 20);
    autoTable(doc, {
      startY: 25,
      head: [['Symbol', 'Amount', 'Price per unit', 'Total']],
      body: holdingsLine,
      foot: [['Total', '', '', toEuro(total)]],
      showFoot: 'lastPage',
    });
  }
}
