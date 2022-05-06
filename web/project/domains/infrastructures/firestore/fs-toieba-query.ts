import admin from 'firebase-admin';
import '../../../api/firebase';
import { NotFoundError } from '../../../errors/not-found-error';
import {
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

}
