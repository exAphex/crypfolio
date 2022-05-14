import {Transaction, TransactionType} from './transaction';

export class CryptoTransaction extends Transaction {
  symbol: string;

  constructor(
    id: string,
    date: Date,
    type: TransactionType,
    amount: number,
    symbol: string,
  ) {
    super(id, date, type, amount);
    this.symbol = symbol;
  }

  getSymbol(): string {
    return this.symbol;
  }

  setSymbol(symbol: string): void {
    this.symbol = symbol;
  }
}
