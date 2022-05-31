import { CustomError } from './custom-error';

export class PermissionError extends CustomError {
  constructor(message: string, data?: {}) {
    super(message, 403, data);
  }
}
