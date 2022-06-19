import admin from 'firebase-admin';
import '../../../api/firebase';
import { NotFoundError } from '../../../errors/not-found-error';
import { Comment } from '../../models/comment/comment';
import { CommentRepository } from '../../usecases/comment-command-usecase';

export const fsDb = admin.app('toieba').firestore();

export class FSCommentRepository implements CommentRepository {
  async findByCommentId(commentId: string) {
    const commentSnapshots = await fsDb
      .collectionGroup('comments')
      .where('commentId', '==', commentId)
      .get();

    if (!commentSnapshots.size) {
      return null;
    }

    const comment = commentSnapshots.docs[0].data();
    return new Comment({ ...comment, likes: comment.likes ?? [] } as any);
  }

  async save(comment: Comment): Promise<void> {
    await fsDb.runTransaction(async (transaction) => {
      const commentDoc = fsDb
        .collection('toieba')
        .doc(comment.toiebaId)
        .collection('comments')
        .doc(comment.commentId);

      const toiebaDoc = fsDb.collection('toieba').doc(comment.toiebaId);

      const toiebaSnapshot = await transaction.get(toiebaDoc);
      const toieba = toiebaSnapshot.data();
      if (!toieba) {
        throw new NotFoundError('といえばが見つかりません。', comment);
      }

      transaction.update(toiebaDoc, {
        commentCount: (toieba.commentCount ?? 0) + 1,
        popularityCount: (toieba.popularityCount ?? 0) + 1,
      });

      await commentDoc.set({
        commentId: comment.commentId,
        toiebaId: comment.toiebaId,
        userId: comment.userId,
        text: comment.text,
        commentedAt: comment.commentedAt,
        likes: comment.likes,
      });
    });
  }
}
