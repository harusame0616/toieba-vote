import { ReactNode } from 'react';
import style from './SectionContainer.module.scss';

interface Prop {
  children: ReactNode;
}

const SectionContainer = ({ children }: Prop) => {
  return <div className={style.container}>{children}</div>;
};

export default SectionContainer;
