import {CryptoAccount} from '../cryptoaccount';
import {CryptoHolding} from '../CryptoHolding';

export class TaxableHolding {
  account: CryptoAccount;
  holdings: CryptoHolding[] = [];

  constructor(account: CryptoAccount) {
    this.account = account;
  }
}
