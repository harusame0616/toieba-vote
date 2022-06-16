import { ButtonHTMLAttributes } from 'react';
import style from './Button.module.scss';

export interface ButtonProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  background?: string;
  color?: string;
  outline?: boolean;
  text?: boolean;
  width?: string;
  height?: string;
}

const Button = ({
  background = '#222831',
  color = 'white',
  type = 'button',
  outline = false,
  text = false,
  width = 'auto',
  height = 'auto',
  children,
  ...rest
}: ButtonProp) => {
  let computedStyle = {
    color: outline ? background : color,
    background: outline || text ? 'inherit' : background,
    borderColor: background,
    borderWidth: text ? 0 : 1,
    boxShadow: text ? undefined : '1px 1px 2px rgb(0 0 0 / 40%)',
    width,
    height,
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

export default Button;
