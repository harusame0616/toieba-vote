import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  constructor(message: string, data?: {}) {
    super(message, 404, data);
  }
}
