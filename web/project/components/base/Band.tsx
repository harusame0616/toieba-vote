import { DetailedHTMLProps, HTMLAttributes } from 'react';
import style from './band.module.scss';

const Band = ({
  children,
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return <div className={style.container}>{children}</div>;
};

export default Band;
