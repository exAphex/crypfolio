import {CryptoAccount} from '../cryptoaccount';
import {CryptoTransaction} from '../cryptotransaction';
import {TransactionType} from '../transaction';

export class TaxableTransaction {
  accountName: string;
  type: TransactionType;
  date: Date;
  amount: number;
  assetSymbol: string;
  price: number;

  constructor(
    account: CryptoAccount,
    transaction: CryptoTransaction,
    price: number,
  ) {
    this.accountName = account.name;
    this.type = transaction.type;
    this.date = transaction.date;
    this.amount = transaction.amount;
    this.assetSymbol = transaction.symbol;
    this.price = price;
  }
}
