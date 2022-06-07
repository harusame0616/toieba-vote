import { useState } from 'react';
import { CommentApi } from '../../api/comment-api';
import { NextCommentApi } from '../../api/next-api/next-comment-api';
import { Comment } from '../../domains/models/comment/comment';

interface UseCommentPostParam {
  toiebaId: string;
  commentApi?: CommentApi;
}
const useCommentPost = ({
  toiebaId,
  commentApi = new NextCommentApi(),
}: UseCommentPostParam) => {
  const [text, _setText] = useState('');
  const [textError, setTextError] = useState('');

  const setText = (newText: string) => {
    try {
      Comment.validateText(newText);
      setTextError('');
    } catch (error: any) {
      setTextError(error.message);
    }

    _setText(newText);
  };

  const clearText = () => {
    _setText('');
  };

  const postComment = async () => {
    try {
      Comment.validateText(text);
    } catch (error: any) {
      setTextError(error.message);
      throw error;
    }

    await commentApi.postComment({
      toiebaId,
      text,
    });
  };

  const clear = () => {
    setTextError('');
  };

  return {
    text,
    setText,
    postComment,
    clearText,
    error: {
      clear,
      textError,
    },
  };
};
export default useCommentPost;
