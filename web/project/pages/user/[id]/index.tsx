import { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { NJAPIToiebaApi } from '../../../api/toieba-api/next-js-api-toieba-api';
import { NJAPIUserApi } from '../../../api/user-api/next-js-api-user-api';
import Band from '../../../components/base/Band';
import UserEditButton from '../../../components/domain/user/UserEditButton';
import { ToiebaBriefDto } from '../../../domains/usecases/toieba-query-usecase';
import { UserDto } from '../../../domains/usecases/user-query-usecase';
import {
  isServerSideErrorProps,
  ServerSideErrorProps,
} from '../../../errors/server-side-error';
import { LoggedInUserContext } from '../../_app';
import style from './index.module.scss';

interface ServerSideSuccessProps {
  user: UserDto;
  answeredToiebaList: ToiebaBriefDto[];
}
type ServerSideProps = ServerSideSuccessProps | ServerSideErrorProps;

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  query,
}) => {
  const userId = query.id;
  const userApi = new NJAPIUserApi();
  const toiebaApi = new NJAPIToiebaApi();

  if (!userId || typeof userId != 'string') {
    return {
      props: {
        error: {
          status: 400,
          message: 'userId',
        },
      },
    };
  }

  const [user, answeredToiebaList] = await Promise.all([
    userApi.getUser({ userId }),
    toiebaApi.getAnswered({ userId }),
  ]);

  return {
    props: {
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

  if (isServerSideErrorProps(props)) {
    return <Error statusCode={props.error.status} />;
  }

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
      <div className={style.profile}>
        <div className={style.name}>
          {user.name}
          {canEditProfile ? <UserEditButton onClick={goToProfileEdit} /> : null}
        </div>
        <div className={style.comment}>{user.comment}</div>
      </div>
      <Band>回答済みの「といえば」</Band>

      <div className={style.list}>
        {answeredToiebaList.length ? (
          answeredToiebaList.map((toieba) => (
            <div key={toieba.toiebaId}>
              <Link href={`/toieba/${toieba.toiebaId}/answer`}>
                <a>{toieba.theme} といえば</a>
              </Link>
            </div>
          ))
        ) : (
          <div>まだ回答していません。</div>
        )}
      </div>

      <button onClick={() => router.back()}>戻る</button>
    </div>
  );
};

export default UserPage;
