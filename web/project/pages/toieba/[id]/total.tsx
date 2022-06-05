import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { GetServerSideProps, NextPage } from 'next';
import Error from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useContext, useEffect, useState } from 'react';
import { TotalDto } from '../../../api/answer-api';
import { NJAPIAnswerApi } from '../../../api/toieba-api/next-js-api-answer-api';
import Band from '../../../components/base/Band';
import Dialog from '../../../components/base/Dialog';
import SelectGroup from '../../../components/base/SelectGroup';
import SelectItem from '../../../components/base/SelectItem';
import ErrorMessage from '../../../components/case/message/ErrorMessage';
import LikeButton from '../../../components/domain/button/LikeButton';
import ToiebaBand from '../../../components/domain/ToiebaBand';
import { ParameterError } from '../../../errors/parameter-error';
import {
  isServerSideErrorProps,
  ServerSideErrorProps,
  toServerSideError,
} from '../../../errors/server-side-error';
import useCommentLike from '../../../hooks/comment/use-comment-like';
import useCommentList from '../../../hooks/comment/use-comment-list';
import useCommentPost from '../../../hooks/comment/use-comment-post';
import { LoggedInUserContext } from '../../_app';
import style from './total.module.scss';
dayjs.extend(utc);

type ServerSideProps = ServerSideSuccessProps | ServerSideErrorProps;

interface ServerSideSuccessProps {
  toiebaId: string;
  total: TotalDto;
}

interface QueryParam extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideProps,
  QueryParam
> = async ({ query: { id } }) => {
  const answerApi = new NJAPIAnswerApi();
  let total;

  if (!id || typeof id !== 'string') {
    throw new ParameterError('といえばIDが不正です');
  }

  try {
    [total] = await Promise.all([answerApi.getTotal({ toiebaId: id })]);
  } catch (error: any) {
    return {
      props: {
        error: toServerSideError(error),
      },
    };
  }

  return {
    props: {
      toiebaId: id,
      total,
    },
  };
};

const ToiebaTotal: NextPage<ServerSideProps> = (prop) => {
  const [commentDialog, setCommentDialog] = useState(false);
  const router = useRouter();

  const toiebaId = router.query.id;
  if (!toiebaId || typeof toiebaId !== 'string') {
    throw new ParameterError('toiebaIdのフォーマットが不正です。');
  }

  const { userId } = useContext(LoggedInUserContext);
  const { commentList, refreshCommentList } = useCommentList({
    toiebaId,
    userId,
  });
  const { text, setText, postComment, clearText, error } = useCommentPost({
    toiebaId,
  });
  const { likeComment, unlikeComment } = useCommentLike();

  useEffect(() => {
    refreshCommentList();
  }, []);

  if (isServerSideErrorProps(prop)) {
    return <Error statusCode={prop.error.status} />;
  }

  const { theme, choices, count: totalCount } = prop.total;

  return (
    <div className={style.container}>
      <ToiebaBand>{theme}</ToiebaBand>
      <div className={style['choices-wrap']}>
        <div className={style.choices}>
          <SelectGroup>
            {choices.map((choice: any, index: number) => (
              <SelectItem index={index} key={choice.choiceId}>
                <div className={style.label}>
                  <div className={style.text}>{choice.label} </div>
                  <div className={style.info}>
                    {Math.floor((choice.count / totalCount) * 1000) / 10}%
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </div>
      </div>

      <Band id="comment">コメント</Band>
      <div className={style['comment-list']}>
        <button onClick={() => setCommentDialog(true)}>コメントする</button>
        <Dialog
          title="コメントする"
          open={commentDialog}
          onOk={async () => {
            try {
              await postComment();
              await refreshCommentList();
            } catch (err) {
              console.error(err);
              return;
            }
            clearText();
            error.clear();
            setCommentDialog(false);
          }}
          onCancel={() => {
            clearText();
            error.clear();
            setCommentDialog(false);
          }}
          height="300px"
          width="480px"
        >
          <textarea
            style={{ width: '100%', height: '100%', resize: 'none' }}
            onChange={(event) => setText(event.target.value)}
            value={text}
          />
          <ErrorMessage>{error.textError}</ErrorMessage>
        </Dialog>
        {commentList.length
          ? commentList.map((comment) => (
              <div className={style.comment} key={comment.commentId}>
                {comment.commentId}
                <div className={style['comment-header']}>
                  <div className={style.name}>
                    <Link href={`/user/${comment.userId}`}>
                      <a>{comment.userName}</a>
                    </Link>{' '}
                  </div>
                  <div className={style.date}>
                    <div>
                      {dayjs.utc(comment.commentedAt).format('YYYY/MM/DD')}
                    </div>
                    <div>{dayjs.utc(comment.commentedAt).format('HH:mm')}</div>
                  </div>
                </div>
                <div className={style['comment-body']}>{comment.text}</div>
                <div className={style['comment-footer']}>
                  <LikeButton
                    onLike={async () => {
                      await likeComment(comment.commentId);
                    }}
                    onUnlike={async () => {
                      await unlikeComment(comment.commentId);
                    }}
                    isLiked={comment.isLiked}
                    count={comment.likeCount}
                  />
                </div>
              </div>
            ))
          : 'まだコメントがありません。'}
      </div>
    </div>
  );
};

export default ToiebaTotal;
