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
  postedAt: string;
  commentCount: number;
  voteCount: number;
}

export interface AnsweredByUserParam {
  userId: string;
  count: number;
  cursor?: string;
}

export interface ToiebaQuery {
  getDetail(toiebaId: string): Promise<ToiebaDto>;
  latestList(count: number, cursor?: string): Promise<ToiebaBriefDto[]>;
  popularList(count: number, cursor?: string): Promise<ToiebaBriefDto[]>;
  listOfAnsweredByUser(param: AnsweredByUserParam): Promise<ToiebaBriefDto[]>;
}

interface ToiebaQueryUsecaseConstructorParam {
  toiebaQuery: ToiebaQuery;
}

export class ToiebaQueryUsecase {
  constructor(private readonly param: ToiebaQueryUsecaseConstructorParam) {}

  async getDetail(id: string) {
    return await this.param.toiebaQuery.getDetail(id);
  }

  async latestList(count: number, cursor?: string) {
    return await this.param.toiebaQuery.latestList(count, cursor);
  }

  async popularList(count: number, cursor?: string) {
    return await this.param.toiebaQuery.popularList(count, cursor);
  }

  async listOfAnsweredByUser(param: AnsweredByUserParam) {
    return await this.param.toiebaQuery.listOfAnsweredByUser(param);
  }
}
