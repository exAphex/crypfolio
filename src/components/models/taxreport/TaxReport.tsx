import {CryptoAccount} from '../cryptoaccount';
import {CryptoAsset} from '../CryptoAsset';

export class TaxReport {
  taxYear: number;
  accounts: CryptoAccount[] = [];
  assets: CryptoAsset[] = [];

  constructor(taxYear: number, assets: CryptoAsset[]) {
    this.taxYear = taxYear;
    this.assets = assets;
  }

  addAccount(acc: CryptoAccount) {
    this.accounts.push(acc);
  }

  addAccounts(accs: CryptoAccount[]) {
    if (accs) {
      for (const a of accs) {
        this.addAccount(a);
      }
    }
  }
}
