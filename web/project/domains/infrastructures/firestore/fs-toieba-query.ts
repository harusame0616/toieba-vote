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

  async latestList(count: number): Promise<ToiebaBriefDto[]> {
    const snapShot = await fsDb
      .collection('toieba')
      .orderBy('createdAt', 'desc')
      .limit(count)
      .get();

    return snapShot.docs.map((doc: any) => {
      const toieba = doc.data();
      return {
        toiebaId: doc.id,
        theme: toieba.theme,
      };
    });
  }

  async popularList(count: number): Promise<ToiebaBriefDto[]> {
    const snapShot = await fsDb
      .collection('toieba')
      .orderBy('voteCount', 'desc')
      .limit(count)
      .get();

    return snapShot.docs.map((doc: any) => {
      const toieba = doc.data();
      return {
        toiebaId: doc.id,
        theme: toieba.theme,
      };
    });
  }

  async listOfAnsweredByUser({
    userId,
    count,
  }: AnsweredByUserParam): Promise<ToiebaBriefDto[]> {
    const answerSnapshots = await fsDb
      .collectionGroup('answers')
      .where('userId', '==', userId)
      .get();

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

    return toiebaSnapshots.docs.map((doc) => ({
      toiebaId: doc.id,
      theme: doc.data().theme,
    }));
  }
}
