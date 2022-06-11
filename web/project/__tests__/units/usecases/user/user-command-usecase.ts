import {
  UserCommandUsecase,
  UserRepository,
} from '../../../../domains/usecases/user-command-usecase';
import crypto from 'crypto';
import { User } from '../../../../domains/models/user/user';

class TestUserRepository implements UserRepository {
  users = {} as { [key: string]: User };
  async save(user: User): Promise<void> {
    this.users[user.firebaseUid] = user;
  }

  async findOneByUserId(userId: string): Promise<User | null> {
    return (
      Object.values(this.users).find((user) => user.userId === userId) ?? null
    );
  }
  async findOneByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.users[firebaseUid] ?? null;
  }

  init() {
    this.users = {};
  }
}

const NAME_MAX_LENGTH = 64;
const COMMENT_MAX_LENGTH = 255;
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
    const firebaseUid = crypto.randomUUID();

    it.each([
      { name: minLengthName, comment: minLengthComment, firebaseUid },
      { name: maxLengthName, comment: maxLengthComment, firebaseUid },
    ])('ユーザーが作成できる', async ({ name, comment }) => {
      await userCommandUsecase.createUser({
        name,
        comment,
        firebaseUid,
      });
      const user = userRepository.users[firebaseUid];
      expect({
        name: user.name,
        comment: user.comment,
        firebaseUid: user.firebaseUid,
        userId: user.firebaseUid,
      }).toEqual({
        name,
        comment,
        firebaseUid,
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
        userCommandUsecase.createUser({
          name,
          comment: '',
          firebaseUid: crypto.randomUUID(),
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
        userCommandUsecase.createUser({
          name: 'a',
          comment,
          firebaseUid: crypto.randomUUID(),
        })
      ).rejects.toThrow(errorMessage);
    });

    it('同一Firebase Uidでの再登録エラー', async () => {
      const firebaseUid = crypto.randomUUID();

      await userCommandUsecase.createUser({
        name: 'a',
        comment: '',
        firebaseUid,
      });
      await expect(
        userCommandUsecase.createUser({
          name: 'a',
          comment: '',
          firebaseUid,
        })
      ).rejects.toThrow('登録済みのユーザーです。');
    });
  });
});

describe('editProfile', () => {
  const userRepository = new TestUserRepository();
  const userCommandUsecase = new UserCommandUsecase({
    userRepository,
  });
  const firebaseUid = crypto.randomUUID();

  let createdUserDto: {
    userId: string;
    firebaseUid: string;
    comment: string;
    name: string;
  };
  beforeEach(async () => {
    userRepository.init();

    await userCommandUsecase.createUser({
      name: 'name',
      comment: 'comment',
      firebaseUid,
    });
    const user = userRepository.users[firebaseUid];
    createdUserDto = {
      userId: user.userId,
      firebaseUid: user.firebaseUid,
      comment: user.comment,
      name: user.name,
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
      const editedUser = userRepository.users[createdUserDto.firebaseUid];

      expect({
        userId: editedUser.userId,
        firebaseUid: editedUser.firebaseUid,
        name: editedUser.name,
        comment: editedUser.comment,
      }).toEqual({
        ...createdUserDto,
        name,
        comment,
      });
    });
  });
  describe('異常系', () => {
    beforeEach(async () => {
      userRepository.init();

      await userCommandUsecase.createUser({
        name: 'name',
        comment: 'comment',
        firebaseUid,
      });
      const user = userRepository.users[firebaseUid];
      createdUserDto = {
        userId: user.userId,
        firebaseUid: user.firebaseUid,
        comment: user.comment,
        name: user.name,
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
