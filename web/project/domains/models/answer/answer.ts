import crypto from 'crypto';

export interface AnswerConstructorParam {
  answerId: string;
  toiebaId: string;
  choiceId: string;
  userId: string;
}

export type AnswerCreateParam = Omit<AnswerConstructorParam, 'answerId'>;

export class Answer {
  constructor(private readonly param: AnswerConstructorParam) {}

  static create(param: AnswerCreateParam) {
    return new Answer({ ...param, answerId: crypto.randomUUID() });
  }

  get answerId() {
    return this.param.answerId;
  }

  get toiebaId() {
    return this.param.toiebaId;
  }
  get userId() {
    return this.param.userId;
  }
  get choiceId() {
    return this.param.choiceId;
  }

  answer(choiceId: string) {
    this.param.choiceId = choiceId;
  }
}
