import {TaxReport} from '../components/models/taxreport/TaxReport';
import jsPDF from 'jspdf';
import autoTable, {RowInput} from 'jspdf-autotable';
import {getFormattedDate} from './DateConverter';
import {toEuro} from './PriceUtils';
import {getTransactionType} from '../components/models/transaction';

export function printTaxReport(report: TaxReport) {
  const doc = new jsPDF();
  doc.setFontSize(32);
  doc.text('Crypfolio Tax Report', 50, 140);
  doc.setFontSize(14);
  doc.text('Report for year: ' + report.taxYear, 75, 150);
  doc.addPage(undefined, 'landscape');

  // income calculation
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
  incomeLines.push(['Total', '', '', '', '', toEuro(incomeTotal)]);

  autoTable(doc, {
    head: [['Account', 'Date', 'Asset', 'Type', 'Amount', 'Total value']],
    body: incomeLines,
    willDrawCell(data) {
      const rows = data.table.body;
      if (data.row.index === rows.length - 1) {
        doc.setFillColor(0, 0, 0);
        doc.setTextColor(255, 255, 255);
      }
    },
  });

  doc.save('table.pdf');
}
