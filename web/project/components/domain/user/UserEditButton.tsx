import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHTMLAttributes } from 'react';
import RoundButton from '../../base/RoundButton';

const UserEditButton = (prop: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <RoundButton {...prop} outline>
      <FontAwesomeIcon icon={faUserEdit} />
    </RoundButton>
  );
};

export default UserEditButton;
