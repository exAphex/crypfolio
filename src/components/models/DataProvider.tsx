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

const availableDataProvider: [DataProvider] = [
  new DataProvider('COINGECKO', 'Coingecko', ''),
];

export function getAvailableProvider(): DataProvider[] {
  return availableDataProvider;
}

export function getDataProviderNameById(id: string): string {
  for (const d of availableDataProvider) {
    if (d.id === id) {
      return d.name;
    }
  }
  return '';
}
