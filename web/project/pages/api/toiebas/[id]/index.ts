// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FSToiebaQuery } from '../../../../domains/infrastructures/firestore/fs-toieba-query';
import { ToiebaQueryUsecase } from '../../../../domains/usecases/toieba-query-usecase';
import { CustomError } from '../../../../errors/custom-error';

const toiebaQueryUsecase = new ToiebaQueryUsecase({
  toiebaQuery: new FSToiebaQuery(),
});

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
  const { id: toiebaId } = req.query;

  if (req.method == 'GET') {
    try {
      return res
        .status(200)
        .send(await toiebaQueryUsecase.getDetail(toiebaId as string));
    } catch (err: any) {
      const error = err as CustomError;
      return res
        .status(error.code)
        .send({ message: error.message, data: error.data || {} });
    }
  }

  return res.status(400).send({});
}
