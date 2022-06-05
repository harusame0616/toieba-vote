import admin from 'firebase-admin';
import '../../../api/firebase';
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
    const commentDoc = fsDb
      .collection('toieba')
      .doc(comment.toiebaId)
      .collection('comments')
      .doc(comment.commentId);

    await commentDoc.set({
      commentId: comment.commentId,
      toiebaId: comment.toiebaId,
      userId: comment.userId,
      text: comment.text,
      commentedAt: comment.commentedAt,
      likes: comment.likes,
    });
  }
}
