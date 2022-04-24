// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { randomUUID } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { FSAnswerRepository } from '../../../../domains/infrastructures/firestore/fs-answer-repository';
import { FSToiebaRepository } from '../../../../domains/infrastructures/firestore/fs-toieba-repository';
import { AnswerCommandUsecase } from '../../../../domains/usecases/answer-command-usecase';
import { CustomError } from '../../../../errors/custom-error';

const answerCommandUsecase = new AnswerCommandUsecase({
  answerRepository: new FSAnswerRepository(),
  toiebaRepository: new FSToiebaRepository(),
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
  // ToDo: ユーザー認証によりuserId取得
  const userId = randomUUID();

  if (req.method == 'POST') {
    try {
      return res.status(200).send(
        await answerCommandUsecase.answer({
          ...req.body,
          toiebaId: req.query.id,
          userId,
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
