import {CryptoAsset} from '../CryptoAsset';
import {DataProvider} from '../DataProvider';
import {AssetDTO} from './AssetDTO';

export class CryptoAssetDTO extends AssetDTO {
  dataProvider: DataProvider;

  constructor(asset: CryptoAsset) {
    super(asset);
    this.dataProvider = asset.dataProvider;
  }
}

export function getCryptoAsset(asset: CryptoAssetDTO): CryptoAsset {
  const retAsset = new CryptoAsset(
    asset.id,
    asset.name,
    asset.description,
    asset.symbol,
    new Date(asset.latestUpdate),
  );
  retAsset.dataProvider = asset.dataProvider;
  retAsset.prices = [];
  if (asset.prices) {
    for (const p of asset.prices) {
      retAsset.prices.push({date: new Date(p.date), value: p.value});
    }
  }
  return retAsset;
}
