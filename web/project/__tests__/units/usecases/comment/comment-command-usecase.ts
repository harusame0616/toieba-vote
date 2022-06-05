import crypto from 'crypto';
import { Comment } from '../../../../domains/models/comment/comment';
import { Choice } from '../../../../domains/models/toieba/choice';
import { Toieba } from '../../../../domains/models/toieba/toieba';
import {
  CommentCommandUsecase,
  CommentRepository,
} from '../../../../domains/usecases/comment-command-usecase';
import { ToiebaRepository } from '../../../../domains/usecases/toieba-command-usecase';

class TestToiebaRepository implements ToiebaRepository {
  toiebaMap = {} as { [key: string]: Toieba };

  async findbyId(toiebaId: string): Promise<Toieba | undefined> {
    return this.toiebaMap[toiebaId] ?? undefined;
  }

  async save(toieba: Toieba): Promise<void> {
    this.toiebaMap[toieba.toiebaId] = toieba;
  }
}

class TestCommentRepository implements CommentRepository {
  comments: Comment[] = [];

  async findByCommentId(commentId: string): Promise<Comment | null> {
    return (
      this.comments.find((comment) => comment.commentId === commentId) ?? null
    );
  }

  async save(comment: Comment): Promise<void> {
    const index = this.comments.findIndex(
      ({ commentId }) => comment.commentId === commentId
    );
    if (index < -1) {
      this.comments.push(comment);
    } else {
      this.comments.splice(index, 1, comment);
    }
  }
}

const COMMENT_MAX_LENGTH = 255;

describe('postComment', () => {
  describe('正常系', () => {
    let commentRepository: TestCommentRepository;
    let toiebaRepository: TestToiebaRepository;
    let commentCommandUsecase: CommentCommandUsecase;
    let toieba: Toieba;

    beforeEach(async () => {
      commentRepository = new TestCommentRepository();
      toiebaRepository = new TestToiebaRepository();
      commentCommandUsecase = new CommentCommandUsecase({
        commentRepository,
        toiebaRepository,
      });
      toieba = new Toieba({
        toiebaId: crypto.randomUUID(),
        theme: 'a',
        creatorId: crypto.randomUUID(),
        choices: [
          Choice.create({ label: 'label1', index: 0 }),
          Choice.create({ label: 'label2', index: 1 }),
          Choice.create({ label: 'label3', index: 2 }),
          Choice.create({ label: 'label4', index: 3 }),
        ],
      });
      await toiebaRepository.save(toieba);
    });

    const minLengthComment = 'a';
    const maxLengthComment = 'a'.repeat(COMMENT_MAX_LENGTH);

    it.each([minLengthComment, maxLengthComment])(
      'コメントが投稿できる',
      async (text) => {
        await commentCommandUsecase.postComment({
          toiebaId: toieba.toiebaId,
          text,
          userId: toieba.creatorId,
        });

        const comment = commentRepository.comments[0];
        expect({
          text: comment.text,
          toiebaId: comment.toiebaId,
          userId: comment.userId,
          commentedAt: comment.commentedAt,
          likes: comment.likes,
          likesLength: comment.likes.length,
        }).toEqual({
          text,
          toiebaId: toieba.toiebaId,
          userId: toieba.creatorId,
          commentedAt: expect.any(Date),
          likes: expect.any(Array),
          likesLength: 0,
        });
      }
    );
  });
});

describe('異常系', () => {
  let commentRepository: TestCommentRepository;
  let toiebaRepository: TestToiebaRepository;
  let commentCommandUsecase: CommentCommandUsecase;
  let toieba: Toieba;

  beforeEach(async () => {
    commentRepository = new TestCommentRepository();
    toiebaRepository = new TestToiebaRepository();
    commentCommandUsecase = new CommentCommandUsecase({
      commentRepository,
      toiebaRepository,
    });
    toieba = new Toieba({
      toiebaId: crypto.randomUUID(),
      theme: 'a',
      creatorId: crypto.randomUUID(),
      choices: [
        Choice.create({ label: 'label1', index: 0 }),
        Choice.create({ label: 'label2', index: 1 }),
        Choice.create({ label: 'label3', index: 2 }),
        Choice.create({ label: 'label4', index: 3 }),
      ],
    });
    await toiebaRepository.save(toieba);
  });

  it.each([
    ['', 'テキストは必須です。'],
    [
      'a'.repeat(COMMENT_MAX_LENGTH + 1),
      `テキストは${COMMENT_MAX_LENGTH}文字以下である必要があります。`,
    ],
  ])('テキストのバリデーションエラー', async (text, errorMessage) => {
    await expect(
      commentCommandUsecase.postComment({
        toiebaId: toieba.toiebaId,
        text,
        userId: toieba.creatorId,
      })
    ).rejects.toThrow(errorMessage);
  });

  it('コメント対象のといえばが存在しないエラー', async () => {
    await expect(
      commentCommandUsecase.postComment({
        toiebaId: crypto.randomUUID(),
        text: 'a',
        userId: toieba.creatorId,
      })
    ).rejects.toThrow('といえばが存在しません。');
  });
});

