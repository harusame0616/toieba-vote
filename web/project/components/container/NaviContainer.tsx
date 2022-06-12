import { ReactNode } from 'react';
import style from './NaviContainer.module.scss';

interface Prop {
  children: ReactNode;
}
const NaviContainer = ({ children }: Prop) => {
  return <div className={style.container}>{children}</div>;
};

export default NaviContainer;
