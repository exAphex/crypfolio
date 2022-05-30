import React, {Component} from 'react';
import {Asset} from '../../models/asset';
import {CryptoAsset} from '../../models/CryptoAsset';
import AssetLine from '../../table/AssetLine';
const {ipcRenderer} = window.require('electron');

type AssetOverviewState = {
  cryptoAssets: CryptoAsset[];
};

export class AssetOverview extends Component<{}, AssetOverviewState> {
  state: AssetOverviewState = {
    cryptoAssets: [],
  };

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('list_crypto_assets');
  }

  componentDidMount() {
    ipcRenderer.on('list_crypto_assets', (_event: any, arg: CryptoAsset[]) => {
      this.setState({cryptoAssets: arg});
    });
    ipcRenderer.send('list_crypto_assets');
  }

  onImportCSV() {}

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
                  onClick={() => this.onImportCSV()}
                  type="button"
                  className="rounded-lg inline-flex items-center bg-white hover:text-purple-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="hidden md:block ml-2">Import CSV</span>
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
                <th className="py-3 px-6 text-left"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm ">
              {this.state.cryptoAssets.map((item) => (
                <AssetLine
                  key={item.id}
                  asset={item}
                  onDeleteAsset={(asset: Asset) => {}}
                  onEditAsset={(asset: Asset) => {}}
                  onHardRefreshAsset={(asset: Asset) => {}}
                  onRefreshAsset={(asset: Asset) => {}}
                ></AssetLine>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default AssetOverview;
