import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';

type Prop = React.ComponentProps<typeof IconButton>;

IconButton;
const UserEditButton = (prop: Prop) => {
  return (
    <IconButton {...prop} color="primary">
      <FontAwesomeIcon icon={faUserEdit} size="xs" />
    </IconButton>
  );
};

export default UserEditButton;
