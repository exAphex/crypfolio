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
}
