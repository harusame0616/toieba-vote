import { NotFoundError } from '../../errors/not-found-error';

export interface TotalParam {
  toiebaId: string;
}

export interface TotalDto {
  theme: string;
  count: number;
  choices: { choiceId: number; label: string; count: number }[];
}

export interface AnswerQuery {
  total(param: TotalParam): Promise<TotalDto | null>;
}

interface AnswerQueryUsecaseParam {
  answerQuery: AnswerQuery;
}

export class AnswerQueryUsecase {
  constructor(private readonly param: AnswerQueryUsecaseParam) {}

  async total({ toiebaId }: TotalParam) {
    const total = await this.param.answerQuery.total({ toiebaId });

    if (!total) {
      throw new NotFoundError('集計データが存在しません。', { toiebaId });
    }

    return total;
  }
}
