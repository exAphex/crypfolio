import {CryptoTransaction} from '../cryptotransaction';
import {TransactionType} from '../transaction';
import {TransactionDTO} from './TransactionDTO';

export class CryptoTransactionDTO extends TransactionDTO {
  symbol: string;

  constructor(transaction: CryptoTransaction) {
    super(transaction);
    this.symbol = transaction.symbol;
  }
}

export function getTransaction(
  transaction: CryptoTransactionDTO,
): CryptoTransaction {
  return new CryptoTransaction(
    transaction.id,
    new Date(transaction.date),
    transaction.type,
    transaction.amount,
    transaction.symbol,
  );
}
