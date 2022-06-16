import { ButtonHTMLAttributes } from 'react';
import style from './RoundButton.module.scss';

const sizeList = ['normal', 'large'] as const;
type Size = typeof sizeList[number];
interface Prop extends ButtonHTMLAttributes<HTMLButtonElement> {
  background?: string;
  color?: string;
  outline?: boolean;
  size?: Size;
}

const RoundButton = ({
  background = '#222831',
  color = 'white',
  type = 'button',
  outline = false,
  size = 'normal',
  children,
  ...rest
}: Prop) => {
  let computedStyle = {
    color: outline ? background : color,
    background: outline ? 'inherit' : background,
    borderColor: background,
  };
  const sizeStyle = size === 'large' ? style.large : null;

  return (
    <button
      {...rest}
      type={type}
      className={`${style.container} ${sizeStyle}`}
      style={computedStyle}
    >
      {children}
    </button>
  );
};

export default RoundButton;
