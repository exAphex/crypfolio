import {Asset} from './asset';
import {DataProvider} from './DataProvider';

export class CryptoAsset extends Asset {
  symbol: string;
  dataProvider: DataProvider;

  constructor(id: string, name: string, description: string, symbol: string) {
    super(id, name, description);
    this.symbol = symbol;
    this.dataProvider = new DataProvider('COINGECKO', 'Coingecko');
  }
}
