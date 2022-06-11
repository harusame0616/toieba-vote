import admin from 'firebase-admin';
import '../../../api/firebase';
import { NotFoundError } from '../../../errors/not-found-error';
import { AuthenticationId } from '../../models/user/user';
import { UserDto, UserQuery } from '../../usecases/user-query-usecase';

export const fsDb = admin.app('toieba').firestore();
export class FSUserQuery implements UserQuery {
  async queryWithUserId(userId: string): Promise<UserDto> {
    const snapShot = await fsDb.collection('users').doc(userId).get();
    if (!snapShot.exists) {
      throw new NotFoundError('ユーザーが見つかりません。', { userId });
    }
    const user = snapShot.data() as any;
    return { ...user, userId: snapShot.id };
  }

  async queryWithAuthenticationId(
    authenticationId: AuthenticationId
  ): Promise<UserDto> {
    const snapShot = await fsDb
      .collection('users')
      .where('authenticationId.id', '==', authenticationId.id)
      .get();
    if (!snapShot.docs.length) {
      throw new NotFoundError('ユーザーが見つかりません。');
    }

    const data = snapShot.docs[0].data() as any;
    return { ...data, userId: snapShot.docs[0].id } as UserDto;
  }
}
