import {CryptoAccount} from '../cryptoaccount';
import {CryptoAsset} from '../CryptoAsset';
import {CryptoTransaction} from '../cryptotransaction';
import {TaxableIncome} from './TaxableIncome';

export class TaxReport {
  taxYear: number;
  taxableIncome: TaxableIncome[] = [];

  constructor(taxYear: number) {
    this.taxYear = taxYear;
  }

  addIncome(
    account: CryptoAccount,
    transaction: CryptoTransaction,
    asset: CryptoAsset,
  ) {
    if (transaction.date.getFullYear() === this.taxYear) {
      this.taxableIncome.push(
        new TaxableIncome(
          account,
          transaction,
          asset.getPrice(transaction.date),
        ),
      );
    }
  }
}
