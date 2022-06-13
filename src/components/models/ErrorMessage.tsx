export class ErrorMessage {
  message: string;
  e: any;

  constructor(message: string, e: any) {
    this.message = message;
    this.e = e;
  }
}
