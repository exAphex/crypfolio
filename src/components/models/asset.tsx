import {ErrorMessage} from './ErrorMessage';

export type AssetPrice = {
  date: Date;
  value: number;
};

export class Asset {
  id: string;
  name: string;
  description: string;
  type: string;
  symbol: string;
  latestUpdate: Date;
  prices: AssetPrice[];
  isError: boolean;
  err: ErrorMessage;

  constructor(
    id: string,
    name: string,
    description: string,
    type: string,
    symbol: string,
    latestUpdate: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.symbol = symbol;
    this.latestUpdate = latestUpdate;
    this.prices = [];
    this.isError = false;
    this.err = new ErrorMessage('', '');
  }

  getPrice(targetDate: Date): number {
    if (!targetDate) {
      throw new Error('Unkown targetDate called in function getPrice');
    }

    if (!this.prices || this.prices.length === 0) {
      throw new Error('No pricefeed for Asset with symbol: ' + this.symbol);
    }

    const previousDates = this.prices.filter(
      (e) => targetDate.getTime() - e.date.getTime() > 0,
    );
    const sortedPreviousDates = previousDates.sort((l, u) => {
      return l.date < u.date ? 1 : -1;
    });
    return sortedPreviousDates[0] && sortedPreviousDates[0].value > 0
      ? sortedPreviousDates[0].value
      : 0;
  }
}
