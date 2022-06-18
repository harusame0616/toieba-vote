import { Card } from '@mui/material';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import style from './SelectGroup.module.scss';

const SelectGroup = ({
  children,
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <Card sx={{ boxShadow: 4 }}>
      <div className={style.container}>{children}</div>
    </Card>
  );
};

export default SelectGroup;
