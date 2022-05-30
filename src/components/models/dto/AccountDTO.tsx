import {Account} from '../account';

export class AccountDTO {
  id: string;
  name: string;
  description: string;

  constructor(account: Account) {
    this.id = account.id;
    this.name = account.name;
    this.description = account.description;
  }
}

export function getAccount(account: AccountDTO): Account {
  return new Account(account.id, account.name, account.description);
}
