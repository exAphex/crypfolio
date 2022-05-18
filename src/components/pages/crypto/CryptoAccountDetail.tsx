import React, {Component, createRef} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {useParams} from 'react-router-dom';
import {CryptoAccount} from '../../models/cryptoaccount';
import {parseCSVArray} from '../../../utils/CSVImporter';
import ImportCSVModal from './ImportCSVModal';
import {CryptoTransaction} from '../../models/cryptotransaction';
import {TransactionType} from '../../models/transaction';
import CryptoTransactionLine from '../../table/CryptoTransactionLine';
import {getBalance} from '../../../utils/CryptoCalculator';
const {ipcRenderer} = window.require('electron');

type CryptoAccountDetailParams = {id: string};
type CryptoAccountDetailProps = {params: CryptoAccountDetailParams};
type CryptoAccountDetailState = {
  account: CryptoAccount;
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
    account: new CryptoAccount('', '', '', {id: '', name: ''}, ''),
    showImportCSVModal: false,
  };
  myRef = createRef();

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('get_crypto_account');
  }

  componentDidMount() {
    ipcRenderer.on('get_crypto_account', (_event: any, arg: CryptoAccount) => {
      this.setState({account: arg});
    });
    ipcRenderer.send('get_crypto_account', this.props.params.id);
  }

  onImportCSV() {
    this.setState({showImportCSVModal: true});
  }

  onCloseCSVModal() {
    this.setState({showImportCSVModal: false});
  }

  onImportedFile(data: string[][]) {
    this.onCloseCSVModal();
    const transactions: CryptoTransaction[] = parseCSVArray(data);
    const candidateTransactions: CryptoTransaction[] = [];
    for (const t of transactions) {
      if (t.type === TransactionType.UNKNOWN) {
        continue;
      }
      candidateTransactions.push(t);
    }
    ipcRenderer.send('add_crypto_account_transactions', {
      id: this.state.account.id,
      transactions: candidateTransactions,
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
            </div>
          </div>
        </div>
        <div className="grid grid-cols-6">
          <div className="col-start-2 col-span-4">
            {getBalance(this.state.account.transactions)
              .filter((item) => item.amount !== 0)
              .filter((item) => Number(item.amount.toFixed(8)) !== 0)
              .map((item) => (
                <div>{item.symbol + ' - ' + item.amount.toFixed(8)}</div>
              ))}
          </div>
        </div>
        <div className="pt-4 pb-4">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Type</th>
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
