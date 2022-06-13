import {Asset} from '../components/models/asset';

export function getAssetLatestPrice(symbol: string, assets: Asset[]): number {
  let price = 0;
  for (const a of assets) {
    if (a.symbol === symbol) {
      const prices = a.prices
        ? a.prices.sort((l, u) => {
            return l.date < u.date ? 1 : -1;
          })
        : [];
      if (prices.length > 0) {
        price = prices[0].value;
        break;
      }
    }
  }
  return price;
}

export function toEuro(amount: number): string {
  if (!amount) {
    amount = 0;
  }
  return amount.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });
}
