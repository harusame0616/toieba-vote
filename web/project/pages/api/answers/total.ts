// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FSAnswerQuery } from '../../../domains/infrastructures/firestore/fs-answer-query';
import { AnswerQueryUsecase } from '../../../domains/usecases/answer-query-usecase';
import { CustomError } from '../../../errors/custom-error';
import { ParameterError } from '../../../errors/parameter-error';

const answerQueryUsecase = new AnswerQueryUsecase({
  answerQuery: new FSAnswerQuery(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (!req.query.toiebaId) {
    throw new ParameterError('IDが未指定です。');
  }

  if (req.method == 'GET') {
    try {
      return res.status(200).send(
        await answerQueryUsecase.total({
          toiebaId: req.query.toiebaId as string,
        })
      );
    } catch (err: any) {
      const error = err as CustomError;
      return res
        .status(error.code)
        .send({ message: error.message, data: error.data || {} });
    }
  }

  return res.status(400).send({});
}
