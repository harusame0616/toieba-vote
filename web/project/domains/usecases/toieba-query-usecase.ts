export interface ToiebaDto {
  toiebaId: string;
  theme: string;
  choices: ChoiceDto[];
}

export interface ChoiceDto {
  choiceId: string;
  label: string;
}

export interface ToiebaQuery {
  getDetail(toiebaId: string): Promise<ToiebaDto>;
}

interface ToiebaQueryUsecaseConstructorParam {
  toiebaQuery: ToiebaQuery;
}

export class ToiebaQueryUsecase {
  constructor(private readonly param: ToiebaQueryUsecaseConstructorParam) {}

  async getDetail(id: string) {
    return await this.param.toiebaQuery.getDetail(id);
  }
}
