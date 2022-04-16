import { ToiebaCommandUsecaseService } from '../application-services/toieba-application-services';
import { Choice } from '../models/toieba/choice';
import { Toieba } from '../models/toieba/toieba';
import crypto from 'crypto';

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
  private readonly _toiebaRepository: any;
  private readonly _toiebaApplicationService;
  constructor(toiebaRepository: any) {
    this._toiebaRepository = toiebaRepository;
    this._toiebaApplicationService = new ToiebaCommandUsecaseService(
      toiebaRepository
    );
  }

  async create(param: ToiebaCreateParam) {
    const toieba = new Toieba({
      ...param,
      toiebaId: crypto.randomUUID(),
      choices: param.choices?.map((newChoiceParam) =>
        Choice.create(newChoiceParam)
      ),
    });

    await this._toiebaApplicationService.canCreate(toieba);
    await this._toiebaRepository.save(toieba);
    return { toiebaId: toieba.toiebaId };
  }
}
