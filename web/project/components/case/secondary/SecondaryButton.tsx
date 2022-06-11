import Button, { ButtonProp } from '../../base/Button';

interface PrimaryButtonProp extends ButtonProp {}

const SecondaryButton = (prop: PrimaryButtonProp) => {
  return <Button {...prop} outline background="#3a809c" />;
};

export default SecondaryButton;
