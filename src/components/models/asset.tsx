export class Asset {
  id: string;
  name: string;
  description: string;
  type: string;
  symbol: string;
  latestUpdate: Date;

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
  }
}
