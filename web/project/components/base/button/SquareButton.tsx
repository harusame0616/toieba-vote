import { ButtonHTMLAttributes } from 'react';
import style from './SquareButton.module.scss';

interface Prop extends ButtonHTMLAttributes<HTMLButtonElement> {
  background: string;
  color: string;
}

const SquareButton = ({
  background = '#222831',
  color = 'white',
  type = 'button',
  children,
  ...rest
}: Prop) => {
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
