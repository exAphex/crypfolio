import React, {Component, createRef} from 'react';
import {useParams} from 'react-router-dom';
import {CryptoAccount, SourceType} from '../../models/cryptoaccount';
import {parseCSVArray} from '../../../utils/CSVImporter';
import {lowerCase} from '../../../utils/utils';
import ImportCSVModal from './ImportCSVModal';
import {CryptoTransaction} from '../../models/cryptotransaction';
import {TransactionType} from '../../models/transaction';
import CryptoTransactionLine from '../../table/CryptoTransactionLine';
import CryptoHoldings from './CryptoHoldings';
import {CryptoAsset} from '../../models/CryptoAsset';
import {CryptoTransactionDTO} from '../../models/dto/CryptoTransactionDTO';
import {CryptoAccountDTO, getAccount} from '../../models/dto/CryptoAccountDTO';
import {CryptoAssetDTO, getCryptoAsset} from '../../models/dto/CryptoAssetDTO';
import {KrakenCSVImporter} from '../../../parser/KrakenCSVImporter';
import {CryptoDotComCSVImporter} from '../../../parser/CryptoDotComCSVImporter';
import {LedgerCSVImporter} from '../../../parser/LedgerCSVImporter';
const {ipcRenderer} = window.require('electron');

type CryptoAccountDetailParams = {id: string};
type CryptoAccountDetailProps = {params: CryptoAccountDetailParams};
type CryptoAccountDetailState = {
  account: CryptoAccount;
  assets: CryptoAsset[];
  showImportCSVModal: boolean;
};

// tslint:disable-next-line: no-shadowed-variable
export const withRouter = (Component: React.ComponentType<any>) => {
  const WithRouter = (props: any) => {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
  return WithRouter;
};

export class CryptoAccountDetail extends Component<
  CryptoAccountDetailProps,
  CryptoAccountDetailState
> {
  state = {
    account: new CryptoAccount(
      '',
      '',
      '',
      {id: '', name: '', source: SourceType.CSV},
      '',
      [],
    ),
    assets: [],
    showImportCSVModal: false,
  };
  myRef = createRef();

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('get_crypto_account');
    ipcRenderer.removeAllListeners('list_crypto_assets');
  }

  componentDidMount() {
    ipcRenderer.on(
      'get_crypto_account',
      (_event: any, arg: CryptoAccountDTO) => {
        this.setState({account: getAccount(arg)});
      },
    );
    ipcRenderer.on(
      'list_crypto_assets',
      (_event: any, arg: CryptoAssetDTO[]) => {
        const assets: CryptoAsset[] = [];
        if (arg && arg.length) {
          for (const a of arg) {
            assets.push(getCryptoAsset(a));
          }
        }
        this.setState({assets});
      },
    );
    ipcRenderer.send('list_crypto_assets');
    ipcRenderer.send('get_crypto_account', this.props.params.id);
  }

  onImportCSV() {
    this.setState({showImportCSVModal: true});
  }

  onCloseCSVModal() {
    this.setState({showImportCSVModal: false});
  }

  parseCSVArray(data: string[][]): CryptoTransaction[] {
    switch (this.state.account.type.id) {
      case 'BINANCE':
        return parseCSVArray(data);
      case 'KRAKEN':
        const krakenImporter = new KrakenCSVImporter(data);
        return krakenImporter.transactions;
      case 'CRYPTO.COM':
        const cryptoDotComImporter = new CryptoDotComCSVImporter(data);
        return cryptoDotComImporter.transactions;
      case 'LEDGER':
        const ledgerImporter = new LedgerCSVImporter(data);
        return ledgerImporter.transactions;
      default:
        return [];
    }
  }

  onImportedFile(data: string[][]) {
    this.onCloseCSVModal();
    const transactions: CryptoTransaction[] = this.parseCSVArray(data);
    const candidateTransactions: CryptoTransactionDTO[] = [];
    for (const t of transactions) {
      if (t.type === TransactionType.UNKNOWN || lowerCase(t.symbol) === 'eur') {
        continue;
      }
      candidateTransactions.push(new CryptoTransactionDTO(t));
    }
    ipcRenderer.send('add_crypto_account_transactions', {
      id: this.state.account.id,
      transactions: candidateTransactions,
    });

    ipcRenderer.send('add_crypto_assets', {
      assets: this.getAssetCandidates(candidateTransactions),
    });
  }

  getAssetCandidates(transactions: CryptoTransactionDTO[]): CryptoAsset[] {
    const retAssets: CryptoAsset[] = [];
    for (const t of transactions) {
      if (!this.isAssetDuplicate(retAssets, t.symbol)) {
        retAssets.push(
          new CryptoAsset(t.symbol, t.symbol, '', t.symbol, new Date(0)),
        );
      }
    }
    return retAssets;
  }

  isAssetDuplicate(assets: CryptoAsset[], symbol: string): boolean {
    if (lowerCase(symbol) === 'eur') {
      return true;
    }

    for (const a of assets) {
      if (lowerCase(a.symbol) === lowerCase(symbol)) {
        return true;
      }
    }
    return false;
  }

  onRefreshAccount(account: CryptoAccount) {
    ipcRenderer
      .invoke('soft_query_crypto_account', account.id)
      .then((transactions: CryptoTransactionDTO[]) => {
        console.log(transactions);
      })
      .catch((error: Error) => {
        
      });
  }

  render() {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>{this.state.account.name}</div>
        </div>

        <div className="flex flex-wrap space-x-2 items-center">
          <p className="relative w-full pr-4 max-w-full flex-grow flex-1 text-3xl font-bold text-black"></p>
          <div className="relative w-auto pl-1 flex-initial p-1 ">
            <div className="pt-2 flex gap-2">
              {this.state.account.type.source === SourceType.CSV ? (
                <div className="shadow rounded-lg flex mr-2">
                  <button
                    onClick={() => this.onImportCSV()}
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

                    <span className="hidden md:block ml-2">Import CSV</span>
                  </button>
                </div>
              ) : null}
              {this.state.account.type.source === SourceType.API ? (
                <div className="shadow rounded-lg flex mr-2">
                  <button
                    onClick={() => this.onRefreshAccount(this.state.account)}
                    type="button"
                    className="rounded-lg inline-flex items-center bg-white hover:text-purple-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4"
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>

                    <span className="hidden md:block ml-2">Refresh</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="pt-4 pb-4">
          <CryptoHoldings
            transactions={this.state.account.transactions}
            assets={this.state.assets}
          ></CryptoHoldings>
        </div>

        <div className="pt-4 pb-4">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-center">Type</th>
                <th className="py-3 px-6 text-left">Coin</th>
                <th className="py-3 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm ">
              {this.state.account.transactions
                .sort((l, u) => {
                  return l.date < u.date ? 1 : -1;
                })
                .map((item) => (
                  <CryptoTransactionLine
                    key={item.id}
                    transaction={item}
                  ></CryptoTransactionLine>
                ))}
            </tbody>
          </table>
          {this.state.showImportCSVModal ? (
            <ImportCSVModal
              account={this.state.account}
              onCloseModal={() => this.onCloseCSVModal()}
              onImportedFile={(data: string[][]) => this.onImportedFile(data)}
            ></ImportCSVModal>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withRouter(CryptoAccountDetail);
