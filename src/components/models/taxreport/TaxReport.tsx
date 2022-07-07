import {getBalance} from '../../../utils/CryptoCalculator';
import {CryptoAccount} from '../cryptoaccount';
import {CryptoAsset, getCryptoAssetFromSymbol} from '../CryptoAsset';
import {CryptoHolding} from '../CryptoHolding';
import {CryptoTransaction} from '../cryptotransaction';
import {TaxReportError} from '../TaxReportError';
import {TransactionType} from '../transaction';
import {TaxableIncome} from './TaxableIncome';

export class TaxReport {
  taxYear: number;
  taxableIncome: TaxableIncome[] = [];
  accounts: CryptoAccount[] = [];
  assets: CryptoAsset[] = [];

  constructor(taxYear: number, assets: CryptoAsset[]) {
    this.taxYear = taxYear;
    this.assets = assets;
  }

  addAccount(acc: CryptoAccount) {
    const transactions = acc.transactions;
    if (transactions) {
      for (const t of transactions) {
        const tempAsset = getCryptoAssetFromSymbol(t.symbol, this.assets);
        if (!tempAsset) {
          throw new TaxReportError(
            'Could not find asset with symbol: ' + t.symbol,
            'Add a new asset with the mentioned symbol in the "Assets" view',
          );
        }
        switch (t.type) {
          case TransactionType.STAKING_REWARD:
            this.addIncome(acc, t, tempAsset);
            break;
          case TransactionType.DISTRIBUTION:
            this.addIncome(acc, t, tempAsset);
        }
      }
    }
    this.accounts.push(acc);
  }

  addAccounts(accs: CryptoAccount[]) {
    if (accs) {
      for (const a of accs) {
        this.addAccount(a);
      }
    }
  }

  private addIncome(
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
