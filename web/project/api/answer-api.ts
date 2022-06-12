import {
  AnswerDto,
  GetAnswerOfToiebaByUserId,
  TotalDto,
} from '../domains/usecases/answer-query-usecase';

export interface AnswerApi {
  getTotal(param: { toiebaId: string }): Promise<TotalDto>;
  getAnswerOfToiebaByUserId(
    param: GetAnswerOfToiebaByUserId
  ): Promise<AnswerDto>;
}

export type { TotalDto, AnswerDto, GetAnswerOfToiebaByUserId };
