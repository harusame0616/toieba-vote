import { faClock, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, CircularProgress, Slide, Tab, Tabs } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { NJAPIToiebaApi } from '../api/toieba-api/next-js-api-toieba-api';
import Band from '../components/base/Band';
import SecondaryButton from '../components/case/secondary/SecondaryButton';
import ContentContainer from '../components/container/ContentContainer';
import NaviContainer from '../components/container/NaviContainer';
import SectionContainer from '../components/container/SectionContainer';
import ToiebaListItem from '../components/domain/toieba/ToiebaListItem';
import { ToiebaBriefDto } from '../domains/usecases/toieba-query-usecase';
import useProcessing from '../hooks/use-processing';
import style from './index.module.scss';

interface ServerSideProps {
  latest: ToiebaBriefDto[];
}

const api = new NJAPIToiebaApi();
export const getServerSideProps: GetServerSideProps<
  ServerSideProps
> = async () => {
  const [latest] = await Promise.all([api.getLatest()]);

  return {
    props: {
      latest,
    },
  };
};

const Home: NextPage<ServerSideProps> = (props) => {
  const router = useRouter();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [toiebaList, setToiebaList] = useState(props.latest);
  const [isLast, setIsLast] = useState(props.latest.length < 5);
  const { isProcessing, startProcessing } = useProcessing();

  const toiebaApi = new NJAPIToiebaApi();
  const menu = [
    {
      label: '新着',
      api: toiebaApi.getLatest,
      icon: <FontAwesomeIcon icon={faClock} />,
    },
    {
      label: '人気',
      api: toiebaApi.getPopular,
      icon: <FontAwesomeIcon icon={faTrophy} />,
    },
  ];

  const changeTab = async (newTabIndex: number) => {
    setCurrentTabIndex(newTabIndex);
    setIsLast(false);

    const api = menu.map(({ api }) => api)[newTabIndex];

    setToiebaList([]);
    await startProcessing(async () => {
      const list = await api();
      setToiebaList(list);
      setIsLast(list.length < 5);
    });
  };

  const nextPage = async () => {
    const api = menu.map(({ api }) => api)[currentTabIndex];

    await startProcessing(async () => {
      const nextList = await api(toiebaList.slice(-1)?.[0]?.toiebaId);
      setToiebaList([...toiebaList, ...nextList]);
      setIsLast(nextList.length < 5);
    });
  };

  const goToToieba = (id: string) => {
    router.push(`/toieba/${id}/answer`);
  };

  return (
    <div className={style.container}>
      <Tabs
        value={currentTabIndex}
        onChange={(e, newTabIndex) => changeTab(newTabIndex)}
        centered
      >
        {menu.map((item) => (
          <Tab
            label={item.label}
            key={item.label}
            icon={item.icon}
            disabled={isProcessing}
          />
        ))}
      </Tabs>
      <SectionContainer key={menu[currentTabIndex].label}>
        <Band key={menu[currentTabIndex].label}>
          {menu[currentTabIndex].label}
        </Band>
        <ContentContainer>
          <div className={style['item-wrap']}>
            {toiebaList.map((toieba) => (
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
        <NaviContainer>
          <SecondaryButton
            disabled={isLast || isProcessing}
            fullWidth
            onClick={() => nextPage()}
          >
            {isProcessing ? (
              <CircularProgress />
            ) : (
              <div>{isLast ? '最後に到達しました' : 'もっと見る'}</div>
            )}
          </SecondaryButton>
        </NaviContainer>
      </SectionContainer>
    </div>
  );
};

export default Home;
