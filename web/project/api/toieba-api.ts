import {
  ToiebaDto,
  ChoiceDto,
  ToiebaBriefDto,
} from '../domains/usecases/toieba-query-usecase';

export type NoSavedChoice = Omit<ChoiceDto, 'choiceId'>;

export interface ToiebaCreateApiParam {
  theme: string;
  choices: NoSavedChoice[];
}
export interface ToiebaAnswerApiParam {
  toiebaId: string;
  choiceId: string;
}

export interface ToiebaGetAnsweredApiParam {
  userId: string;
  cursor?: string;
}

export interface ToiebaApi {
  create(param: ToiebaCreateApiParam): Promise<{ toiebaId: string }>;
  answer(param: ToiebaAnswerApiParam): Promise<{ answerId: string }>;
  getDetail(param: { id: string }): Promise<ToiebaDto>;
  getLatest(cursor?: string): Promise<ToiebaBriefDto[]>;
  getPopular(cursor?: string): Promise<ToiebaBriefDto[]>;
  getAnswered(param: ToiebaGetAnsweredApiParam): Promise<ToiebaBriefDto[]>;
}
