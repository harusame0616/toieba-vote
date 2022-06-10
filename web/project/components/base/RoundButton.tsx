import { ButtonHTMLAttributes } from 'react';
import style from './RoundButton.module.scss';

interface Prop extends ButtonHTMLAttributes<HTMLButtonElement> {
  background?: string;
  color?: string;
}

const RoundButton = ({
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

export default RoundButton;
