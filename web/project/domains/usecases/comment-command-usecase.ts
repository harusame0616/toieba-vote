import { NotFoundError } from '../../errors/not-found-error';
import { Comment, CommentCreateParameter } from '../models/comment/comment';
import { ToiebaRepository } from './toieba-command-usecase';

export interface CommentRepository {
  findByCommentId(commentId: string): Promise<Comment | null>;
  save(comment: Comment): Promise<void>;
}

interface CommentCommandUsecaseParam {
  toiebaRepository: ToiebaRepository;
  commentRepository: CommentRepository;
}

export interface CommentCommandPostParam extends CommentCreateParameter {}
export interface CommentCommandLikeParam {
  commentId: string;
  userId: string;
}

export class CommentCommandUsecase {
  constructor(private readonly param: CommentCommandUsecaseParam) {}

  async postComment(param: CommentCommandPostParam) {
    const toieba = await this.param.toiebaRepository.findbyId(param.toiebaId);

    if (!toieba) {
      throw new NotFoundError('といえばが存在しません。', param);
    }

    const newComment = Comment.create(param);

    await this.param.commentRepository.save(newComment);
    return { commentId: newComment.commentId };
  }

  async likeComment(param: CommentCommandLikeParam) {
    const comment = await this.param.commentRepository.findByCommentId(
      param.commentId
    );

    if (!comment) {
      throw new NotFoundError('コメントが存在しません。');
    }

    comment.like(param.userId);

    this.param.commentRepository.save(comment);
  }

  async unlikeComment(param: CommentCommandLikeParam) {
    const comment = await this.param.commentRepository.findByCommentId(
      param.commentId
    );

    if (!comment) {
      throw new NotFoundError('コメントが存在しません。');
    }

    comment.unlike(param.userId);

    this.param.commentRepository.save(comment);
  }
}
