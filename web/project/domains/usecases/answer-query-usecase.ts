import { NotFoundError } from '../../errors/not-found-error';

export interface TotalParam {
  toiebaId: string;
}

export interface TotalDto {
  theme: string;
  count: number;
  choices: { choiceId: number; label: string; count: number }[];
}

export interface AnswerDto {
  toiebaId: string;
  userId: string;
  answerId: string;
  choiceId: string;
  userName: string;
  choiceLabel: string;
}

export interface AnswerQuery {
  getAnswerOfToiebaByUserId(
    param: GetAnswerOfToiebaByUserId
  ): Promise<AnswerDto | null>;
  total(param: TotalParam): Promise<TotalDto | null>;
}

interface AnswerQueryUsecaseParam {
  answerQuery: AnswerQuery;
}

export interface GetAnswerOfToiebaByUserId {
  toiebaId: string;
  answerUserId: string;
}

export class AnswerQueryUsecase {
  constructor(private readonly param: AnswerQueryUsecaseParam) {}

  async getAnswerOfToiebaByUserId(param: GetAnswerOfToiebaByUserId) {
    const answer = await this.param.answerQuery.getAnswerOfToiebaByUserId(
      param
    );

    return answer;
  }

  async total({ toiebaId }: TotalParam) {
    const total = await this.param.answerQuery.total({ toiebaId });

    if (!total) {
      throw new NotFoundError('集計データが存在しません。', { toiebaId });
    }

    return total;
  }
}
