// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FSToiebaQuery } from '../../../../domains/infrastructures/firestore/fs-toieba-query';
import { ToiebaQueryUsecase } from '../../../../domains/usecases/toieba-query-usecase';
import { requestHandler } from '../../../../library/server-side-lib';

const toiebaQueryUsecase = new ToiebaQueryUsecase({
  toiebaQuery: new FSToiebaQuery(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  await requestHandler(req, res, {
    GET: async () => {
      const { id: toiebaId } = req.query;

      res
        .status(200)
        .send(await toiebaQueryUsecase.getDetail(toiebaId as string));
    },
  });
}
