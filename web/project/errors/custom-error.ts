export abstract class CustomError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly data?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
