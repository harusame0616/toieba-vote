import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import SelectGroup from '../../components/base/SelectGroup';
import SelectItem from '../../components/base/SelectItem';
import AddButton from '../../components/case/button/AddButton';
import DeleteButton from '../../components/case/button/DeleteButton';
import DownButton from '../../components/case/button/DownButton';
import UpButton from '../../components/case/button/UpButton';
import ErrorMessage from '../../components/case/message/ErrorMessage';
import ToiebaBand from '../../components/domain/ToiebaBand';
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

  const toieba = useToiebaCreation();

  useEffect(() => {
    themeInputRef.current?.focus();
  }, []);

  return (
    <form
      className={style.container}
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await toieba.save();
        } catch (err: any) {
          setSaveErrorMessage(err.data.message);
        }
        return false;
      }}
    >
      <ToiebaBand>
        <div className={style['theme-input']}>
          <input
            type="text"
            onChange={(e) => setThemeTmp(e.target.value)}
            onBlur={() => {
              try {
                toieba.setTheme(themeTmp);
                setThemeErrorMessage('');
              } catch (err: any) {
                setThemeErrorMessage(err.message);
              }
            }}
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
              minLength={1}
              maxLength={64}
              value={newChoiceLabel}
            />
            <AddButton
              disabled={!toieba.canAddChoice}
              onClick={() => {
                choiceInputRef.current?.focus();
                try {
                  toieba.addChoice(newChoiceLabel);
                } catch (err: any) {
                  setAddChoiceErrorMessage(err.message);
                  return;
                }

                setAddChoiceErrorMessage('');
                setNewChoiceLabel('');
              }}
            />
            <div className={style['error-message']}>
              {addChoiceErrorMessage}
            </div>
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
      <button>作成</button>
      <ErrorMessage>{saveErrorMessage}</ErrorMessage>
    </form>
  );
};

export default CreateTheme;
