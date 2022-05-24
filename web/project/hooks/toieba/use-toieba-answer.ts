import { ToiebaApi } from '../../api/toieba-api';
import { NJAPIToiebaApi } from '../../api/toieba-api/next-js-api-toieba-api';

interface UseToiebaAnswerParam {
  toiebaId: string;
  toiebaApi?: ToiebaApi;
}

const useToiebaAnswer = ({
  toiebaId,
  toiebaApi = new NJAPIToiebaApi(),
}: UseToiebaAnswerParam) => {
  const answer = async (choiceId: string) => {
    return await toiebaApi.answer({ toiebaId, choiceId });
  };

  return {
    answer,
  };
};

export default useToiebaAnswer;
