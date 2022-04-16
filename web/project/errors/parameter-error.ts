import { CustomError } from './custom-error';

export class ParameterError extends CustomError {
  constructor(message: string, data?: {}) {
    super(message, 400, data);
  }
}
