import React, {Component} from 'react';
import {CryptoTransaction} from '../models/cryptotransaction';
import {getTransactionType} from '../models/transaction';

type CryptoTransactionLineProps = {
  transaction: CryptoTransaction;
};

export class CryptoTransactionLine extends Component<
  CryptoTransactionLineProps,
  {}
> {
  render() {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 whitespace-nowrap">
          <span className="font-bold">{this.props.transaction.date + ''}</span>
        </td>
        <td className="py-3 px-6 text-left">
          <div className="flex">
            <div className="pl-2">
              {getTransactionType(this.props.transaction.type)}
            </div>
          </div>
        </td>
        <td className="py-3 px-6 text-left">
          <span>{this.props.transaction.symbol}</span>
        </td>
        <td className="py-3 px-6 text-right">
          <span>{this.props.transaction.amount.toFixed(8)}</span>
        </td>
      </tr>
    );
  }
}

export default CryptoTransactionLine;
