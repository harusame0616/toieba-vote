import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { UserApi } from '../api/user-api';
import { NJAPIUserApi } from '../api/user-api/next-js-api-user-api';
import ServiceLogo from '../components/domain/ServiceLogo';
import { UserDto } from '../domains/usecases/user-query-usecase';
import { useAuth } from '../hooks/useAuth';
import { http } from '../library/http';
import '../styles/globals.css';
import style from './_app.module.scss';

export const AuthContext = createContext<
  ReturnType<typeof useAuth> | undefined
>(undefined);

const userApi: UserApi = new NJAPIUserApi();

function MyApp({ Component, pageProps }: AppProps) {
  const auth = useAuth();
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<UserDto | undefined>(
    undefined
  );

  useEffect(() => {
    if (auth.isLoggedIn()) {
      return;
    }

    auth.restoreAuth(async (user) => {
      http.setAuthorization(user.token);
      if (user.id) {
        try {
          setLoggedInUser(await userApi.getUser({ firebaseUid: user.id }));
        } catch (err) {
          router.push(
            `/user/create?name=${user.displayName}&firebaseUid=${user.id}`
          );
        }
      }
    });
  }, [auth, router]);

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
              <button>{loggedInUser?.name ?? ''}</button>
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
