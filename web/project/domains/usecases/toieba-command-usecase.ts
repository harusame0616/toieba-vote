import crypto from 'crypto';
import { AlreadyExistsError } from '../../errors/already-exists-error';
import { Choice } from '../models/toieba/choice';
import { Toieba } from '../models/toieba/toieba';

interface ToiebaCommandUsecaseConstructorParam {
  toiebaRepository: ToiebaRepository;
}

interface ToiebaCreateParam {
  theme: string;
  choices: { label: string; index: number }[];
  creatorId: string;
}

export interface ToiebaRepository {
  findbyId(id: string): Promise<Toieba | undefined>;
  save(toieba: Toieba): Promise<void>;
}

export class ToiebaCommandUsecase {
  constructor(private readonly param: ToiebaCommandUsecaseConstructorParam) {}

  async create(param: ToiebaCreateParam) {
    const toieba = new Toieba({
      ...param,
      toiebaId: crypto.randomUUID(),
      choices: param.choices?.map((newChoiceParam) =>
        Choice.create(newChoiceParam)
      ),
    });

    const duplicationToieba = await this.param.toiebaRepository.findbyId(
      toieba.toiebaId
    );
    if (duplicationToieba) {
      throw new AlreadyExistsError('といえばは既に存在しています。', {
        toieba,
      });
    }

    await this.param.toiebaRepository.save(toieba);
    return { toiebaId: toieba.toiebaId };
  }
}
