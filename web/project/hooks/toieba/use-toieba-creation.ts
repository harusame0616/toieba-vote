import { useState } from 'react';
import { ToiebaApi } from '../../api/toieba-api';
import { NJAPIToiebaApi } from '../../api/toieba-api/next-js-api-toieba-api';
import { Choice } from '../../domains/models/toieba/choice';
import { Toieba } from '../../domains/models/toieba/toieba';

interface UnregisteredChoice {
  index: number;
  label: string;
}

const useToiebaCreation = ({
  toiebaApi = new NJAPIToiebaApi() as ToiebaApi,
} = {}) => {
  const [theme, _setTheme] = useState('');
  const [_choices, setChoices] = useState<UnregisteredChoice[]>([]);

  const sortedChoices = _choices.sort((a, b) => a.index - b.index);

  const setTheme = (theme: string) => {
    if (theme.length < Toieba.THEME_MIN_LENGTH) {
      throw Error(
        `テーマは${Toieba.THEME_MIN_LENGTH}文字以上で入力してください。`
      );
    }
    if (theme.length > Toieba.THEME_MAX_LENGTH) {
      throw Error(
        `テーマは${Toieba.THEME_MAX_LENGTH}文字以下で入力してください。`
      );
    }

    _setTheme(theme);
  };

  const addChoice = (label: string) => {
    if (_choices.length >= Toieba.CHOICE_MAX_NUMBER) {
      throw new Error('選択肢は10個までです。');
    }

    if (label.length < Choice.LABEL_MIN_LENGTH) {
      throw new Error('選択肢を入力してください。');
    }

    if (label.length > Choice.LABEL_MAX_LENGTH) {
      throw new Error(
        `選択肢は${Choice.LABEL_MAX_LENGTH}文字以下で入力してください。`
      );
    }

    if (_choices.map(({ label }) => label).includes(label)) {
      throw new Error('選択肢が重複しています。');
    }

    setChoices([
      ..._choices,
      { label, index: Math.max(-1, ..._choices.map(({ index }) => index)) + 1 },
    ]);
  };

  const deleteChoice = (index: number) => {
    if (!sortedChoices[index]) {
      throw new Error('範囲外です。');
    }
    const newChoices = [...sortedChoices];

    newChoices.splice(index, 1);
    newChoices.forEach((choice, index) => (choice.index = index));
    setChoices(newChoices);
  };

  const swapChoiceOrder = (fromIndex: number, toIndex: number) => {
    const choiceFrom = sortedChoices[fromIndex];
    const choiceTo = sortedChoices[toIndex];

    if (!choiceFrom || !choiceTo) {
      throw new Error('範囲外です。');
    }

    choiceFrom.index = toIndex;
    choiceTo.index = fromIndex;
    setChoices([...sortedChoices]);
  };

  const save = async () => {
    return await toiebaApi.create({ theme, choices: _choices });
  };

  const canAddChoice = _choices.length < Toieba.CHOICE_MAX_NUMBER;

  return {
    theme,
    setTheme,
    choices: sortedChoices,
    addChoice,
    deleteChoice,
    swapChoiceOrder,
    save,
    canAddChoice,
  };
};

export default useToiebaCreation;
