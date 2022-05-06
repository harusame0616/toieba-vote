// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import '../../../api/firebase';
import { FSToiebaQuery } from '../../../domains/infrastructures/firestore/fs-toieba-query';
import { FSToiebaRepository } from '../../../domains/infrastructures/firestore/fs-toieba-repository';
import { ToiebaCommandUsecase } from '../../../domains/usecases/toieba-command-usecase';
import {
  ToiebaBriefDto,
  ToiebaQueryUsecase,
} from '../../../domains/usecases/toieba-query-usecase';
import {
  authenticate,
  getOrCreateUserId,
  requestHandler,
} from '../../../library/server-side-lib';

const toiebaCommandUsecase = new ToiebaCommandUsecase({
  toiebaRepository: new FSToiebaRepository(),
});

const toiebaQueryUsecase = new ToiebaQueryUsecase({
  toiebaQuery: new FSToiebaQuery(),
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
    GET: async () => {
      const { latest, popular } = req.query;

      let list: ToiebaBriefDto[] = [];
      if (latest) {
        list = await toiebaQueryUsecase.latestList(parseInt(latest as string));
      } else if (popular) {
        list = await toiebaQueryUsecase.popularList(
          parseInt(popular as string)
        );
      } else {
        // do nothing
      }

      return res.status(200).send(list);
    },
  });
}
