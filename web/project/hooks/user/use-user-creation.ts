import { useState } from 'react';
import { UserApi } from '../../api/user-api';
import { NJAPIUserApi } from '../../api/user-api/next-js-api-user-api';
import { User } from '../../domains/models/user/user';

interface UseUserCreationParam {
  userApi?: UserApi;
}
const useUserCreation = ({
  userApi = new NJAPIUserApi(),
}: UseUserCreationParam = {}) => {
  const [name, _setName] = useState('');
  const [comment, _setComment] = useState('');
  const [nameError, setNameError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [createError, setCreateError] = useState('');

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

  const create = async () => {
    if (!validateName(name) || !validateComment(comment)) {
      return false;
    }

    try {
      await userApi.createUser({ name, comment });
      return true;
    } catch (error: any) {
      setCreateError(
        error.message ?? error.data?.message ?? '不明なエラーが発生しました'
      );
    }
    return false;
  };

  return {
    name,
    setName,
    comment,
    setComment,
    create,
    error: {
      nameError,
      commentError,
      createError,
    },
  };
};

export default useUserCreation;
