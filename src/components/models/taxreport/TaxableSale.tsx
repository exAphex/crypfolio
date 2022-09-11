import {TaxableTransaction} from './TaxableTransaction';

export class TaxableSale {
  saleAccountName: string;
  buyAccountName: string;
  saleDate: Date;
  buyDate: Date;
  buyPrice: number;
  salePrice: number;
  amount: number;
  symbol: string;

  constructor(
    saleTransaction: TaxableTransaction,
    buyTransaction: TaxableTransaction,
    amount: number,
  ) {
    this.saleAccountName = saleTransaction.accountName;
    this.saleDate = saleTransaction.date;
    this.salePrice = saleTransaction.price;

    this.buyAccountName = buyTransaction.accountName;
    this.buyDate = buyTransaction.date;
    this.buyPrice = buyTransaction.price;

    this.symbol = saleTransaction.assetSymbol;
    this.amount = amount;
  }
}
