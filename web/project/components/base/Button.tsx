import { Button as MUButton, SxProps } from '@mui/material';
import { ButtonHTMLAttributes } from 'react';
import style from './Button.module.scss';

export interface ButtonProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  background?: string;
  color?: string;
  outline?: boolean;
  text?: boolean;
  width?: string;
  height?: string;
  sx?: SxProps;
}

const Button = ({
  background = '#222831',
  color = 'white',
  type = 'button',
  outline = false,
  text = false,
  sx = {},
  children,
  ...rest
}: ButtonProp) => {
  let computedStyle = {
    color: outline ? background : color,
    background: outline || text ? 'inherit' : background,
    borderColor: background,
    borderWidth: text ? 0 : 1,
  };

  return (
    <MUButton
      {...rest}
      type={type}
      className={style.container}
      style={computedStyle}
      sx={{ boxShadow: text ? undefined : 4, ...sx }}
    >
      {children}
    </MUButton>
  );
};

export default Button;
