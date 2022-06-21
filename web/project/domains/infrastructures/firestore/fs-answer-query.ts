import admin from 'firebase-admin';
import '../../../api/firebase';
import {
  AnswerDto,
  AnswerQuery,
  GetAnswerOfToiebaByUserId,
  TotalDto,
  TotalParam,
} from '../../usecases/answer-query-usecase';

export const fsDb = admin.app('toieba').firestore();
export class FSAnswerQuery implements AnswerQuery {
  async getAnswerOfToiebaByUserId(
    param: GetAnswerOfToiebaByUserId
  ): Promise<AnswerDto | null> {
    const [answersSnapshot, toiebaSnapshot, userSnapshot] = await Promise.all([
      fsDb
        .collection('answers')
        .where('toiebaId', '==', param.toiebaId)
        .where('userId', '==', param.answerUserId)
        .get(),
      fsDb.collection('toieba').doc(param.toiebaId).get(),
      fsDb.collection('users').doc(param.answerUserId).get(),
    ]);

    if (!answersSnapshot.size || !toiebaSnapshot.exists) {
      return null;
    }

    const answer = answersSnapshot.docs[0].data();

    const choiceLabel =
      toiebaSnapshot
        .data()
        ?.choices?.find?.(({ choiceId }: any) => choiceId === answer.choiceId)
        ?.label ?? null;
    return {
      ...answer,
      choiceLabel,
      userName: userSnapshot.data()?.name ?? null,
    } as any;
  }

  async total({ toiebaId }: TotalParam): Promise<TotalDto | null> {
    const [toiebaSnapshot, answersSnapshot] = await Promise.all([
      fsDb.collection('toieba').doc(toiebaId).get(),
      fsDb.collection('answers').where('toiebaId', '==', toiebaId).get(),
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
