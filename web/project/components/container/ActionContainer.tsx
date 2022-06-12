import { ReactNode } from 'react';
import style from './ActionContainer.module.scss';

interface Prop {
  children: ReactNode;
}
const ActionContainer = ({ children }: Prop) => {
  return <div className={style.container}>{children}</div>;
};

export default ActionContainer;
