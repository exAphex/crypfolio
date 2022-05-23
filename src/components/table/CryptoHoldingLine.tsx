import React, {Component} from 'react';

type CryptoTransactionLineProps = {
  name: string;
  amount: number;
};

export class CryptoHoldingLine extends Component<
  CryptoTransactionLineProps,
  {}
> {
  render() {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 whitespace-nowrap">
          <span className="font-bold">{this.props.name}</span>
        </td>
        <td className="py-3 px-6 text-right">
          <span>{this.props.amount.toFixed(8)}</span>
        </td>
      </tr>
    );
  }
}

export default CryptoHoldingLine;
