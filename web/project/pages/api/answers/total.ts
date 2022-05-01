// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FSAnswerQuery } from '../../../domains/infrastructures/firestore/fs-answer-query';
import { AnswerQueryUsecase } from '../../../domains/usecases/answer-query-usecase';
import { ParameterError } from '../../../errors/parameter-error';
import { requestHandler } from '../../../library/server-side-lib';

const answerQueryUsecase = new AnswerQueryUsecase({
  answerQuery: new FSAnswerQuery(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  await requestHandler(req, res, {
    GET: async () => {
      if (!req.query.toiebaId) {
        throw new ParameterError('IDが未指定です。');
      }

      res.status(200).send(
        await answerQueryUsecase.total({
          toiebaId: req.query.toiebaId as string,
        })
      );
    },
  });
}
