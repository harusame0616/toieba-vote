import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import { UserProfile } from '../../../api/user-api';
import { NJAPIUserApi } from '../../../api/user-api/next-js-api-user-api';
import Band from '../../../components/base/Band';
import BackButton from '../../../components/case/back/BackButton';
import PrimaryButton from '../../../components/case/primary/PrimaryButton';
import ContentContainer from '../../../components/container/ContentContainer';
import NaviContainer from '../../../components/container/NaviContainer';
import SectionContainer from '../../../components/container/SectionContainer';
import UserEditForm from '../../../components/domain/user/UserEditForm';
import style from './edit.module.scss';

interface ServerSideProps {
  userId: string;
  currentProfile: UserProfile;
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideProps,
  Params
> = async ({ params }) => {
  const userApi = new NJAPIUserApi();
  const userId = params!.id;
  const currentProfile = await userApi.getUserByUserId(userId);

  return {
    props: {
      userId,
      currentProfile,
    },
  };
};

const UserEdit: NextPage<ServerSideProps> = ({ userId, currentProfile }) => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const update = async (profile: UserProfile) => {
    setIsLoading(true);
    const userApi = new NJAPIUserApi();

    await userApi.editProfile(userId, profile);

    goBack();
  };

  const goBack = () => {
    setIsLoading(true);
    push(`/user/${userId}`);
  };

  return (
    <div className={style.container}>
      <Head>
        <title>プロフィール編集 - 連想投稿SNS！といえばボート</title>
        <meta name="robots" content="noindex" key="robots" />
      </Head>
      <SectionContainer>
        <Band>プロフィール編集</Band>
        <NaviContainer>
          <BackButton onClick={() => goBack()} />
        </NaviContainer>
        <ContentContainer>
          <UserEditForm
            defaultProfile={currentProfile}
            isLoading={isLoading}
            onSubmit={(event, profile) => {
              update(profile);
              event.preventDefault();
            }}
          >
            <div className={style.action}>
              <PrimaryButton type="submit" disabled={isLoading}>
                プロフィールを更新する
              </PrimaryButton>
            </div>
          </UserEditForm>
        </ContentContainer>
      </SectionContainer>
    </div>
  );
};

export default UserEdit;
