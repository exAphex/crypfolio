import {Transaction, TransactionType} from '../transaction';

export class TransactionDTO {
  id: string;
  date: number;
  type: TransactionType;
  amount: number;

  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.date = transaction.date.getTime();
    this.type = transaction.type;
    this.amount = transaction.amount;
  }
}

export function getTransaction(transaction: TransactionDTO): Transaction {
  return new Transaction(
    transaction.id,
    new Date(transaction.date),
    transaction.type,
    transaction.amount,
  );
}
