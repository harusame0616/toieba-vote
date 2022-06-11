import { FormEvent, ReactNode } from 'react';
import { UserProfile } from '../../../api/user-api';
import useUserEdit from '../../../hooks/user/use-user-edit';
import ErrorMessage from '../../case/error/ErrorMessage';
import style from './UserEditForm.module.scss';

interface Props {
  defaultProfile: UserProfile;
  isLoading: boolean;
  children?: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>, profile: UserProfile) => any;
}

const UserEditForm = (props: Props) => {
  const { name, setName, comment, setComment, error, validateToPass } =
    useUserEdit(props.defaultProfile);

  return (
    <form
      className={style.container}
      onSubmit={(event) => {
        if (!validateToPass()) {
          event.preventDefault();
          return;
        }

        props.onSubmit(event, { name, comment });
      }}
    >
      <div className={style.item}>
        <div className={style.label}>名前</div>
        <div className={style.control}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={style.control}
            disabled={props.isLoading}
          />
          <ErrorMessage>{error.nameError}</ErrorMessage>
        </div>
      </div>
      <div className={style.item}>
        <div className={style.label}>コメント</div>
        <div className={style.control}>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className={style.control}
            rows={5}
            disabled={props.isLoading}
          />
          <ErrorMessage>{error.commentError}</ErrorMessage>
        </div>
      </div>
      {props.children}
    </form>
  );
};

export default UserEditForm;
