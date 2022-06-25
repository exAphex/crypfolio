import {Account} from './account';
import {CryptoTransaction} from './cryptotransaction';

export enum SourceType {
  CSV,
  API
}

export type CryptoAccountType = {
  id: string;
  name: string;
  source: SourceType;
};

const accountTypes: CryptoAccountType[] = [
  {id: 'BINANCE', name: 'Binance', source : SourceType.CSV},
  {id: 'KRAKEN', name: 'Kraken', source : SourceType.CSV},
  {id: 'CRYPTO.COM', name: 'Crypto.com', source : SourceType.CSV},
  {id: 'LEDGER', name: 'Ledger', source: SourceType.CSV},
  {id: 'BITCOIN-NETWORK', name: 'Bitcoin (Network)', source: SourceType.API},
];

export type CryptoAccountDTO = {
  id: string;
  name: string;
};

export class CryptoAccount extends Account {
  type: CryptoAccountType;
  address: string;
  transactions: CryptoTransaction[];

  constructor(
    id: string,
    name: string,
    description: string,
    type: CryptoAccountType,
    address: string,
    transactions: CryptoTransaction[],
  ) {
    super(id, name, description);
    this.type = type;
    this.address = address;
    this.transactions = transactions;
  }
}

export function getAccountTypes(): CryptoAccountType[] {
  return accountTypes;
}
