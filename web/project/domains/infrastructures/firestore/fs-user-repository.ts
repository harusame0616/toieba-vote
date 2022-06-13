import admin from 'firebase-admin';
import '../../../api/firebase';
import { AuthenticationId, User } from '../../models/user/user';
import { UserRepository } from '../../usecases/user-command-usecase';

export const fsDb = admin.app('toieba').firestore();
export class FSUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    await fsDb.collection('users').doc(user.userId).set({
      name: user.name,
      comment: user.comment,
      authenticationId: user.authenticationId,
    });
  }

  async findOneByAuthenticationId(
    authenticationId: AuthenticationId
  ): Promise<User | null> {
    const snapShot = await fsDb
      .collection('users')
      .where('authenticationId.id', '==', authenticationId.id)
      .get();

    if (!snapShot.size) {
      return null;
    }

    const data = snapShot.docs[0].data() as any;
    return new User({
      userId: snapShot.docs[0].id,
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
