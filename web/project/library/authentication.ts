import admin from 'firebase-admin';
import { UnauthorizedError } from '../errors/unauthorized-error';

export const authenticate = async (token: string) => {
  if (!token) {
    throw new UnauthorizedError('ログインが必要です');
  }

  try {
    return await admin.app('toieba').auth().verifyIdToken(token);
  } catch (err) {
    throw new UnauthorizedError(
      '認証コードが不正です。再ログインし直してください。'
    );
  }
};

