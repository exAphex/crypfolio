import React, {Component} from 'react';

type ErrorLineProps = {
  error: string;
  fix: string;
};

export class ErrorLine extends Component<ErrorLineProps, {}> {
  render() {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 whitespace-nowrap">
          <span className="font-bold">{this.props.error}</span>
        </td>
        <td className="py-3 px-6">
          <span>{this.props.fix === '' ? '-' : this.props.fix}</span>
        </td>
      </tr>
    );
  }
}

export default ErrorLine;
