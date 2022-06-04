export interface UserDto {
  userId: string;
  name: string;
  comment: string;
}

export interface UserQuery {
  queryWithFirebaseUid(firebaseUid: string): Promise<UserDto>;
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

  async queryWithFirebaseUid(id: string) {
    return await this.param.userQuery.queryWithFirebaseUid(id);
  }
}
