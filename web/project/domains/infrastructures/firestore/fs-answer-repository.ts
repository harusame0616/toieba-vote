import admin from 'firebase-admin';
import '../../../api/firebase';
import { NotFoundError } from '../../../errors/not-found-error';
import { Answer } from '../../models/answer/answer';
import {
  AnswerRepository,
  FindByUserIdParam,
} from '../../usecases/answer-command-usecase';

interface FSAnswerDto {
  toiebaId: string;
  answerId: string;
  choiceId: string;
  userId: string;
}

const toDomain = (dto: FSAnswerDto) => {
  return new Answer({
    toiebaId: dto.toiebaId,
    answerId: dto.answerId,
    choiceId: dto.choiceId,
    userId: dto.userId,
  });
};

export const fsDb = admin.app('toieba').firestore();
export class FSAnswerRepository implements AnswerRepository {
  async findOneByUserId({
    toiebaId,
    userId,
  }: FindByUserIdParam): Promise<Answer | undefined> {
    const snapshot = await fsDb
      .collection('toieba')
      .doc(toiebaId)
      .collection('answers')
      .where('userId', '==', userId)
      .get();

    if (!snapshot.size) {
      return undefined;
    }
    return toDomain(snapshot.docs[0].data() as FSAnswerDto);
  }

  async save(answer: Answer): Promise<void> {
    await fsDb.runTransaction(async (transaction) => {
      const toiebaDoc = fsDb.collection('toieba').doc(answer.toiebaId);
      const answerDoc = toiebaDoc.collection('answers').doc(answer.answerId);

      const answerSnapShot = await answerDoc.get();
      if (!answerSnapShot.exists) {
        const toiebaSnapShot = await transaction.get(toiebaDoc);
        const toiebaDto = toiebaSnapShot.data();
        if (!toiebaDto) {
          throw new NotFoundError('といえばが見つかりません。', answer);
        }

        transaction.update(toiebaDoc, {
          voteCount: (toiebaDto.voteCount as number) + 1,
        });
      }

      answerDoc.set({
        toiebaId: answer.toiebaId,
        answerId: answer.answerId,
        choiceId: answer.choiceId,
        userId: answer.userId,
      });
    });
  }
}
