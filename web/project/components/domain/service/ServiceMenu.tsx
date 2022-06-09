import { Dispatch, SetStateAction } from 'react';
import UserMenu from '../user/UserMenu';
import ServiceLogo from './ServiceLogo';
import style from './ServiceMenu.module.scss';

type User =
  | {
      userId: string;
      name: string;
    }
  | { userId: null; name: null };

interface HeaderMenuProp {
  onLogin: () => any | Promise<any>;
  onToiebaCreate: () => any | Promise<any>;
  menuState: [boolean, Dispatch<SetStateAction<boolean>>];
  user: User;
}

const HeaderMenu = (prop: HeaderMenuProp) => {
  return (
    <header className={style.header}>
      <div className={style.logo}>
        <div className={style['logo-wrap']}>
          <ServiceLogo />
        </div>
      </div>
      <div className={style.action}>
        <button onClick={prop.onToiebaCreate}>質問を作成する</button>
        {prop.user.userId ? (
          <div className={style['user-wrap']}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prop.menuState[1](true);
              }}
            >
              {prop.user.name ?? ''}
            </button>
            <div className={style['menu-wrap']}>
              {prop.menuState[0] ? (
                <UserMenu userId={prop.user.userId} />
              ) : null}{' '}
            </div>
          </div>
        ) : (
          <button onClick={prop.onLogin}>ログイン</button>
        )}
      </div>
    </header>
  );
};
export default HeaderMenu;
