import {Account} from './account';

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

  constructor(
    id: string,
    name: string,
    description: string,
    type: CryptoAccountType,
    address: string,
  ) {
    super(id, name, description);
    this.type = type;
    this.address = address;
  }
}

export function getAccountTypes(): CryptoAccountType[] {
  return accountTypes;
}
