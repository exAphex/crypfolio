import {Asset} from './asset';
import {DataProvider} from './DataProvider';

export class CryptoAsset extends Asset {
  dataProvider: DataProvider;

  constructor(
    id: string,
    name: string,
    description: string,
    symbol: string,
    latestUpdate: Date,
  ) {
    super(id, name, description, 'Crypto', symbol, latestUpdate);
    this.dataProvider = new DataProvider('COINGECKO', 'Coingecko', '');
  }
}
