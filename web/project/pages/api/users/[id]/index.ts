// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FSUserQuery } from '../../../../domains/infrastructures/firestore/fs-user-query';
import { UserQueryUsecase } from '../../../../domains/usecases/user-query-usecase';
import { ParameterError } from '../../../../errors/parameter-error';
import { requestHandler } from '../../../../library/server-side-lib';

const userQueryUsecase = new UserQueryUsecase({
  userQuery: new FSUserQuery(),
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

      if (type === 'firebaseUid') {
        return res
          .status(200)
          .send(await userQueryUsecase.queryWithFirebaseUid(id));
      }

      throw new ParameterError('IDのタイプが不正です', { type });
    },
  });
}
