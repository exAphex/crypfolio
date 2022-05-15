import {Account} from './account';

export type CryptoAccountType = {
  id: string;
  name: string;
};

const accountTypes: CryptoAccountType[] = [
  {id: 'BINANCE', name: 'Binance'},
  {id: 'KRAKEN', name: 'Kraken'},
];

export class CryptoAccount extends Account {
  private type: CryptoAccountType;
  private address: string;

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

  getType(): CryptoAccountType {
    return this.type;
  }

  setType(type: CryptoAccountType): void {
    this.type = type;
  }

  getAddress(): string {
    return this.address;
  }

  setAddress(address: string) {
    this.address = address;
  }
}

export function getAccountTypes(): CryptoAccountType[] {
  return accountTypes;
}
