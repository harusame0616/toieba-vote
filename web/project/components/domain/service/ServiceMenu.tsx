import { ThemeContext } from '@emotion/react';
import {
  AppBar,
  Avatar,
  Collapse,
  IconButton,
  Slide,
  Toolbar,
  useScrollTrigger,
} from '@mui/material';
import { Dispatch, SetStateAction, useContext } from 'react';
import useDisplayType from '../../../hooks/useDisplayType';
import PrimaryButton from '../../case/primary/PrimaryButton';
import SecondaryButton from '../../case/secondary/SecondaryButton';
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
  const theme: any = useContext(ThemeContext);

  const { display } = useDisplayType();
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar className={style.header} style={{ background: '#fafafa' }}>
        <Toolbar>
          <div className={style.logo}>
            <div className={style['logo-wrap']}>
              <ServiceLogo mobile={display === 'sp'} />
            </div>
          </div>
          <div className={style.action}>
            <SecondaryButton onClick={prop.onToiebaCreate}>
              といえばを作成する
            </SecondaryButton>
            {prop.user.userId ? (
              <div className={style['user-wrap']}>
                <IconButton>
                  <Avatar
                    sx={{
                      backgroundColor: theme?.palette?.primary?.main,
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      prop.menuState[1](true);
                    }}
                  >
                    {prop.user.name[0]}
                  </Avatar>
                </IconButton>
                <div className={style['menu-wrap']}>
                  <Collapse in={prop.menuState[0]}>
                    <UserMenu userId={prop.user.userId} />
                  </Collapse>
                </div>
              </div>
            ) : (
              <PrimaryButton onClick={prop.onLogin}>ログイン</PrimaryButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Slide>
  );
};
export default HeaderMenu;
