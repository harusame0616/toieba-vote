import { User } from '../models/user/user';

export interface UserDto {
  userId: string;
  name: string;
}

export interface FirebaseUserInfoDto {
  uid: string;
  displayName?: string;
}

export interface UserRepository {
  save(user: User): Promise<void>;
}

interface UserCommandUsecaseConstructorParam {
  userRepository: UserRepository;
}

export class UserCommandUsecase {
  constructor(private readonly param: UserCommandUsecaseConstructorParam) {}

  async createFromFirebase(param: FirebaseUserInfoDto) {
    const newUser = User.createFromFirebase(param);
    await this.param.userRepository.save(newUser);
    return { userId: newUser.userId };
  }
}
