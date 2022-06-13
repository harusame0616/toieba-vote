import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { NJAPIToiebaApi } from '../../../api/toieba-api/next-js-api-toieba-api';
import { NJAPIUserApi } from '../../../api/user-api/next-js-api-user-api';
import Band from '../../../components/base/Band';
import BackButton from '../../../components/case/back/BackButton';
import ContentContainer from '../../../components/container/ContentContainer';
import NaviContainer from '../../../components/container/NaviContainer';
import SectionContainer from '../../../components/container/SectionContainer';
import UserEditButton from '../../../components/domain/user/UserEditButton';
import { ToiebaBriefDto } from '../../../domains/usecases/toieba-query-usecase';
import { UserDto } from '../../../domains/usecases/user-query-usecase';
import { ParameterError } from '../../../errors/parameter-error';
import { LoggedInUserContext } from '../../_app';
import style from './index.module.scss';

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

  useEffect(() => {
    setCanEditProfile(router.query.id === loggedInUser.userId);
  }, [loggedInUser.userId, router.query.id]);

  const goToProfileEdit = () => {
    router.push(`/user/${user.userId}/edit`);
  };

  const { user, answeredToiebaList } = props;
  return (
    <div className={style.container}>
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
          <div className={style.profile}>
            <div className={style.name}>
              {user.name}
              {canEditProfile ? (
                <UserEditButton onClick={goToProfileEdit} />
              ) : null}
            </div>
            <div className={style.comment}>
              {user.comment.length > 0 ? user.comment : ''}
            </div>
          </div>
        </ContentContainer>
      </SectionContainer>

      <SectionContainer>
        <Band>回答済みの「といえば」</Band>
        <ContentContainer>
          <div className={style.list}>
            {answeredToiebaList.length ? (
              answeredToiebaList.map((toieba) => (
                <div key={toieba.toiebaId}>
                  <Link
                    href={`/toieba/${toieba.toiebaId}/answer?answerUserId=${props.userId}`}
                  >
                    <a>{toieba.theme} といえば</a>
                  </Link>
                </div>
              ))
            ) : (
              <div>まだ回答していません。</div>
            )}
          </div>
        </ContentContainer>
      </SectionContainer>
    </div>
  );
};

export default UserPage;
