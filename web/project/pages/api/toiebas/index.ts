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
import { ParameterError } from '../../../errors/parameter-error';
import { PermissionError } from '../../../errors/permission-error';
import { requestHandler } from '../../../library/server-side-lib';

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
    POST: async ({ user }) => {
      if (!user) {
        throw new PermissionError('ユーザー登録が必要です。');
      }
      res.status(200).send(
        await toiebaCommandUsecase.create({
          ...req.body,
          creatorId: user.userId,
        })
      );
    },
    GET: async () => {
      const { latest, popular, answered, userId, cursor } = req.query;

      if (cursor && typeof cursor !== 'string') {
        throw new ParameterError();
      }

      let list: ToiebaBriefDto[] = [];
      if (latest) {
        list = await toiebaQueryUsecase.latestList(
          parseInt(latest as string),
          cursor
        );
      } else if (popular) {
        list = await toiebaQueryUsecase.popularList(
          parseInt(popular as string),
          cursor
        );
      } else if (answered && typeof answered === 'string') {
        if (!userId || typeof userId !== 'string') {
          throw new ParameterError('ユーザーIDが不正です', req.query);
        }

        list = await toiebaQueryUsecase.listOfAnsweredByUser({
          count: parseInt(answered),
          userId,
          cursor,
        });
      } else {
        // do nothing
      }

      return res.status(200).send(list);
    },
  });
}
