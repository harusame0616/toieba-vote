import admin from 'firebase-admin';
import '../../../api/firebase';
import { NotFoundError } from '../../../errors/not-found-error';
import {
  AnsweredByUserParam,
  ToiebaBriefDto,
  ToiebaDto,
  ToiebaQuery,
} from '../../usecases/toieba-query-usecase';

export const fsDb = admin.app('toieba').firestore();

export class FSToiebaQuery implements ToiebaQuery {
  async getDetail(toiebaId: string): Promise<ToiebaDto> {
    const snapShot = await fsDb.collection('toieba').doc(toiebaId).get();
    if (!snapShot.exists) {
      throw new NotFoundError('といえばが見つかりません。');
    }
    const data = snapShot.data() as any;

    return { ...data, toiebaId: snapShot.id } as ToiebaDto;
  }

  async latestList(count: number, cursor?: string): Promise<ToiebaBriefDto[]> {
    const cursorSnapshot = cursor
      ? await fsDb.collection('toieba').doc(cursor).get()
      : null;

    const snapshot = await (cursorSnapshot
      ? fsDb
          .collection('toieba')
          .orderBy('createdAt', 'desc')
          .startAfter(cursorSnapshot)
          .limit(count)
          .get()
      : fsDb
          .collection('toieba')
          .orderBy('createdAt', 'desc')
          .limit(count)
          .get());

    return snapshot.docs.map((doc: any) => {
      const toieba = doc.data();
      return {
        toiebaId: doc.id,
        theme: toieba.theme,
        postedAt: toieba.createdAt.toDate().toUTCString(),
        voteCount: toieba.voteCount,
        commentCount: toieba.commentCount,
      };
    });
  }

  async popularList(count: number, cursor?: string): Promise<ToiebaBriefDto[]> {
    const cursorSnapshot = cursor
      ? await fsDb.collection('toieba').doc(cursor).get()
      : null;

    const snapshot = await (cursorSnapshot
      ? fsDb
          .collection('toieba')
          .orderBy('popularityCount', 'desc')
          .startAfter(cursorSnapshot)
          .limit(count)
          .get()
      : fsDb
          .collection('toieba')
          .orderBy('popularityCount', 'desc')
          .limit(count)
          .get());

    return snapshot.docs.map((doc: any) => {
      const toieba = doc.data();
      return {
        toiebaId: doc.id,
        theme: toieba.theme,
        postedAt: toieba.createdAt.toDate().toUTCString(),
        voteCount: toieba.voteCount,
        commentCount: toieba.commentCount,
      };
    });
  }

  async listOfAnsweredByUser({
    userId,
    count,
    cursor,
  }: AnsweredByUserParam): Promise<ToiebaBriefDto[]> {
    const cursorSnapshot = cursor
      ? await fsDb
          .collection('answers')
          .where('toiebaId', '==', cursor)
          .where('userId', '==', userId)
          .get()
      : null;

    const answerSnapshots = await (cursorSnapshot
      ? fsDb
          .collection('answers')
          .where('userId', '==', userId)
          .orderBy('answeredAt', 'desc')
          .startAfter(cursorSnapshot.docs[0])
          .limit(count)
          .get()
      : fsDb
          .collection('answers')
          .where('userId', '==', userId)
          .orderBy('answeredAt', 'desc')
          .limit(count)
          .get());

    const answeredToiebaIds = answerSnapshots.docs.map(
      (answer) => answer.data().toiebaId
    );

    if (!answeredToiebaIds.length) {
      return [];
    }

    const toiebaSnapshots = await fsDb
      .collection('toieba')
      .where(admin.firestore.FieldPath.documentId(), 'in', answeredToiebaIds)
      .get();

    const toiebaMap = Object.fromEntries(
      toiebaSnapshots.docs.map((doc) => {
        const toieba = doc.data();

        return [
          doc.id,
          {
            toiebaId: doc.id,
            theme: toieba.theme,
            postedAt: toieba.createdAt.toDate().toUTCString(),
            voteCount: toieba.voteCount,
            commentCount: toieba.commentCount,
          },
        ];
      })
    );

    // orderByの順番にソートし直して返却
    return answeredToiebaIds.map((id) => toiebaMap[id]);
  }
}
