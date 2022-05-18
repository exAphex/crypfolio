import {CryptoHolding} from '../components/models/CryptoHolding';
import {CryptoTransaction} from '../components/models/cryptotransaction';
import {TransactionType} from '../components/models/transaction';

export function getBalance(transactions: CryptoTransaction[]): CryptoHolding[] {
  let retHoldings: CryptoHolding[] = [];
  for (const t of transactions) {
    switch (t.type) {
      case TransactionType.DEPOSIT: {
        retHoldings = addHolding(retHoldings, t);
        break;
      }
      case TransactionType.WITHDRAW: {
        retHoldings = addHolding(retHoldings, t);
        break;
      }
      case TransactionType.SELL: {
        retHoldings = addHolding(retHoldings, t);
        break;
      }
      case TransactionType.BUY: {
        retHoldings = addHolding(retHoldings, t);
        break;
      }
      case TransactionType.FEE: {
        retHoldings = addHolding(retHoldings, t);
        break;
      }
      case TransactionType.DISTRIBUTION: {
        retHoldings = addHolding(retHoldings, t);
        break;
      }
      case TransactionType.STAKING_REWARD: {
        retHoldings = addHolding(retHoldings, t);
        break;
      }
    }
  }
  return retHoldings;
}

function addHolding(
  holdings: CryptoHolding[],
  transaction: CryptoTransaction,
): CryptoHolding[] {
  let foundHolding = false;
  for (const h of holdings) {
    if (h.symbol === transaction.symbol) {
      h.amount += transaction.amount;
      foundHolding = true;
    }
  }
  if (!foundHolding) {
    holdings.push(new CryptoHolding(transaction.symbol, transaction.amount));
  }
  return holdings;
}
