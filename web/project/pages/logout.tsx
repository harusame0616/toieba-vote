import Head from 'next/head';
import { useContext, useEffect } from 'react';
import { AuthContext } from './_app';

const Logout = () => {
  const useAuth = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      if (useAuth) {
        await useAuth.logout();
      }
      location.href = '/';
    })();
  }, []);

  return (
    <div>
      <Head>
        <title>ログアウト - 連想投稿SNS！といえばボート</title>
        <meta name="robots" content="noindex" key="robots" />
      </Head>
    </div>
  );
};

export default Logout;
