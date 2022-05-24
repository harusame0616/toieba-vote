import { ButtonHTMLAttributes } from 'react';
import RoundButton from '../../base/button/RoundButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const UpButton = (prop: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <RoundButton {...prop} background={'red'} color={'white'}>
      <FontAwesomeIcon icon={faTrash} />
    </RoundButton>
  );
};

export default UpButton;
