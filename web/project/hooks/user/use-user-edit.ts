import { useState } from 'react';
import { User, UserProfile } from '../../domains/models/user/user';

type UseUserEditParam = Partial<UserProfile>;

const useUserEdit = (param: UseUserEditParam = {}) => {
  const [name, _setName] = useState(param.name ?? '');
  const [comment, _setComment] = useState(param.comment ?? '');
  const [nameError, setNameError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [_userId, _setUserId] = useState<string | null>(null);

  const validateName = (name: string) => {
    if (!name) {
      setNameError('名前は必須です。');
    } else if (name.length > User.NAME_MAX_LENGTH) {
      setNameError(`名前は${User.NAME_MAX_LENGTH}文字以内で入力してください`);
    } else {
      setNameError(``);
      return true;
    }
    return false;
  };

  const setName = (newName: string) => {
    validateName(newName);
    _setName(newName);
  };

  const validateComment = (comment: string) => {
    if (comment.length > User.COMMENT_MAX_LENGTH) {
      setCommentError(
        `コメントは${User.COMMENT_MAX_LENGTH}文字以内で入力してください`
      );
    } else {
      setCommentError(``);
      return true;
    }
    return false;
  };
  const setComment = (newComment: string) => {
    validateComment(newComment);
    _setComment(newComment ?? '');
  };

  const validateToPass = () => {
    return validateName(name) && validateComment(comment);
  };

  return {
    name,
    setName,
    comment,
    setComment,
    validateToPass,
    error: {
      nameError,
      commentError,
    },
  };
};

export default useUserEdit;
