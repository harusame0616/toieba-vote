import { DialogHTMLAttributes, HTMLAttributes, useEffect } from 'react';
import style from './Dialog.module.scss';

interface DialogParam extends HTMLAttributes<HTMLDivElement> {
  onCancel: () => Promise<void> | void;
  onOk: () => Promise<void> | void;
  height?: string;
  width?: string;
  open: boolean;
  title?: string;
}

const Dialog = ({
  children,
  onCancel,
  onOk,
  open,
  height = '100%',
  width = '100%',
  title = '',
  ...prop
}: DialogParam) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  return (
    <div
      className={style.container}
      style={{ display: open ? undefined : 'none' }}
    >
      <div
        {...prop}
        className={style.dialog}
        style={{ maxHeight: height, maxWidth: width }}
      >
        <div className={style.title}>{title}</div>
        <div className={style.body}>{children}</div>
        <div className={style.action}>
          <button onClick={() => onCancel()} className={style.cancel}>
            キャンセル
          </button>
          <button onClick={() => onOk()} className={style.ok}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
export default Dialog;
