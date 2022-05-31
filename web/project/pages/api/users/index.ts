import { NextApiRequest, NextApiResponse } from 'next';
import { FSUserRepository } from '../../../domains/infrastructures/firestore/fs-user-repository';
import { UserCommandUsecase } from '../../../domains/usecases/user-command-usecase';
import { ParameterError } from '../../../errors/parameter-error';
import { PermissionError } from '../../../errors/permission-error';
import { UnauthorizedError } from '../../../errors/unauthorized-error';
import { authenticate, requestHandler } from '../../../library/server-side-lib';

const userCommandUsecase = new UserCommandUsecase({
  userRepository: new FSUserRepository(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  await requestHandler(req, res, {
    POST: async ({ firebaseUid }) => {
      const { comment, name } = req.body;

      if (!firebaseUid) {
        throw new UnauthorizedError('認証が必要です。');
      }

      if (typeof comment !== 'string' || typeof name !== 'string') {
        throw new ParameterError('引数のフォーマットが不正です。', {
          comment,
          name,
          firebaseUid,
        });
      }

      await userCommandUsecase.createUser({ name, comment, firebaseUid });
      res.status(200).send({});
    },
  });
}
