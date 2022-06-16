import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import Button, { ButtonProp } from '../../base/Button';

interface BackButton extends ButtonProp {}

const BackButton = (prop: BackButton) => {
  return (
    <Button text color="black" {...prop}>
      <div>
        <FontAwesomeIcon
          icon={faCaretLeft}
          style={{ marginLeft: '-5px' }}
          size="1x"
        />{' '}
        戻る
      </div>
    </Button>
  );
};

export default BackButton;
