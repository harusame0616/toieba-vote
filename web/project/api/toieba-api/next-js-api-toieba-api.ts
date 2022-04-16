import { http } from '../../library/http';
import { ToiebaApi, ToiebaCreateApiParam } from '../toieba-api';

export class NJAPIToiebaApi implements ToiebaApi {
  async create({ theme, choices }: ToiebaCreateApiParam) {
    const res = await http.post('/api/toiebas', {
      theme,
      choices,
    });

    return { id: res.data.id };
  }
}
