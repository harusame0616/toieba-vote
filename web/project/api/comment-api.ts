import {
  CommentCommandLikeParam,
  CommentCommandPostParam,
} from '../domains/usecases/comment-command-usecase';
import {
  CommentDto,
  GetCommentListParam,
} from '../domains/usecases/comment-query-usecase';

export type { CommentDto };
export type { GetCommentListParam };

export interface CommentApi {
  likeComment(param: Omit<CommentCommandLikeParam, 'userId'>): Promise<void>;
  unlikeComment(param: Omit<CommentCommandLikeParam, 'userId'>): Promise<void>;
  postComment(
    params: Omit<CommentCommandPostParam, 'userId'>
  ): Promise<{ commentId: string }>;
  getCommentList(params: GetCommentListParam): Promise<CommentDto[]>;
}
