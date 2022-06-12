import { DialogHTMLAttributes, HTMLAttributes, useEffect } from 'react';
import PrimaryButton from '../case/primary/PrimaryButton';
import SecondaryButton from '../case/secondary/SecondaryButton';
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
          <SecondaryButton onClick={() => onCancel()} className={style.cancel}>
            キャンセル
          </SecondaryButton>
          <PrimaryButton onClick={() => onOk()} className={style.ok}>
            OK
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
export default Dialog;
