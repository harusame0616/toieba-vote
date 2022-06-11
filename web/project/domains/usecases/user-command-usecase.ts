import { AlreadyExistsError } from '../../errors/already-exists-error';
import { NotFoundError } from '../../errors/not-found-error';
import { CreateUserParam, User, UserProfile } from '../models/user/user';

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
  findOneByUserId(userId: string): Promise<User | null>;
  findOneByFirebaseUid(firebaseUid: string): Promise<User | null>;
  save(user: User): Promise<void>;
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

  async editProfile(userId: string, profile: UserProfile) {
    const user = await this.param.userRepository.findOneByUserId(userId);

    if (!user) {
      throw new NotFoundError('ユーザーが見つかりません。', { userId });
    }

    user.name = profile.name;
    user.comment = profile.comment;

    await this.param.userRepository.save(user);
  }
}
