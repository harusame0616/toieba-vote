import { NextApiRequest, NextApiResponse } from 'next';
import { FSCommentQuery } from '../../../domains/infrastructures/firestore/fs-comment-query';
import { FSCommentRepository } from '../../../domains/infrastructures/firestore/fs-comment-repository';
import { FSToiebaRepository } from '../../../domains/infrastructures/firestore/fs-toieba-repository';
import { CommentCommandUsecase } from '../../../domains/usecases/comment-command-usecase';
import { CommentQueryUsecase } from '../../../domains/usecases/comment-query-usecase';
import { ParameterError } from '../../../errors/parameter-error';
import { UnauthorizedError } from '../../../errors/unauthorized-error';
import { requestHandler } from '../../../library/server-side-lib';

const commentQueryUsecase = new CommentQueryUsecase({
  commentQuery: new FSCommentQuery(),
});

const commentCommandUsecase = new CommentCommandUsecase({
  commentRepository: new FSCommentRepository(),
  toiebaRepository: new FSToiebaRepository(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  await requestHandler(req, res, {
    GET: async () => {
      const { toiebaId } = req.query;

      if (!toiebaId) {
        throw new ParameterError('といえばIDは必須です。');
      }

      if (typeof toiebaId !== 'string' || typeof toiebaId !== 'string') {
        throw new ParameterError('パラメーターが不正です。', req.query);
      }

      res
        .status(200)
        .send(await commentQueryUsecase.getCommentList({ toiebaId }));
    },
    POST: async ({ user }) => {
      if (!user) {
        throw new UnauthorizedError('ログインが必要です。');
      }

      res.status(200).send(
        await commentCommandUsecase.postComment({
          ...req.body,
          userId: user.userId,
        })
      );
    },
  });
}
