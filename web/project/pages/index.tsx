import { faClock, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tab, Tabs } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { NJAPIToiebaApi } from '../api/toieba-api/next-js-api-toieba-api';
import Band from '../components/base/Band';
import ContentContainer from '../components/container/ContentContainer';
import SectionContainer from '../components/container/SectionContainer';
import ToiebaListItem from '../components/domain/toieba/ToiebaListItem';
import { ToiebaBriefDto } from '../domains/usecases/toieba-query-usecase';
import style from './index.module.scss';

interface ServerSideProps {
  latest: ToiebaBriefDto[];
  popular: ToiebaBriefDto[];
}

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
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const menu = [
    {
      label: '新着',
      list: props.latest,
      icon: <FontAwesomeIcon icon={faClock} />,
    },
    {
      label: '人気',
      list: props.popular,
      icon: <FontAwesomeIcon icon={faTrophy} />,
    },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentIndex(newValue);
  };

  const goToToieba = (id: string) => {
    router.push(`/toieba/${id}/answer`);
  };

  return (
    <div className={style.container}>
      <Tabs value={currentIndex} onChange={handleChange} centered>
        {menu.map((item) => (
          <Tab label={item.label} key={item.label} icon={item.icon} />
        ))}
      </Tabs>
      <SectionContainer key={menu[currentIndex].label}>
        <Band key={menu[currentIndex].label}>{menu[currentIndex].label}</Band>
        <ContentContainer>
          <div className={style['item-wrap']}>
            {menu[currentIndex].list.map((toieba) => (
              <Button
                key={toieba.toiebaId}
                className={style['item']}
                onClick={() => {
                  goToToieba(toieba.toiebaId);
                }}
              >
                <ToiebaListItem toieba={toieba} />
              </Button>
            ))}
          </div>
        </ContentContainer>
      </SectionContainer>
    </div>
  );
};

export default Home;
