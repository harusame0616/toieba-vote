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

  return <div></div>;
};

export default Logout;
