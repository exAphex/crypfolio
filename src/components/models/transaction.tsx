export enum TransactionType {
  DEPOSIT,
  WITHDRAW,
  FEE,
  DIVIDEND,
  STAKING_REWARD,
  INTEREST,
}

export class Transaction {
  id: string;
  date: Date;
  type: TransactionType;
  amount: number;

  constructor(id: string, date: Date, type: TransactionType, amount: number) {
    this.id = id;
    this.date = date;
    this.type = type;
    this.amount = amount;
  }

  getId(): string {
    return this.id;
  }

  getDate(): Date {
    return this.date;
  }

  setDate(date: Date): void {
    this.date = date;
  }

  getType(): TransactionType {
    return this.type;
  }

  setType(type: TransactionType) {
    this.type = type;
  }
}
