import {CryptoTransaction} from '../components/models/cryptotransaction';

export interface CSVImporterInterface {
  transactions: CryptoTransaction[];
  validateCSV(data: string[][]): boolean;
  parseCSVArray(data: string[][]): CryptoTransaction[];
}
