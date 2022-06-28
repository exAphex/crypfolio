import sha1 from 'sha1';
import {CryptoTransaction} from '../components/models/cryptotransaction';
import {CSVImporterInterface} from './CSVImporterInterface';
import {TransactionType} from '../components/models/transaction';
import {getDateFromString} from '../utils/DateConverter';

export class CryptoDotComCSVImporter implements CSVImporterInterface {
  transactions: CryptoTransaction[];

  constructor(data: string[][]) {
    if (this.validateCSV(data)) {
      this.transactions = this.parseCSVArray(data);
    } else {
      this.transactions = [];
    }
  }

  validateCSV(data: string[][]): boolean {
    if (data.length === 0) {
      throw new Error('No header found in CSV file!');
    }

    if (
      data[0][0] !== 'Timestamp (UTC)' ||
      data[0][1] !== 'Transaction Description' ||
      data[0][2] !== 'Currency' ||
      data[0][3] !== 'Amount' ||
      data[0][4] !== 'To Currency' ||
      data[0][5] !== 'To Amount' ||
      data[0][6] !== 'Native Currency' ||
      data[0][7] !== 'Native Amount' ||
      data[0][8] !== 'Native Amount (in USD)' ||
      data[0][9] !== 'Transaction Kind' ||
      data[0][10] !== 'Transaction Hash'
    ) {
      throw new Error('Could not recognize CSV file!');
    }
    return true;
  }

  parseCSVArray(data: string[][]): CryptoTransaction[] {
    const transactions: CryptoTransaction[] = [];
    // delete header
    data.splice(0, 1);

    for (const line of data) {
      if (line.length < 11) {
        continue;
      }

      for (const t of this.getTransaction(line)) {
        transactions.push(t);
      }
    }
    return transactions;
  }

  getTransactionHash(line: string): string {
    return sha1(line);
  }

  getTransaction(line: string[]): CryptoTransaction[] {
    const retTransactions = [];
    const date = getDateFromString(line[0]);
    const currency = line[2];
    const amount = Number(line[3]);
    const toCurrency = line[4];
    const toAmount = !line[5] || line[5] === '' ? 0 : Number(line[5]);
    const type = line[9];
    switch (type) {
      case 'rewards_platform_deposit_credited': {
        retTransactions.push(
          new CryptoTransaction(
            this.getTransactionHash(line[0] + currency + amount + type),
            date,
            TransactionType.DISTRIBUTION,
            amount,
            currency,
          ),
        );
        break;
      }
      case 'referral_card_cashback': {
        retTransactions.push(
          new CryptoTransaction(
            this.getTransactionHash(line[0] + currency + amount + type),
            date,
            TransactionType.DISTRIBUTION,
            amount,
            currency,
          ),
        );
        break;
      }
      case 'crypto_withdrawal': {
        retTransactions.push(
          new CryptoTransaction(
            this.getTransactionHash(line[0] + currency + amount + type),
            date,
            TransactionType.WITHDRAW,
            amount,
            currency,
          ),
        );
        break;
      }
      case 'viban_purchase': {
        retTransactions.push(
          new CryptoTransaction(
            this.getTransactionHash(line[0] + toCurrency + toAmount + type),
            date,
            TransactionType.BUY,
            toAmount,
            toCurrency,
          ),
        );
        break;
      }
      case 'crypto_deposit': {
        retTransactions.push(
          new CryptoTransaction(
            this.getTransactionHash(line[0] + currency + amount + type),
            date,
            TransactionType.DEPOSIT,
            amount,
            currency,
          ),
        );
        break;
      }
      case 'dust_conversion_credited': {
        retTransactions.push(
          new CryptoTransaction(
            this.getTransactionHash(line[0] + currency + amount + type),
            date,
            TransactionType.BUY,
            amount,
            currency,
          ),
        );
        break;
      }
      case 'crypto_purchase': {
        retTransactions.push(
          new CryptoTransaction(
            this.getTransactionHash(line[0] + currency + amount + type),
            date,
            TransactionType.BUY,
            amount,
            currency,
          ),
        );
        break;
      }
      case 'dust_conversion_debited': {
        retTransactions.push(
          new CryptoTransaction(
            this.getTransactionHash(line[0] + currency + amount + type),
            date,
            TransactionType.SELL,
            amount,
            currency,
          ),
        );
        break;
      }
      case 'crypto_exchange': {
        retTransactions.push(
          new CryptoTransaction(
            this.getTransactionHash(line[0] + currency + amount + type),
            date,
            TransactionType.SELL,
            amount,
            currency,
          ),
        );
        retTransactions.push(
          new CryptoTransaction(
            this.getTransactionHash(line[0] + toCurrency + toAmount + type),
            date,
            TransactionType.BUY,
            toAmount,
            toCurrency,
          ),
        );
      }
    }
    return retTransactions;
  }
}
