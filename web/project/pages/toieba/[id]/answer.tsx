import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useContext } from 'react';
import { NJAPIToiebaApi } from '../../../api/toieba-api/next-js-api-toieba-api';
import SelectGroup from '../../../components/base/SelectGroup';
import SelectItem from '../../../components/base/SelectItem';
import ToiebaBand from '../../../components/domain/toieba/ToiebaBand';
import { ToiebaDto } from '../../../domains/usecases/toieba-query-usecase';
import Head from 'next/head';
import {
  isServerSideErrorProps,
  ServerSideErrorProps,
  toServerSideError,
} from '../../../errors/server-side-error';
import useToiebaAnswer from '../../../hooks/toieba/use-toieba-answer';
import { LoggedInUserContext } from '../../_app';
import style from './answer.module.scss';
import ContantContainer from '../../../components/container/ContentContainer';
import SectionContainer from '../../../components/container/SectionContainer';
import NaviContainer from '../../../components/container/NaviContainer';
import BackButton from '../../../components/case/back/BackButton';

const api = new NJAPIToiebaApi();
type ServerSideProps = ServerSideSuccessProps | ServerSideErrorProps;
interface QueryParam extends ParsedUrlQuery {
  id: string;
}

interface ServerSideSuccessProps {
  toieba: ToiebaDto;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideProps,
  QueryParam
> = async ({ query }) => {
  const id = query.id as string;

  let toieba;
  try {
    toieba = await api.getDetail({ id });
  } catch (error) {
    return {
      props: {
        error: toServerSideError(error),
      },
    };
  }
  return { props: { toieba } };
};

const ToiebaAnswer: NextPage<ServerSideProps> = (prop) => {
  const loggedInUser = useContext(LoggedInUserContext);

  if (isServerSideErrorProps(prop)) {
    // ToDo: ServerSideError時の処理
    throw <Error statusCode={prop.error.status} />;
  }

  const toieba = prop.toieba;
  const { answer } = useToiebaAnswer({ toiebaId: toieba.toiebaId });
  const router = useRouter();
  const answerHandler = async (choiceId: string) => {
    if (!loggedInUser.userId) {
      return router.push(`/auth?to=${encodeURIComponent(router.asPath)}`);
    }
    await answer(choiceId);
    router.push(`/toieba/${toieba.toiebaId}/total`);
  };

  return (
    <div>
      <Head>
        <title>
          {' '}
          {toieba.theme}といえばの投票 - 連想投稿SNS！といえばボート{' '}
        </title>
      </Head>
      <SectionContainer>
        <ToiebaBand>{toieba?.theme}</ToiebaBand>
        <NaviContainer>
          <BackButton onClick={() => router.back()}></BackButton>
        </NaviContainer>
        <ContantContainer>
          <SelectGroup>
            {toieba?.choices?.map?.(({ label, choiceId }, index) => (
              <SelectItem
                index={index}
                onClick={() => answerHandler(choiceId)}
                key={label}
              >
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </ContantContainer>
      </SectionContainer>
    </div>
  );
};

export default ToiebaAnswer;
