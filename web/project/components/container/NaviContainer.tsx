import { ReactNode } from 'react';
import style from './NaviContainer.module.scss';

interface Prop {
  justify?: string;
  children: ReactNode;
}
const NaviContainer = ({ children, ...prop }: Prop) => {
  return (
    <div className={style.container} style={{ justifyContent: prop.justify }}>
      {children}
    </div>
  );
};

export default NaviContainer;
