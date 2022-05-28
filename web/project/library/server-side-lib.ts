import admin from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { FSUserQuery } from '../domains/infrastructures/firestore/fs-user-query';
import { FSUserRepository } from '../domains/infrastructures/firestore/fs-user-repository';
import { UserCommandUsecase } from '../domains/usecases/user-command-usecase';
import { UserQueryUsecase } from '../domains/usecases/user-query-usecase';
import { CustomError } from '../errors/custom-error';
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
    console.error(err);
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

type handler = () => Promise<void> | void;
const methods = ['POST', 'GET', 'PUT', 'DELETE'] as const;
type Method = typeof methods[number];

type requestHandlerConfig = {
  [key in Method]?: handler;
};

const isMethod = (v: any): v is Method => {
  return methods.includes(v);
};

export const requestHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  config: requestHandlerConfig
) => {
  if (!isMethod(req.method)) {
    return res
      .status(400)
      .send({ message: 'メソッドが不正です。', data: req.method });
  }

  const handler = config[req.method];
  if (!handler) {
    return res
      .status(400)
      .send({ message: 'ハンドラーが見つかりません。', data: req.method });
  }

  try {
    await handler();
  } catch (err: any) {
    console.error(err);
    const error = err as CustomError;

    return res
      .status(error.code)
      .send({ message: error.message, data: error.data });
  }
};
