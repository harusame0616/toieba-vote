import crypto from 'crypto';
import { ParameterError } from '../../../errors/parameter-error';

export interface UserProfile {
  name: string;
  comment: string;
}

export const authenticationTypes = ['firebase'] as const;
export type AuthenticationType = typeof authenticationTypes[number];
export interface AuthenticationId {
  id: string;
  type: AuthenticationType;
}

interface UserConstructorParam extends UserProfile {
  userId: string;
  authenticationId: AuthenticationId;
}

export type CreateUserParam = Omit<UserConstructorParam, 'userId'>;

export class User {
  static readonly NAME_MAX_LENGTH = 64;
  static readonly COMMENT_MAX_LENGTH = 255;

  readonly userId: string;
  readonly authenticationId: AuthenticationId;
  private _name!: string;
  private _comment!: string;

  constructor(param: UserConstructorParam) {
    if (!param.userId) {
      throw new ParameterError('ユーザーIDは必須です。');
    }

    if (!param.authenticationId) {
      throw new ParameterError('認証IDは必須です。');
    }

    this.userId = param.userId;
    this.authenticationId = param.authenticationId;
    this.name = param.name;
    this.comment = param.comment;
  }

  static create(profile: UserProfile, authenticationId: AuthenticationId) {
    return new User({
      userId: crypto.randomUUID(),
      name: profile.name,
      comment: profile.comment,
      authenticationId: authenticationId,
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
