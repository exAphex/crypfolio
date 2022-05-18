export enum TransactionType {
  DEPOSIT,
  WITHDRAW,
  FEE,
  DIVIDEND,
  STAKING_REWARD,
  INTEREST,
  UNKNOWN,
  DISTRIBUTION,
  SELL,
  BUY,
  STAKE,
  UNSTAKE,
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

export function getTransactionType(typeId: number) {
  switch (typeId) {
    case 0: {
      return 'Deposit';
    }
    case 1: {
      return 'Withdraw';
    }
    case 2: {
      return 'Fee';
    }
    case 3: {
      return 'Dividend';
    }
    case 4: {
      return 'Staking reward';
    }
    case 7: {
      return 'Distribution/Airdrop';
    }
    case 8: {
      return 'Sell';
    }
    case 9: {
      return 'Buy';
    }
    case 10: {
      return 'Stake';
    }
    case 11: {
      return 'Unstake';
    }
    default: {
      return 'Unkown';
    }
  }
}
