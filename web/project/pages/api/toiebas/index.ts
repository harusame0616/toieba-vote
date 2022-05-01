// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import '../../../api/firebase';
import { FSToiebaRepository } from '../../../domains/infrastructures/firestore/fs-toieba-repository';
import { ToiebaCommandUsecase } from '../../../domains/usecases/toieba-command-usecase';
import {
  authenticate,
  getOrCreateUserId,
  requestHandler,
} from '../../../library/server-side-lib';

const toiebaCommandUsecase = new ToiebaCommandUsecase({
  toiebaRepository: new FSToiebaRepository(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  await requestHandler(req, res, {
    POST: async () => {
      const userId = await getOrCreateUserId(
        await authenticate(req.headers.authorization)
      );

      res.status(200).send(
        await toiebaCommandUsecase.create({
          ...req.body,
          creatorId: userId,
        })
      );
    },
  });
}
