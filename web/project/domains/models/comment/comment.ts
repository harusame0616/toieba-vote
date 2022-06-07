import { ParameterError } from '../../../errors/parameter-error';
import crypto from 'crypto';

export interface Like {
  userId: string;
  likedAt: Date;
}

export interface CommentConstructorParameter {
  commentId: string;
  toiebaId: string;
  userId: string;
  text: string;
  commentedAt: Date;
  likes: Like[];
}

export type CommentCreateParameter = Omit<
  CommentConstructorParameter,
  'commentId' | 'commentedAt' | 'likes'
>;

export class Comment {
  static readonly MAX_TEXT_LENGTH = 255;
  private _text!: string;
  private _toiebaId: string;
  private _userId: string;
  private _commentId: string;
  private _commentedAt: Date;
  private _likes: Like[];

  constructor(param: CommentConstructorParameter) {
    if (!param.toiebaId) {
      throw new ParameterError('といえばIDは必須です。');
    }
    if (!param.userId) {
      throw new ParameterError('ユーザーIDは必須です。');
    }

    this._toiebaId = param.toiebaId;
    this._userId = param.userId;
    this._commentId = param.commentId;
    this._commentedAt = param.commentedAt;
    this.text = param.text;
    this._likes = param.likes;
  }

  set text(newText: string) {
    Comment.validateText(newText);
    this._text = newText;
  }

  get text() {
    return this._text;
  }

  get toiebaId() {
    return this._toiebaId;
  }

  get userId() {
    return this._userId;
  }

  get commentId() {
    return this._commentId;
  }

  get commentedAt() {
    return this._commentedAt;
  }

  get likes() {
    return this._likes;
  }

  like(userId: string) {
    if (this._likes.map(({ userId }) => userId).includes(userId)) {
      return;
    }

    this._likes.push({ userId, likedAt: new Date() });
  }

  unlike(userId: string) {
    const index = this._likes.findIndex((like) => like.userId === userId);
    if (index < 0) {
      return;
    }

    this._likes.splice(index, 1);
  }

  static validateText(text: string) {
    if (!text) {
      throw new ParameterError(`テキストは必須です。`);
    }

    if (text.length > Comment.MAX_TEXT_LENGTH) {
      throw new ParameterError(
        `テキストは${Comment.MAX_TEXT_LENGTH}文字以下である必要があります。`
      );
    }
  }

  static create(param: CommentCreateParameter) {
    return new Comment({
      ...param,
      commentId: crypto.randomUUID(),
      commentedAt: new Date(),
      likes: [],
    });
  }
}
