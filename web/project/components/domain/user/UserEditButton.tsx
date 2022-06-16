import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHTMLAttributes } from 'react';
import RoundButton from '../../base/RoundButton';

const UserEditButton = (prop: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <RoundButton {...prop} outline size="large">
      <FontAwesomeIcon
        icon={faUserEdit}
        size="xs"
        style={{ marginLeft: '8px' }}
      />
    </RoundButton>
  );
};

export default UserEditButton;
