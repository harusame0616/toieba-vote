import admin from 'firebase-admin';
import '../../../api/firebase';
import { Toieba } from '../../models/toieba/toieba';
import { User } from '../../models/user/user';
import { UserRepository } from '../../usecases/user-command-usecase';
export const globalStore: { [key: string]: Toieba } = {};

export const fsDb = admin.app('toieba').firestore();
export class FSUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    await fsDb.collection('users').doc(user.userId).set({
      name: user.name,
      firebaseUid: user.firebaseUid,
    });
  }
}
