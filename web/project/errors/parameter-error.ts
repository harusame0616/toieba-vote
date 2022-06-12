import { CustomError } from './custom-error';

export class ParameterError extends CustomError {
  constructor(message: string = 'パラメーターが不正です。', data?: {}) {
    super(message, 400, data);
  }
}
