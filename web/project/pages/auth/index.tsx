import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import LoginCard from '../../components/case/card/LoginCard';
import { AuthContext } from '../_app';
import style from './index.module.scss';

const Auth = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);

  useEffect(() => {
    auth?.getOAuthRedirectResult?.(() => router.push('/'));
  }, []);

  if (!auth) {
    return <div>loading</div>;
  }

  if (auth.isLoading) {
    return <div>loading</div>;
  }

  return (
    <div className={style.container}>
      <div className={style['login-card-wrap']}>
        <LoginCard login={auth.loginWithOAuth} />
      </div>
      <div className={style['go-to-home']}>
        <Link href="/">トップページへ戻る</Link>
      </div>
    </div>
  );
};

export default Auth;
