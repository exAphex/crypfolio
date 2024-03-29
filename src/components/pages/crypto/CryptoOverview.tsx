import React, {Component} from 'react';
import {v1 as uuidv1} from 'uuid';
import AddCryptoAccount from './AddCryptoAccount';
import 'react-datepicker/dist/react-datepicker.css';
import {CryptoAccount, SourceType} from '../../models/cryptoaccount';
import CryptoAccountLine from '../../table/CryptoAccountLine';
import {CryptoAccountDTO, getAccount} from '../../models/dto/CryptoAccountDTO';
import {CryptoAssetDTO, getCryptoAsset} from '../../models/dto/CryptoAssetDTO';
import {CryptoAsset} from '../../models/CryptoAsset';
import {CryptoTransaction} from '../../models/cryptotransaction';
import {TaxReport} from '../../models/taxreport/TaxReport';
import {printTaxReport} from '../../../utils/TaxReportPrinter';
import ExportTaxReportError from './taxreport/ExportTaxReportError';
import {TaxReportError} from '../../models/TaxReportError';
import moment from 'moment';
import ExportTaxReportProperties from './taxreport/ExportTaxReportProperties';
const {ipcRenderer} = window.require('electron');

type CryptoOverviewState = {
  showNewAccountModal: boolean;
  showExportTaxModal: boolean;
  showExportTaxPropertiesModal: boolean;
  isUpdate: boolean;
  accounts: CryptoAccount[];
  selectedAccount: CryptoAccount;
  errorTaxReport: TaxReportError[];
};

