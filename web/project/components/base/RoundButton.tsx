import { ButtonHTMLAttributes } from 'react';
import style from './RoundButton.module.scss';

interface Prop extends ButtonHTMLAttributes<HTMLButtonElement> {
  background?: string;
  color?: string;
  outline?: boolean;
}

const RoundButton = ({
  background = '#222831',
  color = 'white',
  type = 'button',
  outline = false,
  children,
  ...rest
}: Prop) => {
  let computedStyle = {
    color: outline ? background : color,
    background: outline ? 'inherit' : background,
    borderColor: background,
  };

  return (
    <button
      {...rest}
      type={type}
      className={style.container}
      style={computedStyle}
    >
      {children}
    </button>
  );
};

export default RoundButton;
