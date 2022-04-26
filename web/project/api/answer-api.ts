import { TotalDto } from '../domains/usecases/answer-query-usecase';

interface AnswerApi {
  getTotal(param: { toiebaId: string }): Promise<TotalDto>;
}

export type { TotalDto, AnswerApi };
