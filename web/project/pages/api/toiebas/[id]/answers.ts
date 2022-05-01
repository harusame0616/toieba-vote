// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FSAnswerRepository } from '../../../../domains/infrastructures/firestore/fs-answer-repository';
import { FSToiebaRepository } from '../../../../domains/infrastructures/firestore/fs-toieba-repository';
import { AnswerCommandUsecase } from '../../../../domains/usecases/answer-command-usecase';
import {
  authenticate,
  getOrCreateUserId,
  requestHandler,
} from '../../../../library/server-side-lib';

const answerCommandUsecase = new AnswerCommandUsecase({
  answerRepository: new FSAnswerRepository(),
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
        await answerCommandUsecase.answer({
          ...req.body,
          toiebaId: req.query.id,
          userId,
        })
      );
    },
  });
}
