import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { UserProfile } from '../../api/user-api';
import { NJAPIUserApi } from '../../api/user-api/next-js-api-user-api';
import Band from '../../components/base/Band';
import BackButton from '../../components/case/back/BackButton';
import PrimaryButton from '../../components/case/primary/PrimaryButton';
import ContentContainer from '../../components/container/ContentContainer';
import NaviContainer from '../../components/container/NaviContainer';
import SectionContainer from '../../components/container/SectionContainer';
import UserEditForm from '../../components/domain/user/UserEditForm';
import { ParameterError } from '../../errors/parameter-error';
import useProcessing from '../../hooks/use-processing';
import { AuthContext } from '../_app';
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
  const router = useRouter();
  const auth = useContext(AuthContext);
  const { isProcessing, startProcessing } = useProcessing();

  const create = async (profile: UserProfile) => {
    await startProcessing(async () => {
      const userApi = new NJAPIUserApi();
      await userApi.createUser(profile, param.authenticationId);

      location.href = decodeURIComponent(param.to);
    });
  };

  return auth ? (
    <div>
      <Head>
        <title>プロフィール登録 - 連想投稿SNS！といえばボート</title>
        <meta name="robots" content="noindex" key="robots" />
      </Head>
      <SectionContainer>
        <Band>プロフィール登録</Band>
        <NaviContainer>
          <BackButton
            onClick={() => {
              auth.logout();
              router.push('/');
            }}
          />
        </NaviContainer>
        <ContentContainer>
          <UserEditForm
            defaultProfile={param.defaultProfile}
            isLoading={isProcessing}
            onSubmit={async (e, userProfile) => {
              e.preventDefault();
              await create(userProfile);
            }}
          >
            <div className={style.action}>
              <PrimaryButton type="submit" disabled={isProcessing}>
                登録する
              </PrimaryButton>
            </div>
          </UserEditForm>
        </ContentContainer>
      </SectionContainer>
    </div>
  ) : (
    <div />
  );
};

export default CreateUser;
