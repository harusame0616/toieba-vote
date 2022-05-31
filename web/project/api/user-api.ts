import { CreateUserParam } from '../domains/models/user/user';
import { UserDto } from '../domains/usecases/user-query-usecase';

interface GetUserParamByUserId {
  userId: string;
}

interface GetUserParamByFirebase {
  firebaseUid: string;
}

export type GetUserParam = GetUserParamByUserId | GetUserParamByFirebase;

export const isGetUserParamByUserId = (v: any): v is GetUserParamByUserId =>
  !!v?.userId;

export const isGetUserParamByFirebaseId = (
  v: any
): v is GetUserParamByFirebase => !!v?.firebaseUid;

export interface UserApi {
  getUser(param: GetUserParam): Promise<UserDto>;
  createUser(param: Omit<CreateUserParam, 'firebaseUid'>): Promise<void>;
}
