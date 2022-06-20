import React, {Component} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {CryptoAccount} from '../models/cryptoaccount';
import {CryptoAsset} from '../models/CryptoAsset';
import {CryptoAssetDTO, getCryptoAsset} from '../models/dto/CryptoAssetDTO';
import AssetOverviewDoghnutChart from './chart/AssetOverviewDoghnutChart';
const {ipcRenderer} = window.require('electron');

type HomePageState = {
  accounts: CryptoAccount[];
  assets: CryptoAsset[];
};

export class HomePage extends Component<{}, HomePageState> {
  state = {
    accounts: [],
    assets: [],
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
        this.setState({accounts: arg});
      },
    );
    ipcRenderer.send('list_crypto_accounts');
    ipcRenderer.send('list_crypto_assets');
  }

  onRefreshAccounts() {}

  render() {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>Home</div>
        </div>
        <div className="flex items-center justify-center border-b">
          <AssetOverviewDoghnutChart
            assets={this.state.assets}
            accounts={this.state.accounts}
          ></AssetOverviewDoghnutChart>
        </div>
      </div>
    );
  }
}

export default HomePage;
