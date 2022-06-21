import {Account} from './account';
import {CryptoTransaction} from './cryptotransaction';

export type CryptoAccountType = {
  id: string;
  name: string;
};

const accountTypes: CryptoAccountType[] = [
  {id: 'BINANCE', name: 'Binance'},
  {id: 'KRAKEN', name: 'Kraken'},
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