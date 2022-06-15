import React, {Component} from 'react';
import moment from 'moment';
import 'chartjs-adapter-moment';
import {Line} from 'react-chartjs-2';
import {CryptoAsset} from '../../models/CryptoAsset';

type HistoricCryptoAssetLineChartProps = {
  asset: CryptoAsset;
};

export class HistoricCryptoAssetLineChart extends Component<
  HistoricCryptoAssetLineChartProps,
  {}
> {
  parseChartOption(): any {
    const options = {
      spanGaps: 1000 * 60 * 60 * 24 * 2,
      interaction: {
        axis: 'xy',
        mode: 'index',
        intersect: false,
      },
      animation: {
        duration: 0,
      },
      plugins: {
        tooltip: {
          callbacks: {
            label(context: any) {
              let label = context.dataset.label || '';

              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y.toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 2,
                });
              }
              return label;
            },
          },
        },
      },
      responsive: true,
      radius: 0,
      scales: {
        x: {
          type: 'time',

          time: {
            // Luxon format string
            unit: 'day',
            stepSize: 1,
            tooltipFormat: 'DD.MM.YYYY',
          },
          ticks: {
            min: 0,
            max: 4,
          },
        },
        y: {
          ticks: {
            callback(value: any) {
              return value + ' €';
            },
          },
        },
      },
    };

    return options;
  }

  parseChartData(asset: CryptoAsset): any {
    if (!asset || !asset.prices) {
      return;
    }

    const tmpData: any[] = [];
    asset.prices
      .sort((l, u) => {
        return l.date > u.date ? 1 : -1;
      })
      .forEach((item) => {
        tmpData.push({x: moment(item.date).toDate(), y: item.value});
      });

    const obj = {
      label: asset.name,
      data: tmpData,
      spanGaps: !1,
      borderWidth: 2,
      pointRadius: 0,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
    };
    const sets = {
      datasets: [obj],
    };
    return sets;
  }

  render() {
    return (
      <div>
        <Line
          data={this.parseChartData(this.props.asset)}
          options={this.parseChartOption()}
          type={undefined}
        />
      </div>
    );
  }
}

export default HistoricCryptoAssetLineChart;
