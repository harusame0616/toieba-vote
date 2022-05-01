import admin from 'firebase-admin';
import { FSUserQuery } from '../domains/infrastructures/firestore/fs-user-query';
import { FSUserRepository } from '../domains/infrastructures/firestore/fs-user-repository';
import { UserCommandUsecase } from '../domains/usecases/user-command-usecase';
import { UserQueryUsecase } from '../domains/usecases/user-query-usecase';
import { UnauthorizedError } from '../errors/unauthorized-error';

const userQueryUsecase = new UserQueryUsecase({ userQuery: new FSUserQuery() });
const userCommandUsecase = new UserCommandUsecase({
  userRepository: new FSUserRepository(),
});

export const authenticate = async (token?: string) => {
  if (!token) {
    throw new UnauthorizedError('ログインが必要です。');
  }

  let uid;
  try {
    ({ uid } = await admin.app('toieba').auth().verifyIdToken(token));
  } catch (err) {
    throw new UnauthorizedError(
      '認証コードが不正です。再ログインしてください。'
    );
  }
  return uid;
};

export const getOrCreateUserId = async (uid: string) => {
  let userId;
  try {
    ({ userId } = await userQueryUsecase.queryWithFirebaseUid(uid));
  } catch (err) {
    const user = await admin.app('toieba').auth().getUser(uid);
    ({ userId } = await userCommandUsecase.createFromFirebase(user));
  }

  return userId;
};
