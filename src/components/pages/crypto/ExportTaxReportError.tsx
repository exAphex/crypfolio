import React, {Component} from 'react';
import {TaxReportError} from '../../models/TaxReportError';
import ErrorLine from '../../table/ErrorLine';

type ExportTaxReportErrorProps = {
  errors: TaxReportError[];
  onCloseModal: () => void;
};

export class ExportTaxReportError extends Component<
  ExportTaxReportErrorProps,
  {}
> {
  render() {
    return (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="w-full relative w-auto my-6 mx-auto max-w-sm">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
              <div className="bg-white">
                <div className="sm:flex sm:items-start"></div>
                <table className="min-w-max w-full table-auto p-8">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Error</th>
                      <th className="py-3 px-6 text-left">Possible fix</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm ">
                    {this.props.errors.map((item) => (
                      <ErrorLine
                        key={item.error}
                        error={item.error}
                        fix={item.fix}
                      ></ErrorLine>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => this.props.onCloseModal()}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    );
  }
}

export default ExportTaxReportError;
