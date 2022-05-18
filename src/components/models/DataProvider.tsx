export class DataProvider {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export function getAvailableProvider(): DataProvider[] {
  return [new DataProvider('COINGECKO', 'Coingecko')];
}
