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
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.symbol = symbol;
    this.latestUpdate = new Date(0);
  }
}
