import { CustomError } from './custom-error';

export class PermissionError extends CustomError {
  constructor(message: string = '権限がありません。', data?: {}) {
    super(message, 403, data);
  }
}
