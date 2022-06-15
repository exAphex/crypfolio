import {Asset, AssetPrice} from '../asset';

export type AssetPriceDTO = {
  date: number;
  value: number;
};

export class AssetDTO {
  id: string;
  name: string;
  description: string;
  type: string;
  symbol: string;
  latestUpdate: number;
  prices: AssetPriceDTO[];

  constructor(asset: Asset) {
    this.id = asset.id;
    this.name = asset.name;
    this.description = asset.description;
    this.type = asset.type;
    this.symbol = asset.symbol;
    this.latestUpdate = asset.latestUpdate.getTime
      ? asset.latestUpdate.getTime()
      : 0;

    this.prices = [];
    if (asset.prices) {
      for (const p of asset.prices) {
        this.prices.push({date: p.date.getTime(), value: p.value});
      }
    }
  }
}
