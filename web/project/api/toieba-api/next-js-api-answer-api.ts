import { http } from '../../library/http';
import {
  AnswerApi,
  AnswerDto,
  GetAnswerOfToiebaByUserId,
  TotalDto,
} from '../answer-api';

export class NJAPIAnswerApi implements AnswerApi {
  async getAnswerOfToiebaByUserId(
    params: GetAnswerOfToiebaByUserId
  ): Promise<AnswerDto> {
    const res = await http.get('/api/answers/', {
      params,
    });

    return res.data;
  }
  async getTotal({ toiebaId }: { toiebaId: string }): Promise<TotalDto> {
    const res = await http.get(`/api/answers/total`, {
      params: {
        toiebaId,
      },
    });

    return res.data;
  }
}
