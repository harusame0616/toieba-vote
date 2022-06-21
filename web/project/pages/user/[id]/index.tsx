import { ThemeContext } from '@emotion/react';
import { Box, Button, CircularProgress } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { NJAPIToiebaApi } from '../../../api/toieba-api/next-js-api-toieba-api';
import { NJAPIUserApi } from '../../../api/user-api/next-js-api-user-api';
import Band from '../../../components/base/Band';
import BackButton from '../../../components/case/back/BackButton';
import SecondaryButton from '../../../components/case/secondary/SecondaryButton';
import ContentContainer from '../../../components/container/ContentContainer';
import NaviContainer from '../../../components/container/NaviContainer';
import SectionContainer from '../../../components/container/SectionContainer';
import ToiebaListItem from '../../../components/domain/toieba/ToiebaListItem';
import UserEditButton from '../../../components/domain/user/UserEditButton';
import { ToiebaBriefDto } from '../../../domains/usecases/toieba-query-usecase';
import { UserDto } from '../../../domains/usecases/user-query-usecase';
import { ParameterError } from '../../../errors/parameter-error';
import useProcessing from '../../../hooks/use-processing';
import { LoggedInUserContext } from '../../_app';

interface ServerSideProps {
  user: UserDto;
  userId: string;
  answeredToiebaList: ToiebaBriefDto[];
}
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  query,
}) => {
  const userId = query.id;
  const userApi = new NJAPIUserApi();
  const toiebaApi = new NJAPIToiebaApi();

  if (!userId || typeof userId != 'string') {
    throw new ParameterError();
  }

  const [user, answeredToiebaList] = await Promise.all([
    userApi.getUserByUserId(userId),
    toiebaApi.getAnswered({ userId }),
  ]);

  return {
    props: {
      userId,
      user,
      answeredToiebaList,
    },
  };
};

const UserPage: NextPage<ServerSideProps> = (props) => {
  const router = useRouter();
  const loggedInUser = useContext(LoggedInUserContext);
  const [canEditProfile, setCanEditProfile] = useState(false);
  const [toiebaList, setToiebaList] = useState(props.answeredToiebaList);
  const [isLast, setIsLast] = useState(props.answeredToiebaList.length < 5);
  const { isProcessing, startProcessing } = useProcessing();

  const theme: any = useContext(ThemeContext);
  useEffect(() => {
    setCanEditProfile(router.query.id === loggedInUser.userId);
  }, [loggedInUser.userId, router.query.id]);

  const goToProfileEdit = () => {
    router.push(`/user/${user.userId}/edit`);
  };

  const nextPage = async () => {
    const toiebaApi = new NJAPIToiebaApi();

    await startProcessing(async () => {
      const nextList = await toiebaApi.getAnswered({
        userId: user.userId,
        cursor: toiebaList.slice(-1)?.[0]?.toiebaId,
      });
      setToiebaList([...toiebaList, ...nextList]);
      setIsLast(nextList.length < 5);
    });
  };

  const { user, answeredToiebaList } = props;
  return (
    <div>
      <Head>
        <title>
          {user.name}さんのプロフィール - 連想投稿SNS！といえばボート
        </title>
      </Head>

      <SectionContainer>
        <Band>プロフィール</Band>
        <NaviContainer>
          <BackButton onClick={() => router.back()} />
        </NaviContainer>
        <ContentContainer>
          <Box
            display="flex"
            justifyContent="space-between"
            align-items="center"
            fontSize="2rem"
            padding-bottom="2px"
            paddingX="0.5rem"
            borderBottom={`2px solid ${theme?.palette?.primary?.main}`}
            marginBottom="20px"
            sx={{ wordBreak: 'break-all' }}
          >
            {user.name}
            {canEditProfile ? (
              <UserEditButton onClick={goToProfileEdit} />
            ) : null}
          </Box>
          <Box whiteSpace="pre-wrap" sx={{ wordBreak: 'break-all' }}>
            {user.comment.length > 0 ? user.comment : ''}
          </Box>
        </ContentContainer>
      </SectionContainer>

      <SectionContainer>
        <Band>回答済みの「といえば」</Band>
        <ContentContainer>
          {answeredToiebaList.length ? (
            toiebaList.map((toieba) => (
              <Button
                fullWidth
                key={toieba.toiebaId}
                onClick={() => {
                  router.push(
                    `/toieba/${toieba.toiebaId}/answer?answerUserId=${props.userId}`
                  );
                }}
              >
                <ToiebaListItem toieba={toieba} />
              </Button>
            ))
          ) : (
            <div>まだ回答していません。</div>
          )}
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

export default UserPage;
