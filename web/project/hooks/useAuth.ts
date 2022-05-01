import { initializeApp } from 'firebase/app';
import {
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

const firebaseApp = initializeApp(require('/firebase.config.json'));
const providerMap = {
  Google: GoogleAuthProvider,
  Twitter: TwitterAuthProvider,
};

type ProviderName = keyof typeof providerMap;
export const useAuth = () => {
  const auth = getAuth(firebaseApp);
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
