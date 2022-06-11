// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FSUserQuery } from '../../../../domains/infrastructures/firestore/fs-user-query';
import { FSUserRepository } from '../../../../domains/infrastructures/firestore/fs-user-repository';
import {
  AuthenticationType,
  authenticationTypes, UserProfile
} from '../../../../domains/models/user/user';
import { UserCommandUsecase } from '../../../../domains/usecases/user-command-usecase';
import { UserQueryUsecase } from '../../../../domains/usecases/user-query-usecase';
import { ParameterError } from '../../../../errors/parameter-error';
import { PermissionError } from '../../../../errors/permission-error';
import { UnauthorizedError } from '../../../../errors/unauthorized-error';
import { requestHandler } from '../../../../library/server-side-lib';

const userQueryUsecase = new UserQueryUsecase({
  userQuery: new FSUserQuery(),
});

const userCommandUsecase = new UserCommandUsecase({
  userRepository: new FSUserRepository(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  await requestHandler(req, res, {
    GET: async () => {
      const { id, type } = req.query;

      if (!id || typeof id !== 'string') {
        throw new ParameterError('IDの指定が不正です', { id });
      }

      if (
        typeof type === 'string' &&
        ((v: any): v is AuthenticationType => authenticationTypes.includes(v))(
          type
        )
      ) {
        return res
          .status(200)
          .send(await userQueryUsecase.queryWithAuthenticationId({ id, type }));
      }

      return res.status(200).send(await userQueryUsecase.queryWithUserId(id));
    },
    PUT: async ({ user }) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      if (req.query.id != user.userId) {
        throw new PermissionError(undefined, req.query);
      }

      if (
        !((value: any): value is UserProfile => {
          return (
            typeof value.name === 'string' && typeof value.comment === 'string'
          );
        })(req.body.params)
      ) {
        throw new ParameterError(undefined, req.body.params);
      }

      await userCommandUsecase.editProfile(user.userId, req.body.params);

      res.status(200).send({});
    },
  });
}
