import { CustomError } from './custom-error';

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'ログインが必要です。', data?: {}) {
    super(message, 401, data);
  }
}
