import React, {Component} from 'react';
import {CryptoAsset} from '../../models/CryptoAsset';
import {
  DataProvider,
  getAvailableProvider,
  getDataProviderNameById,
} from '../../models/DataProvider';

type EditAssetState = {
  id: string;
  name: string;
  description: string;
  type: string;
  availableDataProviders: DataProvider[];
  dataProviderID: string;
  dataProviderIdentifier: string;
};

type EditAssetProps = {
  asset: CryptoAsset;
  onUpdateCryptoAsset: (asset: CryptoAsset) => void;
  onCloseModal: () => void;
};

export class EditAssetModal extends Component<EditAssetProps, EditAssetState> {
  state: EditAssetState = {
    id: '',
    name: '',
    description: '',
    type: '',
    availableDataProviders: getAvailableProvider(),
    dataProviderID: 'COINGECKO',
    dataProviderIdentifier: '',
  };

  componentDidMount() {
    const currAsset: CryptoAsset = this.props.asset;
    if (currAsset) {
      this.setState({
        id: currAsset.id,
        name: currAsset.name,
        description: currAsset.description,
        type: currAsset.type,
        dataProviderID: currAsset.dataProvider.id,
        dataProviderIdentifier: currAsset.dataProvider.queryIdentifier,
      });
    }
  }

  updateNameValue(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({name: evt.target.value});
  }

  updateDescriptionValue(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({description: evt.target.value});
  }

  updateAssetIdentifierValue(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({dataProviderIdentifier: evt.target.value});
  }

  onSaveAsset() {
    const asset = new CryptoAsset(
      this.state.id,
      this.state.name,
      this.state.description,
      '',
      new Date(0),
    );
    asset.dataProvider = new DataProvider(
      this.state.dataProviderID,
      getDataProviderNameById(this.state.dataProviderID),
      this.state.dataProviderIdentifier,
    );
    this.props.onUpdateCryptoAsset(asset);
  }

  handleChangeType(evt: React.ChangeEvent<HTMLSelectElement>) {
    const providers = this.state.availableDataProviders;
    for (const t of providers) {
      if (t.name === evt.target.value) {
        this.setState({dataProviderID: t.id, dataProviderIdentifier: ''});
        break;
      }
    }
    return 'Coingecko';
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
                      'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10'
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 mt-2"
                      id="modal-title"
                    >
                      Update Asset
                    </h3>
                    <div className="mb-1 w-full flex-col mt-3">
                      <label className="font-medium text-gray-800 py-2">
                        Name
                      </label>
                      <input
                        value={this.state.name}
                        onChange={(evt) => this.updateNameValue(evt)}
                        type="text"
                        placeholder="Personal account"
                        className="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full"
                      />
                    </div>
                    <div className="mb-1 w-full flex-col mt-3">
                      <label className="font-medium text-gray-800 py-2">
                        Description
                      </label>
                      <input
                        value={this.state.description}
                        onChange={(evt) => this.updateDescriptionValue(evt)}
                        type="text"
                        placeholder=""
                        className="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full"
                      />
                    </div>
                    <div className="mb-1 w-full flex-col mt-3">
                      <label className="font-medium text-gray-800 py-2">
                        Data provider
                      </label>
                      <div className="relative ">
                        <svg
                          className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 412 232"
                        >
                          <path
                            d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                            fill="#648299"
                            fillRule="nonzero"
                          />
                        </svg>
                        <select
                          onChange={(evt) => this.handleChangeType(evt)}
                          className="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full"
                        >
                          {this.state.availableDataProviders
                            .sort((l, u) => {
                              return l.name > u.name ? 1 : -1;
                            })
                            .map((item) => (
                              <option key={item.name}>{item.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-1 w-full flex-col mt-3">
                      <label className="font-medium text-gray-800 py-2">
                        Asset identifier
                      </label>
                      <input
                        value={this.state.dataProviderIdentifier}
                        onChange={(evt) => this.updateAssetIdentifierValue(evt)}
                        type="text"
                        placeholder=""
                        className="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    this.onSaveAsset();
                  }}
                  className={
                    'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm'
                  }
                >
                  Update
                </button>
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

export default EditAssetModal;
