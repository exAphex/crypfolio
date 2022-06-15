import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {getFormattedDate} from '../../utils/DateConverter';
import {getAssetLatestPrice, toEuro} from '../../utils/PriceUtils';
import {formatError} from '../../utils/utils';
import {CryptoAsset} from '../models/CryptoAsset';

type AssetLineProps = {
  asset: CryptoAsset;
  assets: CryptoAsset[];
  onRefreshAsset: (acc: CryptoAsset) => void;
  onHardRefreshAsset: (acc: CryptoAsset) => void;
  onEditAsset: (acc: CryptoAsset) => void;
  onDeleteAsset: (acc: CryptoAsset) => void;
};

export class AssetLine extends Component<AssetLineProps, {}> {
  formatLastUpdate(asset: CryptoAsset): string {
    if (!asset.latestUpdate) {
      return '-';
    }
    if (asset.latestUpdate <= new Date(1)) {
      return '-';
    }
    return getFormattedDate(asset.latestUpdate);
  }
  render() {
    const latestPrice = getAssetLatestPrice(
      this.props.asset.symbol,
      this.props.assets,
    );
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 whitespace-nowrap">
          <div className="flex">
            {!this.props.asset.dataProvider ||
            !this.props.asset.dataProvider.id ||
            !this.props.asset.dataProvider.name ||
            !this.props.asset.dataProvider.queryIdentifier ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="orange"
                strokeWidth={2}
              >
                <title>No data provider id defined!</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            ) : (
              <></>
            )}

            {this.props.asset.isError ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="red"
                strokeWidth={2}
              >
                <title>{formatError(this.props.asset.err)}</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            ) : (
              <></>
            )}
            <Link
              className={'font-medium'}
              to={'/cryptoasset/' + this.props.asset.id}
            >
              <span className="font-bold">{this.props.asset.name}</span>
            </Link>
            <span className="font-bold pl-2"></span>
          </div>
        </td>
        <td className="py-3 px-6 text-left">
          <span>{this.props.asset.type}</span>
        </td>
        <td className="py-3 px-6 text-left">
          <span>{this.props.asset.description}</span>
        </td>
        <td className="py-3 px-6 text-left">
          <span>{this.props.asset.symbol}</span>
        </td>
        <td className="py-3 px-6 text-left">
          <span>{this.formatLastUpdate(this.props.asset)}</span>
        </td>
        <td className="py-3 px-6 text-right">
          <span>{latestPrice > 0 ? toEuro(latestPrice) : '-'}</span>
        </td>
        <td className="py-3 px-6 text-center">
          <div className="flex item-center justify-end">
            <div
              onClick={() => this.props.onRefreshAsset(this.props.asset)}
              className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div
              onClick={() => this.props.onEditAsset(this.props.asset)}
              className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            </div>
            <div
              onClick={() => this.props.onEditAsset(this.props.asset)}
              className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <div
              onClick={() => this.props.onDeleteAsset(this.props.asset)}
              className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>
        </td>
      </tr>
    );
  }
}

export default AssetLine;
