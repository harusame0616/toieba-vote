import { CreateUserParam } from '../../domains/models/user/user';
import { UserDto } from '../../domains/usecases/user-query-usecase';
import { ParameterError } from '../../errors/parameter-error';
import { http } from '../../library/http';
import {
  GetUserParam,
  isGetUserParamByFirebaseId,
  isGetUserParamByUserId,
  UserApi,
} from '../user-api';

export class NJAPIUserApi implements UserApi {
  async createUser(param: Omit<CreateUserParam, 'firebaseUid'>): Promise<void> {
    await http.post(`/api/users/`, param);
    return;
  }

  async getUser(param: GetUserParam): Promise<UserDto> {
    let id: string;
    let type: 'firebaseUid' | 'userId';

    if (isGetUserParamByFirebaseId(param)) {
      id = param.firebaseUid;
      type = 'firebaseUid';
    } else if (isGetUserParamByUserId(param)) {
      id = param.userId;
      type = 'userId';
    } else {
      throw new ParameterError('IDの指定が不正です', { param });
    }

    const res = await http.get(`/api/users/${id}?type=${type}`);

    return res.data ?? null;
  }
}
