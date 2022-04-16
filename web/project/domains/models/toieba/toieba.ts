import { ParameterError } from '../../../errors/parameter-error';
import { Choice } from './choice';

interface ToiebaConstructorParam {
  toiebaId: string;
  theme: string;
  choices: Choice[];
  creatorId: string;
}
export class Toieba {
  private _toiebaId: string;
  private _choices: Choice[];
  private _theme!: string;
  private _creatorId: string;

  static readonly THEME_MAX_LENGTH = 36;
  static readonly THEME_MIN_LENGTH = 1;

  static readonly TOIEBA_ID_LENGTH = 36;
  static readonly CREATOR_ID_LENGTH = 36;

  static readonly CHOICE_MIN_NUMBER = 2;
  static readonly CHOICE_MAX_NUMBER = 10;

  constructor({ toiebaId, choices, theme, creatorId }: ToiebaConstructorParam) {
    if (toiebaId?.length !== Toieba.TOIEBA_ID_LENGTH) {
      throw new ParameterError(
        `idは${Toieba.TOIEBA_ID_LENGTH}文字である必要があります。`,
        { toiebaId }
      );
    }
    if (creatorId?.length !== Toieba.CREATOR_ID_LENGTH) {
      throw new ParameterError(
        `作成者IDは${Toieba.CREATOR_ID_LENGTH}文字である必要があります。`,
        { creatorId }
      );
    }

    if (choices == null || choices.length < Toieba.CHOICE_MIN_NUMBER) {
      throw new ParameterError(
        `選択肢は${Toieba.CHOICE_MIN_NUMBER}個以上である必要があります。`,
        { choices }
      );
    }
    if (choices.length > Toieba.CHOICE_MAX_NUMBER) {
      throw new ParameterError(
        `選択肢は${Toieba.CHOICE_MAX_NUMBER}個以下である必要があります。`,
        { choices }
      );
    }

    if (new Set(choices.map(({ label }) => label)).size !== choices.length) {
      throw new ParameterError(
        `それぞれの選択肢は重複していない必要があります。`,
        { choices }
      );
    }

    this._toiebaId = toiebaId;
    this.theme = theme;
    this._choices = choices;
    this._creatorId = creatorId;
  }

  get toiebaId() {
    return this._toiebaId;
  }

  get creatorId() {
    return this._creatorId;
  }

  get theme() {
    return this._theme;
  }

  set theme(theme: string) {
    if (theme == null) {
      throw new ParameterError(`テーマは必須です。`, { theme });
    }

    if (theme.length < Toieba.THEME_MIN_LENGTH) {
      throw new ParameterError(
        `テーマは${Toieba.THEME_MIN_LENGTH}文字以上である必要があります。`,
        { theme }
      );
    }
    if (theme.length > Toieba.THEME_MAX_LENGTH) {
      throw new ParameterError(
        `テーマは${Toieba.THEME_MAX_LENGTH}文字以下である必要があります。`,
        { theme }
      );
    }

    this._theme = theme;
  }

  get choices() {
    return this._choices;
  }
}
