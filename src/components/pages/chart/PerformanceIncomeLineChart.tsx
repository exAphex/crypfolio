import React, {Component} from 'react';
import 'chartjs-adapter-moment';
import {Bar} from 'react-chartjs-2';
import {CryptoAsset, getCryptoAssetFromSymbol} from '../../models/CryptoAsset';
import {CryptoAccount} from '../../models/cryptoaccount';
import {extractTransactions, getBalance} from '../../../utils/CryptoCalculator';
import {getAssetLatestPrice} from '../../../utils/PriceUtils';
import {CryptoTransaction} from '../../models/cryptotransaction';
import {TransactionType} from '../../models/transaction';
import moment from 'moment';

type PerformanceIncomeLineChartProps = {
  year: number;
  assets: CryptoAsset[];
  accounts: CryptoAccount[];
};

type PerformanceIncomeLineChartState = {
  total: number;
};

export class PerformanceIncomeLineChart extends Component<
  PerformanceIncomeLineChartProps,
  PerformanceIncomeLineChartState
> {
  state = {
    total: 0,
  };

  parseChartOption(): any {
    const options = {
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label(tooltipItem: any) {
              let label = tooltipItem.dataset.label || '';

              if (label) {
                label += ': ';
              }
              label += tooltipItem.raw.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
              });
              return label;
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

    const tmpStaking: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const tmpDistribution: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (const t of allTransactions) {
      const tempAsset = getCryptoAssetFromSymbol(t.symbol, assets);
      if (tempAsset) {
        if (t.date.getFullYear() === this.props.year) {
          switch (t.type) {
            case TransactionType.STAKING_REWARD:
              tmpStaking[t.date.getMonth()] +=
                t.amount * tempAsset.getPrice(t.date);
              break;
            case TransactionType.DISTRIBUTION:
              tmpDistribution[t.date.getMonth()] +=
                t.amount * tempAsset.getPrice(t.date);
              break;
          }
        }
      }
    }

    const labels: any[] = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const data = {
      labels,
      datasets: [
        {
          label: 'Staking rewards',
          data: tmpStaking,
          backgroundColor: ['rgba(75, 192, 192, 1)'],
          borderWidth: 1,
        },
        {
          label: 'Distribution',
          data: tmpDistribution,
          backgroundColor: ['rgba(30, 144, 255, 1)'],
          borderWidth: 1,
        },
      ],
    };

    return data;
  }

  render() {
    return (
      <div>
        <Bar
          data={this.parseChartData(this.props.assets, this.props.accounts)}
          options={this.parseChartOption()}
          type={undefined}
        />
      </div>
    );
  }
}

export default PerformanceIncomeLineChart;
