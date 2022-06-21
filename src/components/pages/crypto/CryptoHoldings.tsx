import React, {Component} from 'react';
import CryptoHoldingLine from '../../table/CryptoHoldingLine';
import {getBalance} from '../../../utils/CryptoCalculator';
import {CryptoTransaction} from '../../models/cryptotransaction';
import {CryptoAsset} from '../../models/CryptoAsset';
import {getAssetLatestPrice} from '../../../utils/PriceUtils';
import {CryptoHolding} from '../../models/CryptoHolding';

type CryptoHoldingsProps = {
  transactions: CryptoTransaction[];
  assets: CryptoAsset[];
};

export class CryptoHoldings extends Component<CryptoHoldingsProps, {}> {
  getHoldings(
    transactions: CryptoTransaction[],
    assets: CryptoAsset[],
  ): CryptoHolding[] {
    const allHoldings = getBalance(transactions);
    allHoldings.map((holding) => {
      holding.price = getAssetLatestPrice(holding.symbol, assets);
      return holding;
    });

    return allHoldings;
  }

  render() {
    return (
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-right">Amount</th>
            <th className="py-3 px-6 text-right">Amount (Euro)</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm ">
          {this.getHoldings(this.props.transactions, this.props.assets)
            .filter((item) => item.symbol !== 'EUR')
            .filter((item) => item.amount !== 0)
            .filter((item) => Number(item.amount.toFixed(8)) !== 0)
            .sort((l, u) => {
              return l.amount * l.price < u.amount * u.price ? 1 : -1;
            })
            .map((item) => (
              <CryptoHoldingLine
                key={item.symbol}
                amount={item.amount}
                name={item.symbol}
                price={item.price}
              ></CryptoHoldingLine>
            ))}
        </tbody>
      </table>
    );
  }
}

export default CryptoHoldings;
