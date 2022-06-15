import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLAttributes } from 'react';
import style from './SelectItem.module.scss';

interface Prop extends ButtonHTMLAttributes<HTMLButtonElement> {
  index: number;
}

const SelectItem = ({ children, index, ...rest }: Prop) => {
  return (
    <button {...rest} className={style.container}>
      <div className={style.index}>{index + 1}</div>
      <div className={style.label}>{children}</div>
    </button>
  );
};

export default SelectItem;
