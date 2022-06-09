import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { UserApi } from '../api/user-api';
import { NJAPIUserApi } from '../api/user-api/next-js-api-user-api';
import UserMenu from '../components/domain/UserMenu';
import ServiceLogo from '../components/domain/ServiceLogo';
import { UserDto } from '../domains/usecases/user-query-usecase';
import { useAuth } from '../hooks/useAuth';
import { http } from '../library/http';
import '../styles/globals.css';
import style from './_app.module.scss';

export const AuthContext = createContext<
  ReturnType<typeof useAuth> | undefined
>(undefined);

export const LoggedInUserContext = createContext<UserDto | { userId: null }>({
  userId: null,
});

const userApi: UserApi = new NJAPIUserApi();

function MyApp({ Component, pageProps }: AppProps) {
  const auth = useAuth();
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<UserDto | { userId: null }>({
    userId: null,
  });
  const [menuIsOpen, setMenuIsOpen] = useState(false);

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
          const [_, queryString] = router.asPath.split('?');
          const to = new URLSearchParams(queryString).get('to');
          router.push({
            pathname: '/user/create',
            query: { name: user.displayName, firebaseUid: user.id, to },
          });
        }
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      <LoggedInUserContext.Provider value={loggedInUser}>
        <div className={style.container} onClick={() => setMenuIsOpen(false)}>
          <header className={style.header}>
            <div className={style.logo}>
              <div className={style['logo-wrap']}>
                <ServiceLogo />
              </div>
            </div>
            <div className={style.action}>
              <button
                onClick={() => {
                  const toiebaCreatePath = '/toieba/create';

                  return router.push(
                    auth.isLoggedIn()
                      ? toiebaCreatePath
                      : `/auth?to=${encodeURIComponent(toiebaCreatePath)}`
                  );
                }}
              >
                質問を作成する
              </button>
              {loggedInUser.userId ? (
                <div className={style['user-wrap']}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuIsOpen(true);
                    }}
                  >
                    {loggedInUser.name ?? ''}
                  </button>
                  <div className={style['menu-wrap']}>
                    {menuIsOpen ? (
                      <UserMenu userId={loggedInUser.userId} />
                    ) : null}
                  </div>
                </div>
              ) : (
                <button onClick={() => router.push('/auth')}>ログイン</button>
              )}
            </div>
          </header>

          <main className={style.main}>
            <Component {...pageProps} />
          </main>
        </div>
      </LoggedInUserContext.Provider>
    </AuthContext.Provider>
  );
}

export default MyApp;
