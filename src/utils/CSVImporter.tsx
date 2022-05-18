import sha1 from 'sha1';
import {CryptoTransaction} from '../components/models/cryptotransaction';
import {TransactionType} from '../components/models/transaction';

export function parseCSVArray(data: string[][]): CryptoTransaction[] {
  const transactions: CryptoTransaction[] = [];
  if (data.length === 0) {
    return transactions;
  }

  if (
    data[0][0] !== 'User_ID' ||
    data[0][1] !== 'UTC_Time' ||
    data[0][2] !== 'Account' ||
    data[0][3] !== 'Operation' ||
    data[0][4] !== 'Coin' ||
    data[0][5] !== 'Change' ||
    data[0][6] !== 'Remark'
  ) {
    return transactions;
  }
  data.splice(0, 1);

  for (const line of data) {
    if (line.length < 7) {
      continue;
    }
    transactions.push(
      new CryptoTransaction(
        getLineHash(line),
        getDateFromString(line[1]),
        getTransactionType(line[3], Number(line[5])),
        Number(line[5]),
        line[4],
      ),
    );
  }
  return transactions;
}

function getDateFromString(data: string): Date {
  return new Date(data);
}

export function getLineHash(line: string[]): string {
  let data = '';
  for (const item of line) {
    data += item;
  }
  return sha1(data);
}

export function getTransactionType(
  data: string,
  amount: number,
): TransactionType {
  switch (data) {
    case 'Deposit': {
      return TransactionType.DEPOSIT;
    }
    case 'Withdraw': {
      return TransactionType.WITHDRAW;
    }
    case 'Distribution': {
      return TransactionType.DISTRIBUTION;
    }
    case 'Super BNB Mining': {
      return TransactionType.DISTRIBUTION;
    }
    case 'Cash Voucher distribution': {
      return TransactionType.DISTRIBUTION;
    }
    case 'POS savings interest': {
      return TransactionType.STAKING_REWARD;
    }
    case 'Savings Interest': {
      return TransactionType.STAKING_REWARD;
    }
    case 'Savings purchase': {
      return TransactionType.STAKE;
    }
    case 'POS savings purchase': {
      return TransactionType.STAKE;
    }
    case 'Savings Principal redemption': {
      return TransactionType.UNSTAKE;
    }
    case 'Sell': {
      return TransactionType.SELL;
    }
    case 'Buy': {
      return TransactionType.BUY;
    }
    case 'Fee': {
      return TransactionType.FEE;
    }
    case 'Small assets exchange BNB': {
      return amount >= 0 ? TransactionType.BUY : TransactionType.SELL;
    }
    case 'Transaction Related': {
      return amount >= 0 ? TransactionType.BUY : TransactionType.SELL;
    }
    default: {
      return TransactionType.UNKNOWN;
    }
  }
}
