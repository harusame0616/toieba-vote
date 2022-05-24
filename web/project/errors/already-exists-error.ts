import { CustomError } from './custom-error';

export class AlreadyExistsError extends CustomError {
  constructor(message: string, data?: {}) {
    super(message, 403, data);
  }
}
