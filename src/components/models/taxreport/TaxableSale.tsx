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
  noBuy: boolean = true;

  constructor(
    saleTransaction: TaxableTransaction,
    amount: number,
    buyTransaction?: TaxableTransaction,
  ) {
    this.saleAccountName = saleTransaction.accountName;
    this.saleDate = saleTransaction.date;
    this.salePrice = saleTransaction.price;

    if (buyTransaction) {
      this.noBuy = false;
      this.buyAccountName = buyTransaction.accountName;
      this.buyDate = buyTransaction.date;
      this.buyPrice = buyTransaction.price;
    } else {
      this.buyAccountName = '';
      this.buyDate = new Date();
      this.buyPrice = 0;
    }

    this.symbol = saleTransaction.assetSymbol;
    this.amount = amount;
  }
}
