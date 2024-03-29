import admin from 'firebase-admin';
import '../../../api/firebase';
import { Choice } from '../../models/toieba/choice';
import { Toieba } from '../../models/toieba/toieba';
import { ToiebaRepository } from '../../usecases/toieba-command-usecase';

export const fsDb = admin.app('toieba').firestore();
export class FSToiebaRepository implements ToiebaRepository {
  async findbyId(id: string): Promise<Toieba | undefined> {
    const snapShot = await fsDb.collection('toieba').doc(id).get();
    if (!snapShot.exists) {
      return undefined;
    }
    const data = snapShot.data() as any;

    return new Toieba({
      ...data,
      choices: data.choices.map((choice: any) => new Choice(choice)),
      toiebaId: snapShot.id,
    });
  }

  async save(toieba: Toieba): Promise<void> {
    await fsDb
      .collection('toieba')
      .doc(toieba.toiebaId)
      .set({
        theme: toieba.theme,
        creatorId: toieba.creatorId,
        choices: toieba.choices.map((choice) => ({
          choiceId: choice.choiceId,
          label: choice.label,
        })),
        createdAt: new Date(),
        voteCount: 0,
        commentCount: 0,
        popularityCount: 0,
      });
  }
}
