import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHTMLAttributes } from 'react';
import RoundButton from '../../base/button/RoundButton';

const UpButton = (prop: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <RoundButton {...prop}>
    <FontAwesomeIcon icon={faArrowUp} />
  </RoundButton>
);

export default UpButton;
