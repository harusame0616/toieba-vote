import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHTMLAttributes } from 'react';
import SquareButton from '../../base/SquareButton';

const AddButton = (prop: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <SquareButton {...prop} background={'green'} color={'white'}>
      <FontAwesomeIcon icon={faPlus} />
    </SquareButton>
  );
};

export default AddButton;
