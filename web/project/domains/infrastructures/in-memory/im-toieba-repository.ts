import { Toieba } from '../../models/toieba/toieba';
import { ToiebaRepository } from '../../usecases/toieba-command-usecase';

export const globalStore: { [key: string]: Toieba } = {};

export class IMToiebaRepository implements ToiebaRepository {
  constructor(public store = globalStore) {}
  async findbyId(id: string): Promise<Toieba> {
    return this.store[id];
  }

  async save(toieba: Toieba): Promise<void> {
    this.store[toieba.toiebaId] = new Toieba({
      toiebaId: toieba.toiebaId,
      choices: toieba.choices,
      theme: toieba.theme,
      creatorId: toieba.creatorId,
    });
  }
}
