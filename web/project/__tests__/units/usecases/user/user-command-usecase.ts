import crypto from 'crypto';
import {
  AuthenticationId,
  AuthenticationType,
  User,
} from '../../../../domains/models/user/user';
import {
  UserCommandUsecase,
  UserRepository,
} from '../../../../domains/usecases/user-command-usecase';

class TestUserRepository implements UserRepository {
  users = {} as { [key: string]: User };
  async save(user: User): Promise<void> {
    this.users[user.authenticationId.id] = user;
  }

  async findOneByUserId(userId: string): Promise<User | null> {
    return (
      Object.values(this.users).find((user) => user.userId === userId) ?? null
    );
  }
  async findOneByAuthenticationId(
    authenticationId: AuthenticationId
  ): Promise<User | null> {
    return this.users[authenticationId.id] ?? null;
  }

  init() {
    this.users = {};
  }
}

const NAME_MAX_LENGTH = 64;
const COMMENT_MAX_LENGTH = 255;
const authenticationId = {
  id: crypto.randomUUID(),
  type: 'firebase' as AuthenticationType,
};
describe('createUser', () => {
  describe('正常系', () => {
    let userRepository: TestUserRepository;
    let userCommandUsecase: UserCommandUsecase;
    beforeEach(() => {
      userRepository = new TestUserRepository();
      userCommandUsecase = new UserCommandUsecase({
        userRepository,
      });
    });

    const minLengthName = 'a';
    const maxLengthName = 'a'.repeat(NAME_MAX_LENGTH);
    const minLengthComment = '';
    const maxLengthComment = 'a'.repeat(COMMENT_MAX_LENGTH);

    it.each([
      { name: minLengthName, comment: minLengthComment },
      { name: maxLengthName, comment: maxLengthComment },
    ])('ユーザーが作成できる', async ({ name, comment }) => {
      await userCommandUsecase.createUser({ name, comment }, authenticationId);

      const user = userRepository.users[authenticationId.id];
      expect({
        name: user.name,
        comment: user.comment,
        authenticationId: user.authenticationId,
        userId: user.userId,
      }).toEqual({
        name,
        comment,
        authenticationId: expect.objectContaining(authenticationId),
        userId: expect.anything(),
      });
    });
  });

  describe('異常系', () => {
    let userRepository: TestUserRepository;
    let userCommandUsecase: UserCommandUsecase;
    beforeEach(() => {
      userRepository = new TestUserRepository();
      userCommandUsecase = new UserCommandUsecase({
        userRepository,
      });
    });

    it.each([
      ['', '名前は必須です。'],
      [
        'a'.repeat(NAME_MAX_LENGTH + 1),
        `名前は${NAME_MAX_LENGTH}文字以下である必要があります。`,
      ],
    ])('名前のバリデーションエラー', async (name, errorMessage) => {
      await expect(
        userCommandUsecase.createUser({ name, comment: '' }, authenticationId)
      ).rejects.toThrow(errorMessage);
    });

    it.each([
      [
        'a'.repeat(COMMENT_MAX_LENGTH + 1),
        `コメントは${COMMENT_MAX_LENGTH}文字以下である必要があります。`,
      ],
    ])('コメントのバリデーションエラー', async (comment, errorMessage) => {
      await expect(
        userCommandUsecase.createUser({ name: 'a', comment }, authenticationId)
      ).rejects.toThrow(errorMessage);
    });

    it('同一Firebase Uidでの再登録エラー', async () => {
      await userCommandUsecase.createUser(
        { name: 'a', comment: '' },
        authenticationId
      );

      await expect(
        userCommandUsecase.createUser(
          {
            name: 'a',
            comment: '',
          },
          authenticationId
        )
      ).rejects.toThrow('登録済みのユーザーです。');
    });
  });
});

describe('editProfile', () => {
  const userRepository = new TestUserRepository();
  const userCommandUsecase = new UserCommandUsecase({
    userRepository,
  });

  let createdUserDto: {
    userId: string;
    comment: string;
    name: string;
    authenticationId: AuthenticationId;
  };
  beforeEach(async () => {
    userRepository.init();

    await userCommandUsecase.createUser(
      { name: 'name', comment: 'comment' },
      authenticationId
    );
    const user = userRepository.users[authenticationId.id];
    createdUserDto = {
      userId: user.userId,
      comment: user.comment,
      name: user.name,
      authenticationId: user.authenticationId,
    };
  });

  describe('正常系', () => {
    it.each([
      ['a', ''],
      ['a'.repeat(NAME_MAX_LENGTH), 'a'.repeat(COMMENT_MAX_LENGTH)],
    ])('プロフィールが編集できる', async (name, comment) => {
      await userCommandUsecase.editProfile(createdUserDto.userId, {
        name,
        comment,
      });
      const editedUser =
        userRepository.users[createdUserDto.authenticationId.id];

      expect({
        userId: editedUser.userId,
        name: editedUser.name,
        comment: editedUser.comment,
        authenticationId: editedUser.authenticationId,
      }).toEqual({
        ...createdUserDto,
        authenticationId: expect.objectContaining(editedUser.authenticationId),
        name,
        comment,
      });
    });
  });
  describe('異常系', () => {
    beforeEach(async () => {
      userRepository.init();

      await userCommandUsecase.createUser(
        { name: 'name', comment: 'comment' },
        authenticationId
      );
      const user = userRepository.users[authenticationId.id];

      createdUserDto = {
        userId: user.userId,
        comment: user.comment,
        name: user.name,
        authenticationId: user.authenticationId,
      };
    });

    it('存在しないユーザーのプロフィール編集', async () => {
      await expect(
        userCommandUsecase.editProfile(crypto.randomUUID(), {
          name: 'a',
          comment: 'a',
        })
      ).rejects.toThrow('ユーザーが見つかりません。');
    });

    it.each([
      ['', '名前は必須です。'],
      [
        'a'.repeat(NAME_MAX_LENGTH + 1),
        `名前は${NAME_MAX_LENGTH}文字以下である必要があります。`,
      ],
    ])('名前のバリデーションエラー', async (name, errorMessage) => {
      await expect(
        userCommandUsecase.editProfile(createdUserDto.userId, {
          name,
          comment: '',
        })
      ).rejects.toThrow(errorMessage);
    });

    it.each([
      [
        'a'.repeat(COMMENT_MAX_LENGTH + 1),
        `コメントは${COMMENT_MAX_LENGTH}文字以下である必要があります。`,
      ],
    ])('コメントのバリデーションエラー', async (comment, errorMessage) => {
      await expect(
        userCommandUsecase.editProfile(createdUserDto.userId, {
          name: 'a',
          comment,
        })
      ).rejects.toThrow(errorMessage);
    });
  });
});
