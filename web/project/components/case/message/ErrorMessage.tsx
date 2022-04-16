import { ReactNode } from 'react';
import style from './ErrorMessage.module.scss';

interface Prop {
  children?: ReactNode;
}

const ErrorMessage = (prop: Prop) => {
  return <div className={style.container}>{prop.children}</div>;
};

export default ErrorMessage;
