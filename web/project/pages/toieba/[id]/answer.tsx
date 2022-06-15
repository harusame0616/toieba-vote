import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useContext } from 'react';
import { NJAPIToiebaApi } from '../../../api/toieba-api/next-js-api-toieba-api';
import Button from '../../../components/base/Button';
import SelectGroup from '../../../components/base/SelectGroup';
import SelectItem from '../../../components/base/SelectItem';
import BackButton from '../../../components/case/back/BackButton';
import ContantContainer from '../../../components/container/ContentContainer';
import NaviContainer from '../../../components/container/NaviContainer';
import SectionContainer from '../../../components/container/SectionContainer';
import ServiceMeta from '../../../components/domain/service/ServiceMeta';
import ToiebaBand from '../../../components/domain/toieba/ToiebaBand';
import { ToiebaDto } from '../../../domains/usecases/toieba-query-usecase';
import { ParameterError } from '../../../errors/parameter-error';
import useToiebaAnswer from '../../../hooks/toieba/use-toieba-answer';
import useProcessing from '../../../hooks/use-processing';
import { LoggedInUserContext } from '../../_app';

const api = new NJAPIToiebaApi();
interface QueryParam extends ParsedUrlQuery {
  id: string;
  answerUserId: string;
}

interface ServerSideProps {
  toieba: ToiebaDto;
  answerUserId: string | null;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideProps,
  QueryParam
> = async ({ params, query }) => {
  const id = params!.id;

  if (query.answerUserId && typeof query.answerUserId !== 'string') {
    throw new ParameterError();
  }

  const toieba = await api.getDetail({ id });
  return { props: { answerUserId: query.answerUserId ?? null, toieba } };
};

const ToiebaAnswer: NextPage<ServerSideProps> = (prop) => {
  const loggedInUser = useContext(LoggedInUserContext);

  const toieba = prop.toieba;
  const { answer } = useToiebaAnswer({ toiebaId: toieba.toiebaId });
  const router = useRouter();
  const { isProcessing, startProcessing } = useProcessing();

  const answerHandler = async (choiceId: string) => {
    await startProcessing(async () => {
      if (!loggedInUser.userId) {
        router.push(`/auth?to=${encodeURIComponent(router.asPath)}`);
        return;
      }
      await answer(choiceId);
      goToTotal();
    });
  };

  const goToTotal = () => {
    router.push(
      `/toieba/${toieba.toiebaId}/total` +
        (prop.answerUserId ? `?answerUserId=${prop.answerUserId}` : '')
    );
  };

  return (
    <div>
      <Head>
        <title>
          {' '}
          {toieba.theme}といえばの投票 - 連想投稿SNS！といえばボート{' '}
        </title>
        <ServiceMeta
          ogUrl={`/toieba/${toieba.toiebaId}/answer?answerUserId=${prop.answerUserId}`}
          ogTitle={toieba.theme + ' といえばあなたは何を連想する？'}
        />
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
                disabled={isProcessing}
              >
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </ContantContainer>
        <NaviContainer>
          <Button text color="black" onClick={() => goToTotal()}>
            回答せずに集計結果をみる <FontAwesomeIcon icon={faCaretRight} />
            <FontAwesomeIcon
              icon={faCaretRight}
              style={{ marginLeft: '-4px' }}
            />{' '}
          </Button>
        </NaviContainer>
      </SectionContainer>
    </div>
  );
};

export default ToiebaAnswer;
