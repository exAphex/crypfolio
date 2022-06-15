import React, {Component} from 'react';
import {CryptoAsset} from '../../models/CryptoAsset';
import {CryptoAssetDTO, getCryptoAsset} from '../../models/dto/CryptoAssetDTO';
import HistoricCryptoAssetLineChart from '../chart/HistoricCryptoAssetLineChart';
import {withRouter} from '../crypto/CryptoAccountDetail';
const {ipcRenderer} = window.require('electron');

type CryptoAssetDetailParams = {id: string};
type CryptoAssettDetailProps = {params: CryptoAssetDetailParams};
type CryptoAssetDetailState = {
  asset: CryptoAsset;
};

export class CryptoAssetDetail extends Component<
  CryptoAssettDetailProps,
  CryptoAssetDetailState
> {
  state: CryptoAssetDetailState = {
    asset: new CryptoAsset('', '', '', '', new Date(0)),
  };

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('get_crypto_asset');
  }

  componentDidMount() {
    ipcRenderer.on('get_crypto_asset', (_event: any, arg: CryptoAssetDTO) => {
      this.setState({asset: getCryptoAsset(arg)});
    });
    ipcRenderer.send('get_crypto_asset', this.props.params.id);
  }

  render() {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>{this.state.asset.name}</div>
        </div>
        <HistoricCryptoAssetLineChart
          asset={this.state.asset}
        ></HistoricCryptoAssetLineChart>
      </div>
    );
  }
}

export default withRouter(CryptoAssetDetail);
