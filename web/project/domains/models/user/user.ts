import crypto from 'crypto';
import { ParameterError } from '../../../errors/parameter-error';

interface UserConstructorParam {
  userId: string;
  firebaseUid: string;
  name: string;
  comment?: string;
}

export type CreateUserParam = Omit<UserConstructorParam, 'userId'>;

export class User {
  static readonly NAME_MAX_LENGTH = 64;
  static readonly COMMENT_MAX_LENGTH = 255;

  readonly userId: string;
  readonly firebaseUid: string;
  private _name!: string;
  private _comment!: string;

  constructor({ userId, firebaseUid, name, comment }: UserConstructorParam) {
    if (!userId) {
      new ParameterError('ユーザーIDは必須です。');
    }
    if (!firebaseUid) {
      new ParameterError('Firebase UIDは必須です。');
    }

    this.userId = userId;
    this.firebaseUid = firebaseUid;
    this.name = name;
    this.comment = comment ?? '';
  }

  static create(param: CreateUserParam) {
    const id = crypto.randomUUID();
    return new User({
      userId: id,
      firebaseUid: param.firebaseUid,
      name: param.name,
      comment: param.comment ?? '',
    });
  }

  set name(newName: string) {
    if (!newName) {
      throw new ParameterError('名前は必須です。', { newName });
    }

    if (newName.length > User.NAME_MAX_LENGTH) {
      throw new ParameterError(
        `名前は${User.NAME_MAX_LENGTH}文字以下である必要があります。`,
        {
          newName,
        }
      );
    }

    this._name = newName;
  }

  get name() {
    return this._name;
  }

  set comment(newComment: string) {
    if (!newComment) {
      this._comment = '';
      return;
    }

    if (newComment.length > User.COMMENT_MAX_LENGTH) {
      throw new ParameterError(
        `コメントは${User.COMMENT_MAX_LENGTH}文字以下である必要があります。`,
        {
          newComment,
        }
      );
    }
    this._comment = newComment;
  }

  get comment() {
    return this._comment;
  }
}
