import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PrimaryButton, { PrimaryButtonProp } from '../primary/PrimaryButton';

const AddButton = (prop: PrimaryButtonProp) => {
  return (
    <PrimaryButton {...prop}>
      <FontAwesomeIcon icon={faPlus} />
    </PrimaryButton>
  );
};

export default AddButton;
