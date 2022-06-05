import { NextApiRequest, NextApiResponse } from 'next';
import { FSCommentRepository } from '../../../../../domains/infrastructures/firestore/fs-comment-repository';
import { FSToiebaRepository } from '../../../../../domains/infrastructures/firestore/fs-toieba-repository';
import { CommentCommandUsecase } from '../../../../../domains/usecases/comment-command-usecase';
import { ParameterError } from '../../../../../errors/parameter-error';
import { UnauthorizedError } from '../../../../../errors/unauthorized-error';
import { requestHandler } from '../../../../../library/server-side-lib';

const commentCommandUsecase = new CommentCommandUsecase({
  commentRepository: new FSCommentRepository(),
  toiebaRepository: new FSToiebaRepository(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  await requestHandler(req, res, {
    POST: async ({ user }) => {
      if (!user) {
        throw new UnauthorizedError('ログインが必要です。');
      }
      const { commentId } = req.query;
      if (!commentId) {
        throw new ParameterError('コメントIDは必須です。');
      }

      if (typeof commentId !== 'string' || typeof commentId !== 'string') {
        throw new ParameterError('コメントIDが不正です。', req.query);
      }

      await commentCommandUsecase.likeComment({
        commentId,
        userId: user.userId,
      });

      res.status(200).send({});
    },
    DELETE: async ({ user }) => {
      if (!user) {
        throw new UnauthorizedError('ログインが必要です。');
      }
      const { commentId } = req.query;
      if (!commentId) {
        throw new ParameterError('コメントIDは必須です。');
      }

      if (typeof commentId !== 'string' || typeof commentId !== 'string') {
        throw new ParameterError('コメントIDが不正です。', req.query);
      }

      await commentCommandUsecase.unlikeComment({
        commentId,
        userId: user.userId,
      });

      res.status(200).send({});
    },
  });
}
