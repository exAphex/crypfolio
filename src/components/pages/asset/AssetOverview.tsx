import React, {Component} from 'react';
import {Asset} from '../../models/asset';
import {CryptoAsset} from '../../models/CryptoAsset';
import {CryptoAssetDTO, getCryptoAsset} from '../../models/dto/CryptoAssetDTO';
import {ErrorMessage} from '../../models/ErrorMessage';
import AssetLine from '../../table/AssetLine';
import EditAssetModal from './EditAssetModal';
const {ipcRenderer} = window.require('electron');

type AssetOverviewState = {
  cryptoAssets: CryptoAsset[];
  showEditAssetModal: boolean;
  selectedAsset: CryptoAsset;
  isError: boolean;
  errorMessage: ErrorMessage;
};

export class AssetOverview extends Component<{}, AssetOverviewState> {
  state: AssetOverviewState = {
    cryptoAssets: [],
    showEditAssetModal: false,
    selectedAsset: new CryptoAsset('', '', '', '', new Date(0)),
    isError: false,
    errorMessage: new ErrorMessage('', null),
  };

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('list_crypto_assets');
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
        this.setState({cryptoAssets: assets});
      },
    );

    ipcRenderer.send('list_crypto_assets');
  }

  onRefreshAllAssets() {}

  onUpdateCryptoAsset(asset: CryptoAsset) {
    ipcRenderer.send('update_crypto_asset', new CryptoAssetDTO(asset));
    this.setState({showEditAssetModal: false});
  }

  onCloseModal() {
    this.setState({showEditAssetModal: false});
  }

  onEditCryptoAsset(asset: CryptoAsset) {
    this.setState({selectedAsset: asset, showEditAssetModal: true});
  }

  onRefreshCryptoAsset(asset: CryptoAsset) {
    ipcRenderer
      .invoke('soft_query_crypto_asset', new CryptoAssetDTO(asset))
      .then((retAssetDTO: CryptoAssetDTO) => {
        const retAsset: CryptoAsset = getCryptoAsset(retAssetDTO);
        for (const a of this.state.cryptoAssets) {
          if (a.symbol === asset.symbol) {
            a.isError = false;
            a.prices = retAsset.prices;
            a.latestUpdate = retAsset.latestUpdate;
            break;
          }
        }
        this.setState({cryptoAssets: this.state.cryptoAssets});
      })
      .catch((error: ErrorMessage) => {
        for (const a of this.state.cryptoAssets) {
          if (a.symbol === asset.symbol) {
            a.isError = true;
            break;
          }
        }
        this.setState({cryptoAssets: this.state.cryptoAssets});
      });
  }

  render() {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>Assets</div>
        </div>

        <div className="flex flex-wrap space-x-2 items-center">
          <p className="relative w-full pr-4 max-w-full flex-grow flex-1 text-3xl font-bold text-black"></p>
          <div className="relative w-auto pl-1 flex-initial p-1 ">
            <div className="pt-2 flex gap-2">
              <div className="shadow rounded-lg flex mr-2">
                <button
                  onClick={() => this.onRefreshAllAssets()}
                  type="button"
                  className="rounded-lg inline-flex items-center bg-white hover:text-purple-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="hidden md:block ml-2">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-6">
          <div className="col-start-2 col-span-4"></div>
        </div>
        <div className="pt-4 pb-4">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Type</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Symbol</th>
                <th className="py-3 px-6 text-left">Latest update</th>
                <th className="py-3 px-6 text-right">Latest price (Euro)</th>
                <th className="py-3 px-6 text-left"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm ">
              {this.state.cryptoAssets
                .sort((l, u) => {
                  return l.name > u.name ? 1 : -1;
                })
                .map((item) => (
                  <AssetLine
                    key={item.id}
                    asset={item}
                    assets={this.state.cryptoAssets}
                    onDeleteAsset={(asset: Asset) => {}}
                    onEditAsset={(asset: CryptoAsset) => {
                      this.onEditCryptoAsset(asset);
                    }}
                    onHardRefreshAsset={(asset: Asset) => {}}
                    onRefreshAsset={(asset: CryptoAsset) =>
                      this.onRefreshCryptoAsset(asset)
                    }
                  ></AssetLine>
                ))}
            </tbody>
          </table>
        </div>
        {this.state.showEditAssetModal ? (
          <EditAssetModal
            asset={this.state.selectedAsset}
            onUpdateCryptoAsset={(asset: CryptoAsset) =>
              this.onUpdateCryptoAsset(asset)
            }
            onCloseModal={() => this.onCloseModal()}
          ></EditAssetModal>
        ) : null}
      </div>
    );
  }
}

export default AssetOverview;
