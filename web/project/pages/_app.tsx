import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { UserApi } from '../api/user-api';
import { NJAPIUserApi } from '../api/user-api/next-js-api-user-api';
import ServiceMenu from '../components/domain/service/ServiceMenu';
import { UserDto } from '../domains/usecases/user-query-usecase';
import { useAuth } from '../hooks/useAuth';
import { http } from '../library/http';
import '../styles/globals.css';
import style from './_app.module.scss';

interface NoLoggedInUser {
  userId: null;
  name: null;
}

export const AuthContext = createContext<
  ReturnType<typeof useAuth> | undefined
>(undefined);

export const LoggedInUserContext = createContext<UserDto | NoLoggedInUser>({
  userId: null,
  name: null,
});

const userApi: UserApi = new NJAPIUserApi();

function MyApp({ Component, pageProps }: AppProps) {
  const auth = useAuth();
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<UserDto | NoLoggedInUser>({
    userId: null,
    name: null,
  });
  const [userMenuIsOpen, setUserMenuIsOpen] = useState(false);

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
        <div
          className={style.container}
          onClick={() => setUserMenuIsOpen(false)}
        >
          <ServiceMenu
            user={loggedInUser}
            menuState={[userMenuIsOpen, setUserMenuIsOpen]}
            onLogin={() => router.push('/auth')}
            onToiebaCreate={() => {
              const toiebaCreatePath = '/toieba/create';

              router.push(
                auth.isLoggedIn()
                  ? toiebaCreatePath
                  : `/auth?to=${encodeURIComponent(toiebaCreatePath)}`
              );
            }}
          />

          <main className={style.main}>
            <Component {...pageProps} />
          </main>
        </div>
      </LoggedInUserContext.Provider>
    </AuthContext.Provider>
  );
}

export default MyApp;
