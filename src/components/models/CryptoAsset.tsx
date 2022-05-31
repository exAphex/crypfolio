import {Asset} from './asset';
import {DataProvider} from './DataProvider';

export class CryptoAsset extends Asset {
  dataProvider: DataProvider;

  constructor(id: string, name: string, description: string, symbol: string) {
    super(id, name, description, 'Crypto', symbol);
    this.dataProvider = new DataProvider('COINGECKO', 'Coingecko', '');
  }
}
