import { Box, Collapse, Input, TextField } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import SelectGroup from '../../components/base/SelectGroup';
import SelectItem from '../../components/base/SelectItem';
import AddButton from '../../components/case/add/AddButton';
import BackButton from '../../components/case/back/BackButton';
import DeleteButton from '../../components/case/delete/DeleteButton';
import DownButton from '../../components/case/down/DownButton';
import ErrorMessage from '../../components/case/error/ErrorMessage';
import PrimaryButton from '../../components/case/primary/PrimaryButton';
import UpButton from '../../components/case/up/UpButton';
import ActionContainer from '../../components/container/ActionContainer';
import ContentContainer from '../../components/container/ContentContainer';
import NaviContainer from '../../components/container/NaviContainer';
import SectionContainer from '../../components/container/SectionContainer';
import ToiebaBand from '../../components/domain/toieba/ToiebaBand';
import useToiebaCreation from '../../hooks/toieba/use-toieba-creation';
import useProcessing from '../../hooks/use-processing';
import style from './create.module.scss';

const CreateTheme: NextPage = () => {
  const themeInputRef = useRef<HTMLInputElement>(null);
  const choiceInputRef = useRef<HTMLInputElement>(null);
  const [newChoiceLabel, setNewChoiceLabel] = useState('');
  const [addChoiceErrorMessage, setAddChoiceErrorMessage] = useState('');
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [themeTmp, setThemeTmp] = useState('');
  const [themeErrorMessage, setThemeErrorMessage] = useState('');
  const { isProcessing, startProcessing } = useProcessing();

  const toieba = useToiebaCreation();
  const router = useRouter();

  useEffect(() => {
    themeInputRef.current?.focus();
  }, []);

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await startProcessing(async () => {
      try {
        const { toiebaId } = await toieba.save();
        await router.push(`/toieba/${toiebaId}/answer`);
      } catch (err: any) {
        setSaveErrorMessage(err.data.message);
      }
    });
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
      <Head>
        <title>といえば投稿 - 連想投稿SNS！といえばボート</title>
        <meta name="robots" content="noindex" key="robots" />
      </Head>
      <SectionContainer>
        <ToiebaBand>
          <div className={style['theme-input']}>
            <TextField
              disabled={isProcessing}
              type="text"
              onChange={(e) => setThemeTmp(e.target.value)}
              onBlur={validateTheme}
              value={themeTmp}
              ref={themeInputRef}
              style={{ color: 'black' }}
              placeholder="例：おにぎりの具"
              variant="standard"
              fullWidth
              sx={{ background: 'white', maxWidth: '380px' }}
            />
            <ErrorMessage>{themeErrorMessage}</ErrorMessage>
          </div>
        </ToiebaBand>
        <NaviContainer>
          <BackButton onClick={() => router.back()} />
        </NaviContainer>
        <ContentContainer>
          <SelectGroup>
            選択肢
            <Box display="flex">
              <Box flexGrow={1}>
                <Input
                  ref={choiceInputRef}
                  disabled={!toieba.canAddChoice || isProcessing}
                  onChange={(e) => setNewChoiceLabel(e.target.value)}
                  value={newChoiceLabel}
                  placeholder="例：しゃけ"
                  fullWidth
                />
              </Box>
              <Box flexGrow={0} flexShrink={0} display="flex">
                <AddButton
                  disabled={!toieba.canAddChoice || isProcessing}
                  onClick={addChoiceHandler}
                />
              </Box>
            </Box>
            <ErrorMessage>{addChoiceErrorMessage}</ErrorMessage>
            <TransitionGroup>
              {toieba.choices.map(({ index, label }) => (
                <Collapse
                  in={true}
                  key={label}
                  className={style['select-item-wrap']}
                >
                  <SelectItem index={index} disabled={isProcessing}>
                    <div className={style.text}>{label}</div>
                    <div className={style.actions}>
                      <span className={style['button-wrap']}>
                        <UpButton
                          onClick={() =>
                            toieba.swapChoiceOrder(index, index - 1)
                          }
                          disabled={index == 0 || isProcessing}
                        />
                      </span>
                      <span className={style['button-wrap']}>
                        <DownButton
                          onClick={() =>
                            toieba.swapChoiceOrder(index, index + 1)
                          }
                          disabled={
                            index == toieba.choices.length - 1 || isProcessing
                          }
                        />
                      </span>
                      <span className={style['delete-wrap']}>
                        <DeleteButton
                          onClick={() => toieba.deleteChoice(index)}
                          disabled={isProcessing}
                        />
                      </span>
                    </div>
                  </SelectItem>
                </Collapse>
              ))}
            </TransitionGroup>
          </SelectGroup>

          <ActionContainer>
            <PrimaryButton type="submit" disabled={isProcessing}>
              といえばを作成する
            </PrimaryButton>
            <ErrorMessage>{saveErrorMessage}</ErrorMessage>
          </ActionContainer>
        </ContentContainer>
      </SectionContainer>
    </form>
  );
};

export default CreateTheme;
