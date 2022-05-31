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

  async findOneByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.users[firebaseUid] ?? null;
  }
}

describe('createUser', () => {
  const NAME_MAX_LENGTH = 64;
  const COMMENT_MAX_LENGTH = 255;

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
        firebaseUid,
      });
      await expect(
        userCommandUsecase.createUser({
          name: 'a',
          firebaseUid,
        })
      ).rejects.toThrow('登録済みのユーザーです。');
    });
  });
});
