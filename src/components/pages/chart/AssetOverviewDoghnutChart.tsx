import React, {Component} from 'react';
import 'chartjs-adapter-moment';
import {Doughnut} from 'react-chartjs-2';
import {CryptoAsset} from '../../models/CryptoAsset';
import {CryptoAccount} from '../../models/cryptoaccount';
import {extractTransactions, getBalance} from '../../../utils/CryptoCalculator';
import {getAssetLatestPrice} from '../../../utils/PriceUtils';

type AssetOverviewDoghnutChartProps = {
  assets: CryptoAsset[];
  accounts: CryptoAccount[];
};

type AssetOverviewDoghnutChartState = {
  total: number;
};

export class AssetOverviewDoghnutChart extends Component<
  AssetOverviewDoghnutChartProps,
  AssetOverviewDoghnutChartState
> {
  state = {
    total: 0,
  };

  parseChartOption(): any {
    const options = {
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return (
                context.label +
                ' ' +
                context.raw.toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 2,
                })
              );
            },
          },
        },
      },
    };

    return options;
  }

  parseChartData(assets: CryptoAsset[], accounts: CryptoAccount[]): any {
    if (!accounts || !assets) {
      return;
    }

    const allTransactions = extractTransactions(accounts);
    const allHoldings = getBalance(allTransactions);

    const tmpData: any[] = [];
    const labels: any[] = [];

    allHoldings
      .map((holding) => {
        holding.price = getAssetLatestPrice(holding.symbol, assets);
        return holding;
      })
      .sort((l, u) => {
        return l.amount * l.price < u.amount * u.price ? 1 : -1;
      })
      .forEach((holding) => {
        labels.push(holding.symbol);
        tmpData.push(holding.amount * holding.price);
      });

    const data = {
      labels,
      datasets: [
        {
          label: '# of Votes',
          data: tmpData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return data;
  }

  render() {
    return (
      <div>
        <Doughnut
          data={this.parseChartData(this.props.assets, this.props.accounts)}
          options={this.parseChartOption()}
          type={undefined}
        />
      </div>
    );
  }
}

export default AssetOverviewDoghnutChart;
