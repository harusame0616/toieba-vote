import type { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';
import Link from 'next/link';
import { NJAPIToiebaApi } from '../api/toieba-api/next-js-api-toieba-api';
import Band from '../components/base/Band';
import ContentContainer from '../components/container/ContentContainer';
import SectionContainer from '../components/container/SectionContainer';
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
      label: '新着のといえば',
      list: props.latest,
    },
    {
      label: '人気のといえば',
      list: props.popular,
    },
  ];

  return (
    <div className={style.container}>
      <SectionContainer>
        <ContentContainer>
          <h1 className={style.logo}>
            <ServiceLogo />
          </h1>
        </ContentContainer>
      </SectionContainer>
      {menu.map((item) => (
        <SectionContainer key={item.label}>
          <Band key={item.label}>{item.label}</Band>
          <ContentContainer>
            {item.list.map((toieba) => (
              <div className={style['item']} key={toieba.toiebaId}>
                <Link href={`/toieba/${toieba.toiebaId}/answer`}>
                  <a>{toieba.theme} といえば</a>
                </Link>
              </div>
            ))}
          </ContentContainer>
        </SectionContainer>
      ))}
    </div>
  );
};

export default Home;
