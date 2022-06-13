import { NextApiRequest, NextApiResponse } from 'next';
import { FSAnswerQuery } from '../../../domains/infrastructures/firestore/fs-answer-query';
import {
  AnswerQueryUsecase,
  GetAnswerOfToiebaByUserId,
} from '../../../domains/usecases/answer-query-usecase';
import { NotFoundError } from '../../../errors/not-found-error';
import { PermissionError } from '../../../errors/permission-error';
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
      if (
        !((v: any): v is GetAnswerOfToiebaByUserId =>
          typeof v.answerUserId !== 'string' || typeof v.id !== 'string')(
          req.query
        )
      ) {
        throw new PermissionError(undefined, req.query);
      }

      const answer = await answerQueryUsecase.getAnswerOfToiebaByUserId(
        req.query
      );
      if (!answer) {
        throw new NotFoundError('回答が見つかりません。');
      }

      res.status(200).send(answer);
    },
  });
}
