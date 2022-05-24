export interface UserDto {
  userId: string;
  name: string;
}

export interface UserQuery {
  queryWithFirebaseUid(firebaseUid: string): Promise<UserDto>;
}

interface UserQueryUsecaseConstructorParam {
  userQuery: UserQuery;
}

export class UserQueryUsecase {
  constructor(private readonly param: UserQueryUsecaseConstructorParam) {}

  async queryWithFirebaseUid(id: string) {
    return await this.param.userQuery.queryWithFirebaseUid(id);
  }
}
