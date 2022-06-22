export class TaxReportError {
  error: string;
  fix: string;

  constructor(error: string, fix: string) {
    this.error = error;
    this.fix = fix;
  }
}
