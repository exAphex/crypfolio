import {Asset} from '../asset';

export class AssetDTO {
  id: string;
  name: string;
  description: string;
  type: string;
  symbol: string;
  latestUpdate: number;

  constructor(asset: Asset) {
    this.id = asset.id;
    this.name = asset.name;
    this.description = asset.description;
    this.type = asset.type;
    this.symbol = asset.symbol;
    this.latestUpdate = asset.latestUpdate.getTime();
  }
}
