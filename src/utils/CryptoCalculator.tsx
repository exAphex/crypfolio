import {CryptoAccount} from '../components/models/cryptoaccount';
import {CryptoHolding} from '../components/models/CryptoHolding';
import {CryptoTransaction} from '../components/models/cryptotransaction';
import {TransactionType} from '../components/models/transaction';

export function getBalance(transactions: CryptoTransaction[]): CryptoHolding[] {
  let retHoldings: CryptoHolding[] = [];
  for (const t of transactions) {
    retHoldings = processTransactionToHolding(t, retHoldings);
  }
  return retHoldings;
}

export function processTransactionToHolding(
  transaction: CryptoTransaction,
  holdings: CryptoHolding[],
): CryptoHolding[] {
  switch (transaction.type) {
    case TransactionType.DEPOSIT: {
      return addHolding(holdings, transaction);
    }
    case TransactionType.WITHDRAW: {
      return addHolding(holdings, transaction);
    }
    case TransactionType.SELL: {
      return addHolding(holdings, transaction);
    }
    case TransactionType.BUY: {
      return addHolding(holdings, transaction);
    }
    case TransactionType.FEE: {
      return addHolding(holdings, transaction);
    }
    case TransactionType.DISTRIBUTION: {
      return addHolding(holdings, transaction);
    }
    case TransactionType.STAKING_REWARD: {
      return addHolding(holdings, transaction);
    }
  }
  return [];
}

export function addHolding(
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
    holdings.push(new CryptoHolding(transaction.symbol, transaction.amount, 0));
  }
  return holdings;
}

export function extractTransactions(
  accounts: CryptoAccount[],
): CryptoTransaction[] {
  const transactions: CryptoTransaction[] = [];
  for (const a of accounts) {
    if (a.transactions && a.transactions.length > 0) {
      for (const t of a.transactions) {
        transactions.push(t);
      }
    }
  }
  return transactions;
}
