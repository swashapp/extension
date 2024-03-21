export class BaseError extends Error {
  reasons?: string[];

  constructor(msg: string, reasons?: string[]) {
    super(msg.toLowerCase());
    Object.setPrototypeOf(this, BaseError.prototype);

    this.reasons = reasons;
  }
}
