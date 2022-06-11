import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { UserProfile } from '../../api/user-api';
import { NJAPIUserApi } from '../../api/user-api/next-js-api-user-api';
import Band from '../../components/base/Band';
import PrimaryButton from '../../components/case/primary/PrimaryButton';
import UserEditForm from '../../components/domain/user/UserEditForm';
import { ParameterError } from '../../errors/parameter-error';
import style from './create.module.scss';

interface ServerSideProps {
  defaultProfile: UserProfile;
  to: string;
  authenticationId: string;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  query,
}) => {
  if (
    typeof query.authenticationId !== 'string' ||
    (query.to != null && typeof query.to !== 'string') ||
    (query.name != null && typeof query.name !== 'string')
  ) {
    throw new ParameterError(undefined, query);
  }

  return {
    props: {
      to: query.to?.length ? query.to : encodeURIComponent('/'),
      authenticationId: query.authenticationId,
      defaultProfile: {
        name: query.name ?? '',
        comment: '',
      },
    },
  };
};

const CreateUser: NextPage<ServerSideProps> = (param) => {
  const [isLoading, setIsLoading] = useState(false);

  const create = async (profile: UserProfile) => {
    const userApi = new NJAPIUserApi();
    setIsLoading(true);
    try {
      await userApi.createUser(profile, param.authenticationId);
    } finally {
      setIsLoading(false);
    }

    location.href = decodeURIComponent(param.to);
  };

  return (
    <div className={style.container}>
      <Head>
        <title>プロフィール登録 - 連想投稿SNS！といえばボート</title>
        <meta name="robots" content="noindex" key="robots" />
      </Head>
      <Band>プロフィール登録</Band>
      <div className={style['form-wrap']}>
        <UserEditForm
          defaultProfile={param.defaultProfile}
          isLoading={isLoading}
          onSubmit={async (e, userProfile) => {
            await create(userProfile);
            e.preventDefault();
          }}
        >
          <div className={style.action}>
            <PrimaryButton
              type="submit"
              className={style['register-button']}
              disabled={isLoading}
            >
              登録する
            </PrimaryButton>
          </div>
        </UserEditForm>
      </div>
    </div>
  );
};

export default CreateUser;
