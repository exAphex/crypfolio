import React, {Component} from 'react';
import {Asset} from '../models/asset';

type AssetLineProps = {
  asset: Asset;
  onRefreshAsset: (acc: Asset) => void;
  onHardRefreshAsset: (acc: Asset) => void;
  onEditAsset: (acc: Asset) => void;
  onDeleteAsset: (acc: Asset) => void;
};

export class AssetLine extends Component<AssetLineProps, {}> {
  formatLastUpdate(asset: Asset): string {
    if (!asset.latestUpdate) {
      return '-';
    }
    if (asset.latestUpdate <= new Date(1)) {
      return '-';
    }
    return asset.latestUpdate + '';
  }
  render() {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 whitespace-nowrap">
          <span className="font-bold">{this.props.asset.name}</span>
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
        <td className="py-3 px-6 text-center">
          <div className="flex item-center justify-end">
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