export class CryptoOverview extends Component<{}, CryptoOverviewState> {
  state: CryptoOverviewState = {
    showNewAccountModal: false,
    showExportTaxModal: false,
    showExportTaxPropertiesModal: false,
    errorTaxReport: [],
    accounts: [],
    isUpdate: false,
    selectedAccount: new CryptoAccount(
      '',
      '',
      '',
      {id: 'BINANCE', name: 'Binance', source: SourceType.CSV},
      '',
      [],
    ),
  };

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('list_crypto_accounts');
  }

  componentDidMount() {
    ipcRenderer.on(
      'list_crypto_accounts',
      (_event: any, arg: CryptoAccount[]) => {
        this.setState({accounts: arg});
      },
    );
    ipcRenderer.send('list_crypto_accounts');
  }

  setShowNewAccountModal(show: boolean) {
    this.setState({showNewAccountModal: show});
  }

  onAddAccount() {
    this.setState({
      isUpdate: false,
      selectedAccount: new CryptoAccount(
        '',
        '',
        '',
        {id: 'BINANCE', name: 'Binance', source: SourceType.CSV},
        '',
        [],
      ),
    });
    this.setShowNewAccountModal(true);
  }

  onCreateAccount(acc: CryptoAccount) {
    acc.id = uuidv1();
    ipcRenderer.send('add_crypto_account', acc);
    this.setShowNewAccountModal(false);
  }

  onUpdateAccount(acc: CryptoAccount) {
    ipcRenderer.send('update_crypto_account', acc);
    this.setShowNewAccountModal(false);
  }

  onCloseModal(): void {
    this.setShowNewAccountModal(false);
  }

  onCloseTaxReportModal(): void {
    this.setState({showExportTaxModal: false});
  }

  onCloseTaxExportPropertiesModal(): void {
    this.setState({showExportTaxPropertiesModal: false});
  }

  onEditAccount(acc: CryptoAccount) {
    this.setState({isUpdate: true, selectedAccount: acc});
    this.setShowNewAccountModal(true);
  }

  onDeleteAccount(acc: CryptoAccount) {
    ipcRenderer.send('delete_crypto_account', acc);
  }

  generateTaxReport(year: number) {
    const accounts: CryptoAccount[] = [];
    const assets: CryptoAsset[] = [];
    ipcRenderer
      .invoke('i_list_crypto_accounts')
      .then((accs: CryptoAccountDTO[]) => {
        for (const a of accs) {
          accounts.push(getAccount(a));
        }
        return ipcRenderer.invoke('i_list_crypto_assets');
      })
      .then((ass: CryptoAssetDTO[]) => {
        for (const a of ass) {
          assets.push(getCryptoAsset(a));
        }
        this.calculateTaxReport(year, accounts, assets);
      })
      .catch((error: TaxReportError) =>
        this.setState({errorTaxReport: [error], showExportTaxModal: true}),
      );
  }

  onGenerateTaxReport() {
    this.setState({showExportTaxPropertiesModal: true});
  }

  extractTransactions(accounts: CryptoAccount[]): CryptoTransaction[] {
    const transactions: CryptoTransaction[] = [];
    for (const a of accounts) {
      if (a.transactions && a.transactions.length > 0) {
        for (const t of a.transactions) {
          transactions.push(t);
        }
      }
    }
    return transactions;
  }

  validateAsset(asset: CryptoAsset) {
    const today = moment();
    if (!asset.latestUpdate || !asset.prices || asset.prices.length === 0) {
      throw new TaxReportError(
        'Asset with symbol ' + asset.symbol + ' has no pricefeed!',
        'Add provider id and refresh price feed in the "Assets" view!',
      );
    }
    if (today.diff(moment(asset.latestUpdate), 'days') > 1) {
      throw new TaxReportError(
        'Outdated price feed for asset ' + asset.symbol + '!',
        'Refresh price feed in the "Assets" view!',
      );
    }
  }

  calculateTaxReport(
    year: number,
    accounts: CryptoAccount[],
    assets: CryptoAsset[],
  ) {
    const taxReport: TaxReport = new TaxReport(year, assets);
    taxReport.addAccounts(accounts);
    this.printTaxReport(taxReport);
  }

  printTaxReport(taxReport: TaxReport) {
    printTaxReport(taxReport);
  }

  render() {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>Crypto accounts</div>
        </div>

        <div className="flex flex-wrap space-x-2 items-center">
          <p className="relative w-full pr-4 max-w-full flex-grow flex-1 text-3xl font-bold text-black"></p>
          <div className="relative w-auto pl-1 flex-initial p-1 ">
            <div className="pt-2 flex gap-2">
              <div className="shadow rounded-lg flex mr-2">
                <button
                  onClick={() => this.onAddAccount()}
                  type="button"
                  className="rounded-lg inline-flex items-center bg-white hover:text-purple-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="hidden md:block ml-2">Add Account</span>
                </button>
              </div>
              <div className="shadow rounded-lg flex mr-2">
                <button
                  onClick={() => this.onGenerateTaxReport()}
                  type="button"
                  className="rounded-lg inline-flex items-center bg-white hover:text-purple-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
                    />
                  </svg>
                  <span className="hidden md:block ml-2">
                    Generate Tax report
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-6">
          <div className="col-start-2 col-span-4"></div>
        </div>
        <div className="pt-4 pb-4">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Type</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm ">
              {this.state.accounts
                .sort((l, u) => {
                  return l.name > u.name ? 1 : -1;
                })
                .map((item) => (
                  <CryptoAccountLine
                    key={item.id}
                    account={item}
                    onEditAccount={(acc: CryptoAccount) => {
                      this.onEditAccount(acc);
                    }}
                    onDeleteAccount={(acc: CryptoAccount) => {
                      this.onDeleteAccount(acc);
                    }}
                  ></CryptoAccountLine>
                ))}
            </tbody>
          </table>
          {this.state.showNewAccountModal ? (
            <AddCryptoAccount
              isUpdate={this.state.isUpdate}
              account={this.state.selectedAccount}
              onCreateNewAccount={(acc: CryptoAccount) =>
                this.onCreateAccount(acc)
              }
              onUpdateAccount={(acc: CryptoAccount) =>
                this.onUpdateAccount(acc)
              }
              onCloseModal={() => this.onCloseModal()}
            ></AddCryptoAccount>
          ) : null}
          {this.state.showExportTaxModal ? (
            <ExportTaxReportError
              errors={this.state.errorTaxReport}
              onCloseModal={() => this.onCloseTaxReportModal()}
            ></ExportTaxReportError>
          ) : null}
          {this.state.showExportTaxPropertiesModal ? (
            <ExportTaxReportProperties
              onGenerateTaxReport={(year) => {
                this.setState({showExportTaxPropertiesModal: false});
                this.generateTaxReport(year);
              }}
              onCloseModal={() => this.onCloseTaxExportPropertiesModal()}
            ></ExportTaxReportProperties>
          ) : null}
        </div>
      </div>
    );
  }
}

export default CryptoOverview;
