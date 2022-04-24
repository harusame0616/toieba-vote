import { ToiebaDto } from '../../domains/usecases/toieba-query-usecase';
import { http } from '../../library/http';
import {
  ToiebaAnswerApiParam,
  ToiebaApi,
  ToiebaCreateApiParam,
} from '../toieba-api';

export class NJAPIToiebaApi implements ToiebaApi {
  async create({ theme, choices }: ToiebaCreateApiParam) {
    const res = await http.post('/api/toiebas', {
      theme,
      choices,
    });

    return { toiebaId: res.data.toiebaId };
  }

  async answer({ toiebaId, choiceId }: ToiebaAnswerApiParam) {
    const res = await http.post(`/api/toiebas/${toiebaId}/answers`, {
      choiceId,
    });

    return res?.data ?? null;
  }

  async getDetail({ id }: { id: string }): Promise<ToiebaDto> {
    let res;
    res = await http.get(`/api/toiebas/${id}`);

    return res.data;
  }
}
