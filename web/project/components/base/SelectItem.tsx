import { DetailedHTMLProps, HTMLAttributes } from 'react';
import style from './SelectItem.module.scss';

interface Prop
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  index: number;
}

const SelectItem = ({ children, index, ...rest }: Prop) => {
  return (
    <div {...rest} className={style.container}>
      <div className={style.index}>{index + 1}</div>
      <div className={style.label}>{children}</div>
    </div>
  );
};

export default SelectItem;
