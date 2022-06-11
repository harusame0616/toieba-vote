import { ButtonHTMLAttributes } from 'react';
import style from './SquareButton.module.scss';

export interface SquareButtonProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  background?: string;
  color?: string;
}

const SquareButton = ({
  background = '#222831',
  color = 'white',
  type = 'button',
  children,
  ...rest
}: SquareButtonProp) => {
  return (
    <button
      {...rest}
      type={type}
      className={style.container}
      style={{ background, color, borderColor: background }}
    >
      {children}
    </button>
  );
};

export default SquareButton;
