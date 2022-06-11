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
  return retAsset;
}
