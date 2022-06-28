import {CryptoTransaction} from '../components/models/cryptotransaction';
import {TransactionType} from '../components/models/transaction';
import {getDateFromString} from '../utils/DateConverter';
import {CSVImporterInterface} from './CSVImporterInterface';

export class LedgerCSVImporter implements CSVImporterInterface {
  transactions: CryptoTransaction[];

  constructor(data: string[][]) {
    if (this.validateCSV(data)) {
      this.transactions = this.parseCSVArray(data);
    } else {
      this.transactions = [];
    }
  }

  validateCSV(data: string[][]): boolean {
    if (data.length === 0) {
      return false;
    }

    if (
      data[0][0] !== 'Operation Date' ||
      data[0][1] !== 'Currency Ticker' ||
      data[0][2] !== 'Operation Type' ||
      data[0][3] !== 'Operation Amount' ||
      data[0][4] !== 'Operation Fees' ||
      data[0][5] !== 'Operation Hash' ||
      data[0][6] !== 'Account Name' ||
      data[0][7] !== 'Account xpub' ||
      data[0][8] !== 'Countervalue Ticker' ||
      data[0][9] !== 'Countervalue at Operation Date' ||
      data[0][10] !== 'Countervalue at CSV Export'
    ) {
      throw new Error('Could not recognize CSV file!');
    }
    return true;
  }

  parseCSVArray(data: string[][]): CryptoTransaction[] {
    const transactions: CryptoTransaction[] = [];
    // delete header
    data.splice(0, 1);

    for (const line of data) {
      if (line.length < 11) {
        continue;
      }

      transactions.push(this.getTransaction(line));

      const fees = Number(line[4]);
      if (fees > 0) {
        /* transactions.push(
          new CryptoTransaction(
            line[5] + 'fee',
            getDateFromString(line[0]),
            TransactionType.FEE,
            -1 * Number(line[4]),
            line[1],
          ),
        );*/
      }
    }
    return transactions;
  }

  getTransaction(line: string[]): CryptoTransaction {
    switch (line[2]) {
      case 'IN':
        return new CryptoTransaction(
          line[5],
          getDateFromString(line[0]),
          TransactionType.DEPOSIT,
          Number(line[3]),
          line[1],
        );
      case 'OUT':
        return new CryptoTransaction(
          line[5],
          getDateFromString(line[0]),
          TransactionType.WITHDRAW,
          -1 * Number(line[3]),
          line[1],
        );
      case 'REWARD':
        return new CryptoTransaction(
          line[5],
          getDateFromString(line[0]),
          TransactionType.STAKING_REWARD,
          Number(line[3]),
          line[1],
        );
      default: {
        return new CryptoTransaction(
          line[5],
          getDateFromString(line[0]),
          TransactionType.UNKNOWN,
          Number(line[3]),
          line[1],
        );
      }
    }
  }
}
