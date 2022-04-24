import { NotFoundError } from '../../errors/not-found-error';
import { Answer, AnswerCreateParam } from '../models/answer/answer';
import { ToiebaRepository } from './toieba-command-usecase';

type AnswerAnswerParam = AnswerCreateParam;

export interface FindByUserIdParam {
  toiebaId: string;
  userId: string;
}

export interface AnswerRepository {
  findOneByUserId(param: FindByUserIdParam): Promise<Answer | undefined>;
  save(answer: Answer): Promise<void>;
}

interface AnswerConstructorParam {
  toiebaRepository: ToiebaRepository;
  answerRepository: AnswerRepository;
}

export class AnswerCommandUsecase {
  constructor(private readonly param: AnswerConstructorParam) {}

  async answer({ toiebaId, choiceId, userId }: AnswerAnswerParam) {
    const toieba = await this.param.toiebaRepository.findbyId(toiebaId);

    if (!toieba) {
      throw new NotFoundError('といえばが存在しません。', { toiebaId });
    }

    if (!toieba.hasChoice(choiceId)) {
      throw new NotFoundError('選択肢が存在しません。', { choiceId });
    }

    let answer = await this.param.answerRepository.findOneByUserId({
      toiebaId,
      userId,
    });

    if (answer) {
      answer.answer(choiceId);
    } else {
      answer = Answer.create({ toiebaId, choiceId, userId });
    }

    await this.param.answerRepository.save(answer);
    return { answerId: answer.answerId };
  }
}
