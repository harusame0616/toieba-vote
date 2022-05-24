import admin from 'firebase-admin';
import '../../../api/firebase';
import { NotFoundError } from '../../../errors/not-found-error';
import { UserDto, UserQuery } from '../../usecases/user-query-usecase';

export const fsDb = admin.app('toieba').firestore();
export class FSUserQuery implements UserQuery {
  async queryWithFirebaseUid(firebaseUid: string): Promise<UserDto> {
    const snapShot = await fsDb
      .collection('users')
      .where('firebaseUid', '==', firebaseUid)
      .get();
    if (!snapShot.docs.length) {
      throw new NotFoundError('ユーザーが見つかりません。');
    }
    const data = snapShot.docs[0].data() as any;
    return { ...data, userId: snapShot.docs[0].id } as UserDto;
  }
}
