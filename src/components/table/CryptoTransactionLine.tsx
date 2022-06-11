import React, {Component} from 'react';
import {getFormattedDate} from '../../utils/DateConverter';
import {CryptoTransaction} from '../models/cryptotransaction';
import {getTransactionType, TransactionType} from '../models/transaction';

type CryptoTransactionLineProps = {
  transaction: CryptoTransaction;
};

export class CryptoTransactionLine extends Component<
  CryptoTransactionLineProps,
  {}
> {
  getColorBackground(type: TransactionType): string {
    switch (type) {
      case TransactionType.WITHDRAW:
        return 'bg-yellow-200';
      case TransactionType.BUY:
        return 'bg-blue-200';
      case TransactionType.DEPOSIT:
        return 'bg-blue-200';
      case TransactionType.DISTRIBUTION:
        return 'bg-green-200';
      case TransactionType.DIVIDEND:
        return 'bg-green-200';
      case TransactionType.FEE:
        return 'bg-red-200';
      case TransactionType.INTEREST:
        return 'bg-green-200';
      case TransactionType.SELL:
        return 'bg-red-200';
      case TransactionType.STAKE:
        return 'bg-fuchsia-200';
      case TransactionType.STAKING_REWARD:
        return 'bg-green-200';
      case TransactionType.UNKNOWN:
        return 'bg-gray-200';
      case TransactionType.UNSTAKE:
        return 'bg-fuchsia-200';
      default:
        return 'bg-gray-200';
    }
  }

  getColorText(type: TransactionType): string {
    switch (type) {
      case TransactionType.WITHDRAW:
        return 'text-yellow-800';
      case TransactionType.BUY:
        return 'text-blue-800';
      case TransactionType.DEPOSIT:
        return 'text-blue-800';
      case TransactionType.DISTRIBUTION:
        return 'text-green-800';
      case TransactionType.DIVIDEND:
        return 'text-green-800';
      case TransactionType.FEE:
        return 'text-red-800';
      case TransactionType.INTEREST:
        return 'text-green-800';
      case TransactionType.SELL:
        return 'text-red-800';
      case TransactionType.STAKE:
        return 'text-fuchsia-800';
      case TransactionType.STAKING_REWARD:
        return 'text-green-800';
      case TransactionType.UNKNOWN:
        return 'text-gray-800';
      case TransactionType.UNSTAKE:
        return 'text-fuchsia-800';
      default:
        return 'text-gray-800';
    }
  }

  render() {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 whitespace-nowrap">
          <span className="font-bold">
            {getFormattedDate(this.props.transaction.date)}
          </span>
        </td>
        <td className="py-3 px-6 text-center">
          <span
            className={
              this.getColorBackground(this.props.transaction.type) +
              ' ' +
              this.getColorText(this.props.transaction.type) +
              ' text-xs font-semibold mr-2 px-2.5 py-0.5 rounded'
            }
          >
            {getTransactionType(this.props.transaction.type)}
          </span>
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
