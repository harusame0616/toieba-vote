import { Like } from '../models/comment/comment';

export interface CommentDto {
  commentId: string;
  text: string;
  userId: string;
  userName: string;
  commentedAt: string;
  likeCount: number;
  likes: Like[];
}

export interface GetCommentListParam {
  toiebaId: string;
}

export interface CommentQuery {
  queryCommentListByToiebaId(toiebaId: string): Promise<CommentDto[]>;
}

interface CommentQueryUsecaseParam {
  commentQuery: CommentQuery;
}

export class CommentQueryUsecase {
  constructor(private param: CommentQueryUsecaseParam) {}

  getCommentList(param: GetCommentListParam) {
    return this.param.commentQuery.queryCommentListByToiebaId(param.toiebaId);
  }
}
