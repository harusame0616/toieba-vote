import crypto from 'crypto';
import { ParameterError } from '../../../errors/parameter-error';
interface ChoiceConstructorParam {
  choiceId: string;
  label: string;
  index: number;
}
export class Choice {
  static readonly LABEL_MAX_LENGTH = 64;
  static readonly LABEL_MIN_LENGTH = 1;
  _choiceId: string;
  _label!: string;
  _index: number;

  constructor(param: ChoiceConstructorParam) {
    this._choiceId = param.choiceId;
    this.label = param.label;
    this._index = param.index;
  }

  static create(choiceCreateParam: Omit<ChoiceConstructorParam, 'choiceId'>) {
    return new Choice({ ...choiceCreateParam, choiceId: crypto.randomUUID() });
  }

  get choiceId() {
    return this._choiceId;
  }

  get label() {
    return this._label;
  }

  set label(label: string) {
    if (label == null) {
      throw new ParameterError(`選択肢ラベルは必須です。`, { label });
    }

    if (label.length < Choice.LABEL_MIN_LENGTH) {
      throw new ParameterError(
        `選択肢ラベルは${Choice.LABEL_MIN_LENGTH}文字以上である必要があります。`,
        { label }
      );
    }

    if (label.length > Choice.LABEL_MAX_LENGTH) {
      throw new ParameterError(
        `選択肢ラベルは${Choice.LABEL_MAX_LENGTH}文字以下である必要があります。`,
        { label }
      );
    }

    this._label = label;
  }
  get index() {
    return this._index;
  }
}
