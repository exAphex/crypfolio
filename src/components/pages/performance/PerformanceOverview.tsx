import React, {Component} from 'react';
import {extractTransactions} from '../../../utils/CryptoCalculator';
import {CryptoAccount} from '../../models/cryptoaccount';
import {CryptoAsset} from '../../models/CryptoAsset';
import {CryptoTransaction} from '../../models/cryptotransaction';
import {CryptoAccountDTO, getAccount} from '../../models/dto/CryptoAccountDTO';
import {CryptoAssetDTO, getCryptoAsset} from '../../models/dto/CryptoAssetDTO';
import {TaxReportError} from '../../models/TaxReportError';
import PerformanceIncomeLineChart from '../chart/PerformanceIncomeLineChart';
const {ipcRenderer} = window.require('electron');

type PerformanceOverviewState = {
  accounts: CryptoAccount[];
  assets: CryptoAsset[];
  transactions: CryptoTransaction[];
};

export class PerformanceOverview extends Component<
  {},
  PerformanceOverviewState
> {
  state: PerformanceOverviewState = {
    accounts: [],
    assets: [],
    transactions: [],
  };

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('list_crypto_assets');
    ipcRenderer.removeAllListeners('list_crypto_accounts');
  }

  componentDidMount() {
    ipcRenderer.on(
      'list_crypto_assets',
      (_event: any, arg: CryptoAssetDTO[]) => {
        const assets: CryptoAsset[] = [];
        if (arg && arg.length) {
          for (const a of arg) {
            assets.push(getCryptoAsset(a));
          }
        }
        this.setState({assets});
      },
    );
    ipcRenderer.on(
      'list_crypto_accounts',
      (_event: any, arg: CryptoAccountDTO[]) => {
        const accs: CryptoAccount[] = [];
        if (arg && arg.length) {
          for (const a of arg) {
            accs.push(getAccount(a));
          }
        }
        this.setState({accounts: accs});
      },
    );
    ipcRenderer.send('list_crypto_accounts');
    ipcRenderer.send('list_crypto_assets');
    ipcRenderer.send('update-app', '');
  }

  render() {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>Performance</div>
        </div>
        <div className="pt-4 pb-8">
          <PerformanceIncomeLineChart
            year={2022}
            assets={this.state.assets}
            accounts={this.state.accounts}
          ></PerformanceIncomeLineChart>
        </div>
      </div>
    );
  }
}
