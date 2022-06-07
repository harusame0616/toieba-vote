import { useState } from 'react';
import { CommentApi, CommentDto } from '../../api/comment-api';
import { NextCommentApi } from '../../api/next-api/next-comment-api';

interface CommentWithLikeDto extends CommentDto {
  isLiked: boolean;
}

interface UseCommentPostParam {
  toiebaId: string;
  userId: string | null;
  commentApi?: CommentApi;
}

const useCommentList = ({
  toiebaId,
  userId,
  commentApi = new NextCommentApi(),
}: UseCommentPostParam) => {
  const [commentList, setCommentList] = useState<CommentWithLikeDto[]>([]);

  const refreshCommentList = async () => {
    setCommentList(
      (await commentApi.getCommentList({ toiebaId })).map((comment) => ({
        ...comment,
        isLiked: comment.likes.some((like) => like.userId === userId),
      }))
    );
  };

  return {
    commentList,
    refreshCommentList,
  };
};
export default useCommentList;
