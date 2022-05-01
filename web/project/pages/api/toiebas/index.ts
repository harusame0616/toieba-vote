// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import '../../../api/firebase';
import { FSToiebaRepository } from '../../../domains/infrastructures/firestore/fs-toieba-repository';
import { ToiebaCommandUsecase } from '../../../domains/usecases/toieba-command-usecase';
import { CustomError } from '../../../errors/custom-error';
import {
  authenticate,
  getOrCreateUserId,
} from '../../../library/server-side-lib';

const toiebaCommandUsecase = new ToiebaCommandUsecase({
  toiebaRepository: new FSToiebaRepository(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method == 'POST') {
    try {
      const userId = await getOrCreateUserId(
        await authenticate(req.headers.authorization)
      );

      return res.status(200).send(
        await toiebaCommandUsecase.create({
          ...req.body,
          creatorId: userId,
        })
      );
    } catch (err: any) {
      const error = err as CustomError;
      return res
        .status(error.code)
        .send({ message: error.message, data: error.data });
    }
  }

  return res.status(400).send({});
}
