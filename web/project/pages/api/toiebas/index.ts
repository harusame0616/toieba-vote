// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { IMToiebaRepository } from '../../../domains/infrastructures/in-memory/im-toieba-repository';
import { ToiebaCommandUsecase } from '../../../domains/usecases/toieba-command-usecase';
import { randomUUID } from 'crypto';
import { CustomError } from '../../../errors/custom-error';
import { FSToiebaRepository } from '../../../domains/infrastructures/firestore/fs-toieba-repository';

const toiebaCommandUsecase = new ToiebaCommandUsecase(new FSToiebaRepository());

/**
 *
 * @param req
 * @param res
 * @returns
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  // ToDo: ユーザー認証によりuserId取得
  const userId = randomUUID();

  if (req.method == 'POST') {
    try {
      return res
        .status(200)
        .send(
          await toiebaCommandUsecase.create({ ...req.body, creatorId: userId })
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
