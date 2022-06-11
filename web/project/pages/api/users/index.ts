import { NextApiRequest, NextApiResponse } from 'next';
import { FSUserRepository } from '../../../domains/infrastructures/firestore/fs-user-repository';
import { UserCommandUsecase } from '../../../domains/usecases/user-command-usecase';
import { ParameterError } from '../../../errors/parameter-error';
import { PermissionError } from '../../../errors/permission-error';
import { UnauthorizedError } from '../../../errors/unauthorized-error';
import { requestHandler } from '../../../library/server-side-lib';

const userCommandUsecase = new UserCommandUsecase({
  userRepository: new FSUserRepository(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  await requestHandler(req, res, {
    POST: async ({ firebaseUid }) => {
      if (!firebaseUid) {
        throw new UnauthorizedError();
      }

      if (
        typeof req.body?.profile.comment !== 'string' ||
        typeof req.body?.profile.name !== 'string' ||
        typeof req.body.authenticationId !== 'string'
      ) {
        throw new ParameterError('引数のフォーマットが不正です。', req.body);
      }

      if (firebaseUid !== req.body.authenticationId) {
        throw new PermissionError();
      }

      await userCommandUsecase.createUser(req.body.profile, {
        id: req.body.authenticationId,
        type: 'firebase',
      });
      res.status(200).send({});
    },
  });
}
