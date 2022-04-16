import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHTMLAttributes } from 'react';
import RoundButton from '../../base/button/RoundButton';

const UpButton = (prop: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <RoundButton {...prop}>
      <FontAwesomeIcon icon={faArrowDown} />
    </RoundButton>
  );
};

export default UpButton;
