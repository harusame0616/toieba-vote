import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
  TwitterAuthProvider,
} from 'firebase/auth';
import { useState } from 'react';

interface AuthUser {
  id?: string;
  displayName?: string;
  token?: string;
}

const appConfig = (() => {
  return process.env.NODE_ENV === 'production'
    ? require('/firebase.config.json')
    : {
        apiKey: 'dev-api-key',
        authDomain: 'dev-auth-domain',
        projectId: 'demo-project',
      };
})();

const firebaseApp = initializeApp(appConfig);

const providerMap = {
  Google: GoogleAuthProvider,
  Twitter: TwitterAuthProvider,
};

let auth = (() => {
  if (process.env.NODE_ENV === 'production') {
    return getAuth(firebaseApp);
  } else {
    const auth = getAuth();
    connectAuthEmulator(auth, 'http://localhost:9099');
    return auth;
  }
})();

type ProviderName = keyof typeof providerMap;

export const useAuth = () => {
  const [user, setAuthUser] = useState<AuthUser>({
    id: undefined,
    displayName: undefined,
  });

  const loginWithOAuth = async (providerName: ProviderName) => {
    const Provider = providerMap[providerName];
    await signInWithRedirect(auth, new Provider());
  };

  const [isLoading, setIsLoading] = useState(false);
  const getOAuthRedirectResult = (callback?: () => Promise<any>) => {
    setIsLoading(true);
    getRedirectResult(auth).then(async (result) => {
      if (!result) {
        setIsLoading(false);
        return;
      }

      setAuthUser({
        id: result.user.uid,
        displayName: result.user.displayName ?? undefined,
        token: await result.user.getIdToken(),
      });

      await callback?.();
      setIsLoading(false);
    });
  };

  const restoreAuth = (callback?: (user: AuthUser) => Promise<any> | void) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const authUser = {
        id: user?.uid,
        displayName: user?.displayName ?? undefined,
        token: await user?.getIdToken(),
      };

      setAuthUser(authUser);
      await callback?.(authUser);

      unsubscribe();
    });
  };

  const isLoggedIn = () => !!user.id;

  return {
    loginWithOAuth,
    getOAuthRedirectResult,
    isLoggedIn,
    restoreAuth,
    user,
    isLoading,
  };
};

export type UseAuthReturn = ReturnType<typeof useAuth>;
