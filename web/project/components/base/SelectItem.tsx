import { ButtonBase } from '@mui/material';
import { ButtonHTMLAttributes } from 'react';
import style from './SelectItem.module.scss';

interface Prop extends ButtonHTMLAttributes<HTMLButtonElement> {
  index: number;
}

const SelectItem = ({ children, index, ...rest }: Prop) => {
  return (
    <ButtonBase {...rest} type="button" className={style.container}>
      <div className={style.index}>{index + 1}</div>
      <div className={style.label}>{children}</div>
    </ButtonBase>
  );
};

export default SelectItem;