describe('likeComment', () => {
  describe('正常系', () => {
    let commentRepository: TestCommentRepository;
    let toiebaRepository: TestToiebaRepository;
    let commentCommandUsecase: CommentCommandUsecase;
    let toieba: Toieba;

    beforeEach(async () => {
      commentRepository = new TestCommentRepository();
      toiebaRepository = new TestToiebaRepository();
      commentCommandUsecase = new CommentCommandUsecase({
        commentRepository,
        toiebaRepository,
      });
      toieba = new Toieba({
        toiebaId: crypto.randomUUID(),
        theme: 'a',
        creatorId: crypto.randomUUID(),
        choices: [
          Choice.create({ label: 'label1', index: 0 }),
          Choice.create({ label: 'label2', index: 1 }),
          Choice.create({ label: 'label3', index: 2 }),
          Choice.create({ label: 'label4', index: 3 }),
        ],
      });
      await toiebaRepository.save(toieba);

      await commentCommandUsecase.postComment({
        toiebaId: toieba.toiebaId,
        userId: toieba.creatorId,
        text: 'a',
      });
    });

    it('イイねできる', async () => {
      const userId = crypto.randomUUID();
      await commentCommandUsecase.likeComment({
        commentId: commentRepository.comments[0].commentId,
        userId,
      });

      expect(commentRepository.comments[0].likes[0]).toEqual({
        userId,
        likedAt: expect.any(Date),
      });
    });

    it('複数回いいねしても重複しない', async () => {
      const userId = crypto.randomUUID();
      await commentCommandUsecase.likeComment({
        commentId: commentRepository.comments[0].commentId,
        userId,
      });
      await commentCommandUsecase.likeComment({
        commentId: commentRepository.comments[0].commentId,
        userId,
      });

      expect(commentRepository.comments[0].likes.length).toBe(1);
    });
  });

  describe('異常系', () => {
    let commentRepository: TestCommentRepository;
    let toiebaRepository: TestToiebaRepository;
    let commentCommandUsecase: CommentCommandUsecase;
    let toieba: Toieba;

    beforeEach(async () => {
      commentRepository = new TestCommentRepository();
      toiebaRepository = new TestToiebaRepository();
      commentCommandUsecase = new CommentCommandUsecase({
        commentRepository,
        toiebaRepository,
      });
      toieba = new Toieba({
        toiebaId: crypto.randomUUID(),
        theme: 'a',
        creatorId: crypto.randomUUID(),
        choices: [
          Choice.create({ label: 'label1', index: 0 }),
          Choice.create({ label: 'label2', index: 1 }),
          Choice.create({ label: 'label3', index: 2 }),
          Choice.create({ label: 'label4', index: 3 }),
        ],
      });
      await toiebaRepository.save(toieba);
    });

    it('いいね対象のコメントが存在しないエラー', async () => {
      const userId = crypto.randomUUID();
      await expect(
        commentCommandUsecase.likeComment({
          commentId: crypto.randomUUID(),
          userId,
        })
      ).rejects.toThrow('コメントが存在しません。');
    });
  });
});

describe('unlikeComment', () => {
  describe('正常系', () => {
    let commentRepository: TestCommentRepository;
    let toiebaRepository: TestToiebaRepository;
    let commentCommandUsecase: CommentCommandUsecase;
    let toieba: Toieba;

    beforeEach(async () => {
      commentRepository = new TestCommentRepository();
      toiebaRepository = new TestToiebaRepository();
      commentCommandUsecase = new CommentCommandUsecase({
        commentRepository,
        toiebaRepository,
      });
      toieba = new Toieba({
        toiebaId: crypto.randomUUID(),
        theme: 'a',
        creatorId: crypto.randomUUID(),
        choices: [
          Choice.create({ label: 'label1', index: 0 }),
          Choice.create({ label: 'label2', index: 1 }),
          Choice.create({ label: 'label3', index: 2 }),
          Choice.create({ label: 'label4', index: 3 }),
        ],
      });
      await toiebaRepository.save(toieba);
    });

    it('イイね取り消しできる', async () => {
      await commentCommandUsecase.postComment({
        toiebaId: toieba.toiebaId,
        userId: toieba.creatorId,
        text: 'a',
      });

      const userId = crypto.randomUUID();
      await commentCommandUsecase.likeComment({
        commentId: commentRepository.comments[0].commentId,
        userId,
      });

      await commentCommandUsecase.unlikeComment({
        commentId: commentRepository.comments[0].commentId,
        userId,
      });

      expect(commentRepository.comments[0].likes.length).toEqual(0);
    });

    it('イイねが無くても取り消しでエラーにならない', async () => {
      await commentCommandUsecase.postComment({
        toiebaId: toieba.toiebaId,
        userId: toieba.creatorId,
        text: 'a',
      });

      const userId = crypto.randomUUID();
      await commentCommandUsecase.unlikeComment({
        commentId: commentRepository.comments[0].commentId,
        userId,
      });

      expect(commentRepository.comments[0].likes.length).toEqual(0);
    });
  });

  describe('異常系', () => {
    let commentRepository: TestCommentRepository;
    let toiebaRepository: TestToiebaRepository;
    let commentCommandUsecase: CommentCommandUsecase;

    beforeEach(async () => {
      commentRepository = new TestCommentRepository();
      toiebaRepository = new TestToiebaRepository();
      commentCommandUsecase = new CommentCommandUsecase({
        commentRepository,
        toiebaRepository,
      });
    });

    it('いいね取り消し対象のコメントが存在しないエラー', async () => {
      const userId = crypto.randomUUID();
      await expect(
        commentCommandUsecase.unlikeComment({
          commentId: crypto.randomUUID(),
          userId,
        })
      ).rejects.toThrow('コメントが存在しません。');
    });
  });
});
