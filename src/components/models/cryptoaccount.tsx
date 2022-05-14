import {Account} from './account';

type CryptoAccountType = {
  id: string;
  name: string;
};

const accountTypes: CryptoAccountType[] = [
  {id: 'BINANCE', name: 'Binance'},
  {id: 'KRAKEN', name: 'Kraken'},
];

export class CryptoAccount extends Account {
  private type: CryptoAccountType;

  constructor(
    id: string,
    name: string,
    description: string,
    type: CryptoAccountType,
  ) {
    super(id, name, description);
    this.type = type;
  }

  getType(): CryptoAccountType {
    return this.type;
  }

  setType(type: CryptoAccountType): void {
    this.type = type;
  }
}

export function getAccountTypes(): CryptoAccountType[] {
  return accountTypes;
}

export function getCopy(account: CryptoAccount): CryptoAccount {
  const acc: CryptoAccount = new CryptoAccount(
    account.getId(),
    account.getName(),
    account.getDescription(),
    account.getType(),
  );
  return acc;
}
