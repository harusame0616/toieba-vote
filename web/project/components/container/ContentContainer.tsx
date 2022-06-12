import { ReactNode } from 'react';
import style from './ContentContainer.module.scss';

interface Prop {
  children: ReactNode;
}
const ContentContainer = ({ children }: Prop) => {
  return <div className={style.container}>{children}</div>;
};

export default ContentContainer;
