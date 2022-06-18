import { Modal } from '@mui/material';
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
  disabled?: boolean;
}

const Dialog = ({
  children,
  onCancel,
  onOk,
  open,
  height = '100%',
  width = '100%',
  title = '',
  disabled = false,
  ...prop
}: DialogParam) => {
  return (
    <Modal className={style.container} open={open}>
      <div
        {...prop}
        className={style.dialog}
        style={{ maxHeight: height, maxWidth: width }}
      >
        <div className={style.title}>{title}</div>
        <div className={style.body}>{children}</div>
        <div className={style.action}>
          <SecondaryButton
            disabled={disabled}
            onClick={() => onCancel()}
            className={style.button}
          >
            キャンセル
          </SecondaryButton>
          <PrimaryButton
            disabled={disabled}
            onClick={() => onOk()}
            className={style.button}
          >
            コメントする
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};
export default Dialog;
