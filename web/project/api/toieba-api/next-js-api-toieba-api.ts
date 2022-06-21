import {
  ToiebaBriefDto,
  ToiebaDto,
} from '../../domains/usecases/toieba-query-usecase';
import { http } from '../../library/http';
import {
  ToiebaAnswerApiParam,
  ToiebaApi,
  ToiebaCreateApiParam,
  ToiebaGetAnsweredApiParam,
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

  async getLatest(cursor?: string): Promise<ToiebaBriefDto[]> {
    const res = await http.get(`/api/toiebas`, {
      params: {
        latest: 5,
        cursor,
      },
    });
    return res.data;
  }

  async getPopular(cursor?: string): Promise<ToiebaBriefDto[]> {
    const res = await http.get(`/api/toiebas`, {
      params: {
        popular: 5,
        cursor,
      },
    });
    return res.data;
  }

  async getAnswered({
    userId,
    cursor,
  }: ToiebaGetAnsweredApiParam): Promise<ToiebaBriefDto[]> {
    const res = await http.get(`/api/toiebas`, {
      params: {
        userId,
        answered: 5,
        cursor,
      },
    });
    return res.data;
  }
}
