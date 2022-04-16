import { Toieba } from '../../models/toieba/toieba';
import { ToiebaRepository } from '../../usecases/toieba-command-usecase';
import admin from 'firebase-admin';
import { Choice } from '../../models/toieba/choice';
export const globalStore: { [key: string]: Toieba } = {};

export const fsDb = admin.app('toieba').firestore();
export class FSToiebaRepository implements ToiebaRepository {
  store: any = {};
  constructor() {}
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
    console.log('save');
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
      });
    console.log('saved');
  }
}
