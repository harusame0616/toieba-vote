import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { createContext, useEffect } from 'react';
import ServiceLogo from '../components/domain/ServiceLogo';
import { useAuth } from '../hooks/useAuth';
import { http } from '../library/http';
import '../styles/globals.css';
import style from './_app.module.scss';

export const AuthContext = createContext<
  ReturnType<typeof useAuth> | undefined
>(undefined);

function MyApp({ Component, pageProps }: AppProps) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isLoggedIn()) {
      return;
    }
    auth.restoreAuth((user) => {
      http.setAuthorization(user.token);
    });
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      <div className={style.container}>
        <header className={style.header}>
          <div className={style.logo}>
            <div className={style['logo-wrap']}>
              <ServiceLogo />
            </div>
          </div>
          <div className={style.action}>
            <button
              onClick={() => {
                return router.push(
                  auth.isLoggedIn() ? '/toieba/create' : '/auth'
                );
              }}
            >
              質問を作成する
            </button>
            {auth?.isLoggedIn() ? (
              auth.user.displayName
            ) : (
              <button onClick={() => router.push('/auth')}>ログイン</button>
            )}
          </div>
        </header>
        <main className={style.main}>
          <Component {...pageProps} />
        </main>
      </div>
    </AuthContext.Provider>
  );
}

export default MyApp;
