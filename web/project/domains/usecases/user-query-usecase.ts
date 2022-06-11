import { AuthenticationId } from '../models/user/user';

export interface UserDto {
  userId: string;
  name: string;
  comment: string;
}

export interface UserQuery {
  queryWithAuthenticationId(
    authenticationId: AuthenticationId
  ): Promise<UserDto>;
  queryWithUserId(userId: string): Promise<UserDto>;
}

interface UserQueryUsecaseConstructorParam {
  userQuery: UserQuery;
}

export class UserQueryUsecase {
  constructor(private readonly param: UserQueryUsecaseConstructorParam) {}

  async queryWithUserId(userId: string) {
    return await this.param.userQuery.queryWithUserId(userId);
  }

  async queryWithAuthenticationId(authenticationId: AuthenticationId) {
    return await this.param.userQuery.queryWithAuthenticationId(
      authenticationId
    );
  }
}
