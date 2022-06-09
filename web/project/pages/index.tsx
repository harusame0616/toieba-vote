import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';
import Link from 'next/link';
import { NJAPIToiebaApi } from '../api/toieba-api/next-js-api-toieba-api';
import ServiceLogo from '../components/domain/service/ServiceLogo';
import { ToiebaBriefDto } from '../domains/usecases/toieba-query-usecase';
import {
  isServerSideErrorProps,
  ServerSideErrorProps,
} from '../errors/server-side-error';
import style from './index.module.scss';

interface ServerSideSuccessProps {
  latest: ToiebaBriefDto[];
  popular: ToiebaBriefDto[];
}
type ServerSideProps = ServerSideSuccessProps | ServerSideErrorProps;

const api = new NJAPIToiebaApi();
export const getServerSideProps: GetServerSideProps<
  ServerSideProps
> = async () => {
  const [latest, popular] = await Promise.all([
    api.getLatest(),
    api.getPopular(),
  ]);

  return {
    props: {
      latest,
      popular,
    },
  };
};

const Home: NextPage<ServerSideProps> = (props) => {
  if (isServerSideErrorProps(props)) {
    return <Error statusCode={props.error.status} />;
  }

  const menu = [
    {
      label: '新着の質問',
      list: props.latest,
    },
    {
      label: '人気の質問',
      list: props.popular,
    },
  ];

  return (
    <div className={style.container}>
      <h1 className={style.logo}>
        <ServiceLogo />
      </h1>
      <div>
        {menu.map((item) => (
          <div className={style.menu} key={item.label}>
            <h2 className={style['menu-label']}>{item.label}</h2>
            {item.list.map((toieba) => (
              <div key={toieba.toiebaId}>
                <Link href={`/toieba/${toieba.toiebaId}/answer`}>
                  <a>{toieba.theme} といえば</a>
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
