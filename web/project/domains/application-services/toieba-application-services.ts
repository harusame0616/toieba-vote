import { AlreadyExistsError } from '../../errors/already-exists-error';
import { Toieba } from '../models/toieba/toieba';
import { ToiebaRepository } from '../usecases/toieba-command-usecase';

export class ToiebaCommandUsecaseService {
  private readonly _toiebaRepository;
  constructor(toiebaRepository: ToiebaRepository) {
    this._toiebaRepository = toiebaRepository;
  }

  async canCreate(newToieba: Toieba) {
    console.log('before');
    const toieba = await this._toiebaRepository.findbyId(newToieba.toiebaId);
    console.log('after');
    if (toieba) {
      throw new AlreadyExistsError('といえばは既に存在しています。', {
        toieba,
      });
    }

    return true;
  }
}
