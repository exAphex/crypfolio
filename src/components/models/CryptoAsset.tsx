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

export function getCryptoAssetFromSymbol(
  symbol: string,
  assets: CryptoAsset[],
): CryptoAsset | null {
  if (!assets || !symbol) {
    return null;
  }

  for (const a of assets) {
    if (!a.symbol) {
      continue;
    }
    if (a.symbol.toLowerCase() === symbol.toLowerCase()) {
      return a;
    }
  }
  return null;
}
