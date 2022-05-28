import { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';
import { ParsedUrlQuery } from 'querystring';
import { TotalDto } from '../../../api/answer-api';
import { NJAPIAnswerApi } from '../../../api/toieba-api/next-js-api-answer-api';
import SelectGroup from '../../../components/base/SelectGroup';
import SelectItem from '../../../components/base/SelectItem';
import ToiebaBand from '../../../components/domain/ToiebaBand';
import {
  isServerSideErrorProps,
  ServerSideErrorProps,
  toServerSideError,
} from '../../../errors/server-side-error';
import style from './total.module.scss';

type ServerSideProps = ServerSideSuccessProps | ServerSideErrorProps;

interface ServerSideSuccessProps {
  total: TotalDto;
}

interface QueryParam extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideProps,
  QueryParam
> = async ({ query: { id } }) => {
  const api = new NJAPIAnswerApi();
  let total;
  try {
    total = await api.getTotal({ toiebaId: id as string });
  } catch (error: any) {
    return {
      props: {
        error: toServerSideError(error),
      },
    };
  }

  return {
    props: {
      total,
    },
  };
};

const ToiebaTotal: NextPage<ServerSideProps> = (prop) => {
  if (isServerSideErrorProps(prop)) {
    return <Error statusCode={prop.error.status} />;
  }

  const { theme, choices, count: totalCount } = prop.total;

  return (
    <div className={style.container}>
      <ToiebaBand>{theme}</ToiebaBand>
      <div className={style.choices}>
        <SelectGroup>
          {choices.map((choice: any, index: number) => (
            <SelectItem index={index} key={choice.choiceId}>
              <div className={style.label}>
                <div className={style.text}>{choice.label} </div>
                <div className={style.info}>
                  {Math.floor((choice.count / totalCount) * 1000) / 10}%
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </div>
    </div>
  );
};

export default ToiebaTotal;
