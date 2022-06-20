export class CryptoHolding {
  symbol: string;
  amount: number;
  price: number;

  constructor(symbol: string, amount: number, price: number) {
    this.symbol = symbol;
    this.amount = amount;
    this.price = price;
  }
}
