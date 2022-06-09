import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import SelectGroup from '../../components/base/SelectGroup';
import SelectItem from '../../components/base/SelectItem';
import AddButton from '../../components/case/add/AddButton';
import DeleteButton from '../../components/case/delete/DeleteButton';
import DownButton from '../../components/case/down/DownButton';
import UpButton from '../../components/case/up/UpButton';
import ErrorMessage from '../../components/case/error/ErrorMessage';
import ToiebaBand from '../../components/domain/toieba/ToiebaBand';
import useToiebaCreation from '../../hooks/toieba/use-toieba-creation';
import style from './create.module.scss';

const CreateTheme: NextPage = () => {
  const themeInputRef = useRef<HTMLInputElement>(null);
  const choiceInputRef = useRef<HTMLInputElement>(null);
  const [newChoiceLabel, setNewChoiceLabel] = useState('');
  const [addChoiceErrorMessage, setAddChoiceErrorMessage] = useState('');
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [themeTmp, setThemeTmp] = useState('');
  const [themeErrorMessage, setThemeErrorMessage] = useState('');
  const [isProcessing, setProcessing] = useState(false);

  const toieba = useToiebaCreation();
  const history = useRouter();

  useEffect(() => {
    themeInputRef.current?.focus();
  }, []);

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    setProcessing(true);
    e.preventDefault();

    try {
      const { toiebaId } = await toieba.save();
      await history.push(`/toieba/${toiebaId}/answer`);
    } catch (err: any) {
      setSaveErrorMessage(err.data.message);
    }
    setProcessing(false);
  };

  const validateTheme = () => {
    try {
      toieba.setTheme(themeTmp);
      setThemeErrorMessage('');
    } catch (err: any) {
      setThemeErrorMessage(err.message);
    }
  };

  const addChoiceHandler = () => {
    choiceInputRef.current?.focus();
    try {
      toieba.addChoice(newChoiceLabel);
    } catch (err: any) {
      setAddChoiceErrorMessage(err.message);
      return;
    }

    setAddChoiceErrorMessage('');
    setNewChoiceLabel('');
  };

  return (
    <form className={style.container} onSubmit={submitHandler}>
      <ToiebaBand>
        <div className={style['theme-input']}>
          <input
            type="text"
            onChange={(e) => setThemeTmp(e.target.value)}
            onBlur={validateTheme}
            value={themeTmp}
            ref={themeInputRef}
          />
          <ErrorMessage>{themeErrorMessage}</ErrorMessage>
        </div>
      </ToiebaBand>
      <div className={style.choices}>
        <SelectGroup>
          <div className={style['choice-input']}>
            <input
              ref={choiceInputRef}
              disabled={!toieba.canAddChoice}
              onChange={(e) => setNewChoiceLabel(e.target.value)}
              value={newChoiceLabel}
            />
            <AddButton
              disabled={!toieba.canAddChoice}
              onClick={addChoiceHandler}
            />
            <ErrorMessage>{addChoiceErrorMessage}</ErrorMessage>
          </div>

          {toieba.choices.map(({ index, label }) => (
            <SelectItem key={label} index={index}>
              <div className={style.text}>{label}</div>
              <div className={style.actions}>
                <span className={style['button-wrap']}>
                  <UpButton
                    onClick={() => toieba.swapChoiceOrder(index, index - 1)}
                    disabled={index == 0}
                  />
                </span>
                <span className={style['button-wrap']}>
                  <DownButton
                    onClick={() => toieba.swapChoiceOrder(index, index + 1)}
                    disabled={index == toieba.choices.length - 1}
                  />
                </span>
                <span className={style['delete-wrap']}>
                  <DeleteButton onClick={() => toieba.deleteChoice(index)} />
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </div>
      <button disabled={isProcessing}>作成</button>
      <ErrorMessage>{saveErrorMessage}</ErrorMessage>
    </form>
  );
};

export default CreateTheme;
