import {
  CommentCommandLikeParam,
  CommentCommandPostParam,
} from '../../domains/usecases/comment-command-usecase';
import { CommentApi, CommentDto, GetCommentListParam } from '../comment-api';
import { NextApi } from './next-api';

export class NextCommentApi extends NextApi implements CommentApi {
  async likeComment(params: Omit<CommentCommandLikeParam, 'userId'>) {
    await NextApi.http.post(`/api/comments/${params.commentId}/likes`, {});
  }

  async unlikeComment(params: Omit<CommentCommandLikeParam, 'userId'>) {
    await NextApi.http.delete(`/api/comments/${params.commentId}/likes`, {
      params,
    });
  }

  async postComment(
    params: CommentCommandPostParam
  ): Promise<{ commentId: string }> {
    const res = await NextApi.http.post(`/api/comments/`, params);

    return res.data;
  }
  async getCommentList(params: GetCommentListParam): Promise<CommentDto[]> {
    const res = await NextApi.http.get(`/api/comments/`, {
      params,
    });

    return res.data;
  }
}
