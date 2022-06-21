import React, {Component} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {extractTransactions} from '../../utils/CryptoCalculator';
import {CryptoAccount} from '../models/cryptoaccount';
import {CryptoAsset} from '../models/CryptoAsset';
import {CryptoTransaction} from '../models/cryptotransaction';
import {CryptoAssetDTO, getCryptoAsset} from '../models/dto/CryptoAssetDTO';
import AssetOverviewDoghnutChart from './chart/AssetOverviewDoghnutChart';
import CryptoHoldings from './crypto/CryptoHoldings';
const {ipcRenderer} = window.require('electron');

type HomePageState = {
  accounts: CryptoAccount[];
  assets: CryptoAsset[];
  transactions: CryptoTransaction[];
};

export class HomePage extends Component<{}, HomePageState> {
  state = {
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
      (_event: any, arg: CryptoAccount[]) => {
        const transactions = extractTransactions(arg);
        this.setState({accounts: arg, transactions});
      },
    );
    ipcRenderer.send('list_crypto_accounts');
    ipcRenderer.send('list_crypto_assets');
  }

  render() {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>Home</div>
        </div>
        <div className="flex justify-center items-center h-full p-4">
          <AssetOverviewDoghnutChart
            assets={this.state.assets}
            accounts={this.state.accounts}
          ></AssetOverviewDoghnutChart>
        </div>
        <div className="pt-4 pb-4">
          <CryptoHoldings
            transactions={this.state.transactions}
            assets={this.state.assets}
          ></CryptoHoldings>
        </div>
      </div>
    );
  }
}

export default HomePage;
