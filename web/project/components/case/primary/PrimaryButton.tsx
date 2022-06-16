import Button, { ButtonProp } from '../../base/Button';

export interface PrimaryButtonProp extends ButtonProp {}

const PrimaryButton = (prop: PrimaryButtonProp) => {
  return <Button {...prop} background="#3a809c" />;
};

export default PrimaryButton;
