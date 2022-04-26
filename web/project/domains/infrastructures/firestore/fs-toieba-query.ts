import admin from 'firebase-admin';
import '../../../api/firebase';
import { NotFoundError } from '../../../errors/not-found-error';
import { ToiebaDto, ToiebaQuery } from '../../usecases/toieba-query-usecase';

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
}
