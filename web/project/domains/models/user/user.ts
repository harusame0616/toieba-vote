import { FirebaseUserInfoDto } from '../../usecases/user-command-usecase';
import crypto, { randomUUID } from 'crypto';

interface UserConstructorParam {
  userId: string;
  firebaseUid: string;
  name: string;
}

export class User {
  constructor(private param: UserConstructorParam) {}

  static createFromFirebase(userInfo: FirebaseUserInfoDto) {
    const id = crypto.randomUUID();
    return new User({
      userId: id,
      firebaseUid: userInfo.uid,
      name: userInfo.displayName ?? id,
    });
  }

  get userId() {
    return this.param.userId;
  }
  get firebaseUid() {
    return this.param.firebaseUid;
  }
  get name() {
    return this.param.name;
  }
}
