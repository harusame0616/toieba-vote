import { DetailedHTMLProps, HTMLAttributes } from 'react';
import style from './SelectGroup.module.scss';

const SelectGroup = ({
  children,
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return <div className={style.container}>{children}</div>;
};

export default SelectGroup;
