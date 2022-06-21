import admin from 'firebase-admin';
import '../../../api/firebase';
import { CommentDto, CommentQuery } from '../../usecases/comment-query-usecase';

export const fsDb = admin.app('toieba').firestore();

export class FSCommentQuery implements CommentQuery {
  async queryCommentListByToiebaId(toiebaId: string) {
    const commentDocs = await fsDb
      .collection('toieba')
      .doc(toiebaId)
      .collection('comments')
      .orderBy('commentedAt', 'desc')
      .get();

    if (!commentDocs.size) {
      return [];
    }

    const userIds = Array.from(
      new Set(commentDocs.docs.map((commentDoc) => commentDoc.data().userId))
    );

    const userDocs = await fsDb
      .collection('users')
      .where(admin.firestore.FieldPath.documentId(), 'in', userIds)
      .get();

    const userMap = Object.fromEntries(
      userDocs.docs.map((userDoc) => [userDoc.id, userDoc.data()])
    );
    return commentDocs.docs.map((commentDoc) => {
      const comment = commentDoc.data();

      const user = userMap[comment.userId];

      return {
        ...comment,
        commentId: commentDoc.id,
        commentedAt: comment.commentedAt.toDate().toUTCString(),
        userName: user?.name ?? null,
        likeCount: comment.likes?.length ?? 0,
        likes: comment.likes ?? [],
      } as any;
    }) as CommentDto[];
  }
}
