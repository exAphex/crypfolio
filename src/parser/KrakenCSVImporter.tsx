import {CryptoTransaction} from '../components/models/cryptotransaction';
import {TransactionType} from '../components/models/transaction';
import moment from 'moment';

export class KrakenCSVImporter {
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
      data[0][0] !== 'txid' ||
      data[0][1] !== 'refid' ||
      data[0][2] !== 'time' ||
      data[0][3] !== 'type' ||
      data[0][4] !== 'subtype' ||
      data[0][5] !== 'aclass' ||
      data[0][6] !== 'asset' ||
      data[0][7] !== 'amount' ||
      data[0][8] !== 'fee' ||
      data[0][9] !== 'balance'
    ) {
      return false;
    }
    return true;
  }

  parseCSVArray(data: string[][]): CryptoTransaction[] {
    const transactions: CryptoTransaction[] = [];
    // delete header
    data.splice(0, 1);

    for (const line of data) {
      if (line.length < 7) {
        continue;
      }
      if (line[0] === '') {
        continue;
      }

      transactions.push(
        new CryptoTransaction(
          line[0],
          getDateFromString(line[2]),
          getTransactionType(line[3], Number(line[7]),line[6]),
          Number(line[7]),
          parseSymbol(line[6]),
        ),
      );

      const fees = Number(line[8]);
      if (fees > 0) {
        transactions.push(
          new CryptoTransaction(
            line[0] + 'fee',
            getDateFromString(line[2]),
            TransactionType.FEE,
            -1*Number(line[8]),
            parseSymbol(line[6]),
          ),
        );
      }
    }
    return transactions;
  }
}

function getDateFromString(date: string): Date {
  return moment(date).toDate();
}

function parseSymbol(symbol: string) : string {
  if (!symbol) {
    return "";
  }

  symbol = symbol.toUpperCase();

  if (symbol.length < 2) {
    return symbol;
  }

  let possibleSuffix = symbol.slice(-2);

  if (possibleSuffix === '.S') {
    return symbol.slice(0, -2);
  } else {
    return symbol;
  }
}

function getTransactionType(
  data: string,
  amount: number,
  symbol: string
): TransactionType {
  switch (data) {
    case 'staking': {
      return TransactionType.STAKING_REWARD;
    }
    case 'trade' : {
      if (amount >= 0) {
        return TransactionType.BUY;
      } else {
        return TransactionType.SELL;
      }
    }
    case 'spend': {
      return TransactionType.SELL;
    }
    case 'deposit': {
      return TransactionType.DEPOSIT;
    }
    case 'withdrawal': {
      return TransactionType.WITHDRAW;
    }
    case 'dividend': {
      return TransactionType.DISTRIBUTION;
    }
    case 'receive': {
      return TransactionType.DEPOSIT;
    }
    default: {
      return TransactionType.UNKNOWN;
    }
  }
}
