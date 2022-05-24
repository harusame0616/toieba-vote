export interface ToiebaDto {
  toiebaId: string;
  theme: string;
  choices: ChoiceDto[];
}

export interface ChoiceDto {
  choiceId: string;
  label: string;
}

export interface ToiebaBriefDto {
  toiebaId: string;
  theme: string;
}

export interface ToiebaQuery {
  getDetail(toiebaId: string): Promise<ToiebaDto>;
  latestList(count: number): Promise<ToiebaBriefDto[]>;
  popularList(count: number): Promise<ToiebaBriefDto[]>;
}

interface ToiebaQueryUsecaseConstructorParam {
  toiebaQuery: ToiebaQuery;
}

export class ToiebaQueryUsecase {
  constructor(private readonly param: ToiebaQueryUsecaseConstructorParam) {}

  async getDetail(id: string) {
    return await this.param.toiebaQuery.getDetail(id);
  }

  async latestList(count: number) {
    return await this.param.toiebaQuery.latestList(count);
  }

  async popularList(count: number) {
    return await this.param.toiebaQuery.popularList(count);
  }
}
