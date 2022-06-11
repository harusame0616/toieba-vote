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
      comment: user.comment,
    });
  }

  async findOneByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const snapShot = await fsDb
      .collection('users')
      .where('firebaseUid', '==', firebaseUid)
      .get();

    if (!snapShot.size) {
      return null;
    }

    const data = snapShot.docs[0].data() as any;
    return new User({
      ...data,
    });
  }

  async findOneByUserId(userId: string): Promise<User | null> {
    const snapShot = await fsDb.collection('users').doc(userId).get();

    if (!snapShot.exists) {
      return null;
    }

    const data = snapShot.data() as any;
    return new User({
      userId,
      ...data,
    });
  }
}
