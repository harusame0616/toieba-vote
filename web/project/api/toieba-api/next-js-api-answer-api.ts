import { http } from '../../library/http';
import { AnswerApi, TotalDto } from '../answer-api';

export class NJAPIAnswerApi implements AnswerApi {
  async getTotal({ toiebaId }: { toiebaId: string }): Promise<TotalDto> {
    const res = await http.get(`/api/answers/total`, {
      params: {
        toiebaId,
      },
    });

    return res.data;
  }
}
