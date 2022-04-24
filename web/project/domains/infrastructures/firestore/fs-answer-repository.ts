import admin from 'firebase-admin';
import '../../../api/firebase';
import { Answer } from '../../models/answer/answer';
import { Toieba } from '../../models/toieba/toieba';
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
    await fsDb
      .collection('toieba')
      .doc(answer.toiebaId)
      .collection('answers')
      .doc(answer.answerId)
      .set({
        toiebaId: answer.toiebaId,
        answerId: answer.answerId,
        choiceId: answer.choiceId,
        userId: answer.userId,
      });
  }
}
