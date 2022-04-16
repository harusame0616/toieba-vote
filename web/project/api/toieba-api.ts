interface Choice {
  id: string;
  index: number;
  label: string;
}

type NoSavedChoice = Omit<Choice, 'id'>;

export interface ToiebaCreateApiParam {
  theme: string;
  choices: NoSavedChoice[];
}

export interface ToiebaApi {
  create(param: ToiebaCreateApiParam): Promise<{ id: string }>;
}
