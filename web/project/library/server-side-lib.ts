import admin from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { FSUserQuery } from '../domains/infrastructures/firestore/fs-user-query';
import {
  UserDto,
  UserQueryUsecase,
} from '../domains/usecases/user-query-usecase';
import { CustomError } from '../errors/custom-error';
import { NotFoundError } from '../errors/not-found-error';
import { UnauthorizedError } from '../errors/unauthorized-error';

const userQueryUsecase = new UserQueryUsecase({ userQuery: new FSUserQuery() });

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

  try {
    return await userQueryUsecase.queryWithAuthenticationId({
      id: uid,
      type: 'firebase',
    });
  } catch (err) {
    throw new NotFoundError('ユーザーが見つかりませんでした。');
  }
};

interface HandlerParam {
  isAuthenticated: boolean;
  isRegistered: boolean;
  user?: UserDto;
  firebaseUid?: string;
}
type handler = (param: HandlerParam) => Promise<void> | void;
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
    let uid;
    let user;
    if (req.headers.authorization) {
      try {
        ({ uid } = await admin
          .app('toieba')
          .auth()
          .verifyIdToken(req.headers.authorization));
      } catch (err) {
        console.error(err);
        throw new UnauthorizedError(
          '認証コードが不正です。再ログインしてください。'
        );
      }

      try {
        user = await userQueryUsecase.queryWithAuthenticationId({
          id: uid,
          type: 'firebase',
        });
      } catch (err) {
        // do nothing
      }
    }
    await handler({
      isAuthenticated: !!uid,
      isRegistered: !!user,
      firebaseUid: uid,
      user,
    });
  } catch (err: any) {
    console.error(err);
    const error = err as CustomError;

    return res
      .status(error.code)
      .send({ message: error.message, data: error.data });
  }
};
