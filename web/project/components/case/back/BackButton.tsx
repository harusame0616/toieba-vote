import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import Button, { ButtonProp } from '../../base/Button';

interface BackButton extends ButtonProp {}

const BackButton = (prop: BackButton) => {
  return (
    <Button text color="black" {...prop}>
      <FontAwesomeIcon icon={faCaretLeft} style={{ marginLeft: '-5px' }} /> 戻る
    </Button>
  );
};

export default BackButton;
