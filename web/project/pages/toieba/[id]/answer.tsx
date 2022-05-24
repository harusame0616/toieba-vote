import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { NJAPIToiebaApi } from '../../../api/toieba-api/next-js-api-toieba-api';
import SelectGroup from '../../../components/base/SelectGroup';
import SelectItem from '../../../components/base/SelectItem';
import ToiebaBand from '../../../components/domain/ToiebaBand';
import { ToiebaDto } from '../../../domains/usecases/toieba-query-usecase';
import {
  isServerSideErrorProps,
  ServerSideErrorProps,
  toServerSideError,
} from '../../../errors/server-side-error';
import useToiebaAnswer from '../../../hooks/toieba/use-toieba-answer';
import style from './answer.module.scss';

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
  if (isServerSideErrorProps(prop)) {
    // ToDo: ServerSideError時の処理
    throw <Error statusCode={prop.error.status} />;
  }

  const toieba = prop.toieba;
  const { answer } = useToiebaAnswer({ toiebaId: toieba.toiebaId });
  const router = useRouter();
  const answerHandler = async (choiceId: string) => {
    await answer(choiceId);
    router.push(`/toieba/${toieba.toiebaId}/total`);
  };

  return (
    <div className={style.container}>
      <ToiebaBand>{toieba?.theme}</ToiebaBand>
      <div className={style.choices}>
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
      </div>
    </div>
  );
};

export default ToiebaAnswer;
