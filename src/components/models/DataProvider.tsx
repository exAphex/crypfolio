export class DataProvider {
  id: string;
  name: string;
  queryIdentifier: string;

  constructor(id: string, name: string, queryIdentifier: string) {
    this.id = id;
    this.name = name;
    this.queryIdentifier = queryIdentifier;
  }
}

export function getAvailableProvider(): DataProvider[] {
  return [new DataProvider('COINGECKO', 'Coingecko', '')];
}
