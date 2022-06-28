import React, {Component} from 'react';
import CSVReader from 'react-csv-reader';
import {CryptoAccount, SourceType} from '../../models/cryptoaccount';

type ImportCSVModalState = {
  account: CryptoAccount;
  data: string[][];
};

type ImportCSVModalProps = {
  account: CryptoAccount;
  onCloseModal: () => void;
  onImportedFile: (data: string[][]) => void;
};

export class ImportCSVModal extends Component<
  ImportCSVModalProps,
  ImportCSVModalState
> {
  state: ImportCSVModalState = {
    account: new CryptoAccount('', '', '', {id: '', name: '', source: SourceType.CSV}, '', []),
    data: [],
  };

  componentDidMount() {
    this.setState({account: this.props.account});
  }

  render() {
    return (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="w-full relative w-auto my-6 mx-auto max-w-sm">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className={
                      'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10'
                    }
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
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 mt-2"
                      id="modal-title"
                    >
                      Import CSV file
                    </h3>
                    <div className="mb-1 w-full flex-col mt-3">
                      <label className="font-medium text-gray-800 py-2">
                        File
                      </label>
                      <CSVReader
                        onFileLoaded={(
                          fileData: string[][],
                          fileInfo,
                          originalFile,
                        ) => this.setState({data: fileData})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => this.props.onImportedFile(this.state.data)}
                  className={
                    'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm'
                  }
                >
                  Import file
                </button>
                <button
                  onClick={() => this.props.onCloseModal()}
                  type="button"
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

export default ImportCSVModal;
