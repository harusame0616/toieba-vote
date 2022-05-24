import admin from 'firebase-admin';
import '../../../api/firebase';
import {
  AnswerQuery,
  TotalDto,
  TotalParam,
} from '../../usecases/answer-query-usecase';

export const fsDb = admin.app('toieba').firestore();
export class FSAnswerQuery implements AnswerQuery {
  async total({ toiebaId }: TotalParam): Promise<TotalDto | null> {
    const [toiebaSnapshot, answersSnapshot] = await Promise.all([
      fsDb.collection('toieba').doc(toiebaId).get(),
      fsDb.collection('toieba').doc(toiebaId).collection('answers').get(),
    ]);

    const toieba = toiebaSnapshot.data();
    const answerCount = answersSnapshot.docs.reduce((old, current: any) => {
      const { choiceId } = current.data();
      old[choiceId] = old[choiceId] + 1 || 1;
      return old;
    }, {} as any);

    if (!toieba) {
      return null;
    }

    const { choices, ...rest } = toieba;

    const result = {
      ...rest,
      count: Object.values<number>(answerCount).reduce(
        (total: number, count: number) => total + count,
        0
      ),
      choices: choices.map((choice: any) => ({
        ...choice,
        count: answerCount[choice.choiceId] ?? 0,
      })),
    } as TotalDto;

    return result;
  }
}
