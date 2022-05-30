import {CryptoAccount, CryptoAccountType} from '../cryptoaccount';
import {CryptoTransaction} from '../cryptotransaction';
import {AccountDTO} from './AccountDTO';
import {CryptoTransactionDTO, getTransaction} from './CryptoTransactionDTO';

export class CryptoAccountDTO extends AccountDTO {
  type: CryptoAccountType;
  address: string;
  transactions: CryptoTransactionDTO[];

  constructor(account: CryptoAccount) {
    super(account);
    this.type = account.type;
    this.address = account.address;
    this.transactions = [];
  }
}

export function getAccount(acc: CryptoAccountDTO): CryptoAccount {
  const transactions: CryptoTransaction[] = [];
  for (const t of acc.transactions) {
    transactions.push(getTransaction(t));
  }
  return new CryptoAccount(
    acc.id,
    acc.name,
    acc.description,
    acc.type,
    acc.address,
    transactions,
  );
}
