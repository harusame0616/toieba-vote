import { CommentApi } from '../../api/comment-api';
import { NextCommentApi } from '../../api/next-api/next-comment-api';

interface UseCommentPostParam {
  commentApi?: CommentApi;
}
const useCommentLike = ({
  commentApi = new NextCommentApi(),
}: UseCommentPostParam = {}) => {
  const likeComment = async (commentId: string) => {
    await commentApi.likeComment({ commentId });
  };
  const unlikeComment = async (commentId: string) => {
    await commentApi.unlikeComment({ commentId });
  };

  return {
    likeComment,
    unlikeComment,
  };
};
export default useCommentLike;
