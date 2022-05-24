import { CustomError } from './custom-error';

export class UnauthorizedError extends CustomError {
  constructor(message: string, data?: {}) {
    super(message, 401, data);
  }
}
