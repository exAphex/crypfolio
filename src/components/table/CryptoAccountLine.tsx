import React, {Component} from 'react';
import {CryptoAccount} from '../models/cryptoaccount';
import {getIconByAccountType} from '../../utils/utils';
import {Link} from 'react-router-dom';

type CryptoAccountLineProps = {
  account: CryptoAccount;
  onEditAccount: (acc: CryptoAccount) => void;
  onDeleteAccount: (acc: CryptoAccount) => void;
};

export class CryptoAccountLine extends Component<CryptoAccountLineProps, {}> {
  render() {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 whitespace-nowrap">
          <Link
            className={'font-medium'}
            to={'/cryptodetail/' + this.props.account.id}
          >
            <span className="font-bold">{this.props.account.name}</span>
          </Link>
        </td>
        <td className="py-3 px-6 text-left">
          <div className="flex">
            <div>{getIconByAccountType(this.props.account.type)}</div>
            <div className="pl-2">{this.props.account.type.name}</div>
          </div>
        </td>
        <td className="py-3 px-6 text-left">
          <span>{this.props.account.description}</span>
        </td>
        <td className="py-3 px-6 text-left">
          <span>{this.props.account.address}</span>
        </td>
        <td className="py-3 px-6 text-center">
          <div className="flex item-center justify-end">
            <div
              onClick={() => this.props.onEditAccount(this.props.account)}
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
              onClick={() => this.props.onDeleteAccount(this.props.account)}
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

export default CryptoAccountLine;
