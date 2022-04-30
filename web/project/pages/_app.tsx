import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useAuth } from '../hooks/useAuth';
import { createContext, useEffect } from 'react';

export const AuthContext = createContext<
  ReturnType<typeof useAuth> | undefined
>(undefined);

function MyApp({ Component, pageProps }: AppProps) {
  const auth = useAuth();

  useEffect(() => {
    auth.restoreAuth();
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

export default MyApp;
