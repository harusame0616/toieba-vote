import { AlreadyExistsError } from '../../errors/already-exists-error';
import { CreateUserParam, User } from '../models/user/user';

export interface UserDto {
  userId: string;
  name: string;
  comment: string;
}

export interface FirebaseUserInfoDto {
  uid: string;
  displayName?: string;
}

export interface UserRepository {
  save(user: User): Promise<void>;
  findOneByFirebaseUid(firebaseUid: string): Promise<User | null>;
}

interface UserCommandUsecaseConstructorParam {
  userRepository: UserRepository;
}

export class UserCommandUsecase {
  constructor(private readonly param: UserCommandUsecaseConstructorParam) {}

  async createUser(param: CreateUserParam) {
    const user = await this.param.userRepository.findOneByFirebaseUid(
      param.firebaseUid
    );
    if (user) {
      throw new AlreadyExistsError('登録済みのユーザーです。', { user });
    }

    const newUser = User.create(param);
    await this.param.userRepository.save(newUser);
  }
}
