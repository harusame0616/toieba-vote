import { Box, Card } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useContext, useEffect, useState } from 'react';
import { AnswerDto, TotalDto } from '../../../api/answer-api';
import { NJAPIAnswerApi } from '../../../api/toieba-api/next-js-api-answer-api';
import Band from '../../../components/base/Band';
import Dialog from '../../../components/base/Dialog';
import SelectGroup from '../../../components/base/SelectGroup';
import SelectItem from '../../../components/base/SelectItem';
import BackButton from '../../../components/case/back/BackButton';
import ErrorMessage from '../../../components/case/error/ErrorMessage';
import PrimaryButton from '../../../components/case/primary/PrimaryButton';
import ActionContainer from '../../../components/container/ActionContainer';
import ContantContainer from '../../../components/container/ContentContainer';
import NaviContainer from '../../../components/container/NaviContainer';
import SectionContainer from '../../../components/container/SectionContainer';
import LikeButton from '../../../components/domain/like/LikeButton';
import ToiebaBand from '../../../components/domain/toieba/ToiebaBand';
import TwitterShare from '../../../components/domain/twitter/TwitterShare';
import { ParameterError } from '../../../errors/parameter-error';
import useCommentLike from '../../../hooks/comment/use-comment-like';
import useCommentList from '../../../hooks/comment/use-comment-list';
import useCommentPost from '../../../hooks/comment/use-comment-post';
import useProcessing from '../../../hooks/use-processing';
import { LoggedInUserContext } from '../../_app';
import style from './total.module.scss';
dayjs.extend(utc);

interface ServerSideProps {
  answerUserId: string | null;
  answer: AnswerDto | null;
  toiebaId: string;
  total: TotalDto;
}

interface QueryParam extends ParsedUrlQuery {
  id: string;
  answerUserId: string;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideProps,
  QueryParam
> = async ({ req, query: { id, answerUserId = null } }) => {
  const answerApi = new NJAPIAnswerApi();

  if (!id || typeof id !== 'string') {
    throw new ParameterError('といえばIDが不正です');
  }

  if (answerUserId && typeof answerUserId !== 'string') {
    throw new ParameterError('回答者IDが不正です');
  }

  let answer = null;
  if (answerUserId) {
    try {
      answer = await answerApi.getAnswerOfToiebaByUserId({
        toiebaId: id,
        answerUserId,
      });
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }
    }
  }

  const [total] = await Promise.all([answerApi.getTotal({ toiebaId: id })]);

  return {
    props: {
      answerUserId,
      answer,
      toiebaId: id,
      total,
    },
  };
};

const ToiebaTotal: NextPage<ServerSideProps> = (prop) => {
  const [commentDialog, setCommentDialog] = useState(false);
  const router = useRouter();
  const { isProcessing, startProcessing } = useProcessing();

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

  const loggedInUser = useContext(LoggedInUserContext);
  const goToAuth = () => {
    router.push(`/auth?to=${encodeURIComponent(router.asPath)}`);
  };

  const [shareUrl, setShareUrl] = useState('');
  useEffect(() => {
    setShareUrl(
      `${location.protocol}//${location.host}/toieba/${prop.toiebaId}/answer` +
        (loggedInUser.userId ? `?answerUserId=${loggedInUser.userId}` : '')
    );
    refreshCommentList();
  }, [loggedInUser]);

  const { theme, choices, count: totalCount } = prop.total;

  return (
    <div className={style.container}>
      <Head>
        <title>{theme}といえばの集計結果 - 連想投稿SNS！といえばボート</title>
      </Head>
      <SectionContainer>
        <ToiebaBand>{theme}</ToiebaBand>
        <NaviContainer>
          <BackButton onClick={() => router.back()} />
        </NaviContainer>
        <ContantContainer>
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
        </ContantContainer>
        <NaviContainer justify="flex-end">
          <TwitterShare
            url={shareUrl}
            text={`${prop.total.theme}といえば%20-%20連想投稿SNS！といえばボート%0a%0a`}
            hashTag="といえばボート"
          />
        </NaviContainer>
        <ContantContainer>
          {prop.answerUserId ? (
            <div>
              {prop.answer?.userName ?? 'お名前不明'} さんは 「
              {prop.answer?.choiceLabel ?? '回答なし'}」 です！！
            </div>
          ) : null}
        </ContantContainer>
      </SectionContainer>
      <SectionContainer>
        <Band id="comment">コメント</Band>
        <ActionContainer>
          <PrimaryButton
            onClick={() => {
              if (loggedInUser.userId) {
                setCommentDialog(true);
              } else {
                goToAuth();
              }
            }}
          >
            コメントを書く
          </PrimaryButton>
        </ActionContainer>
        <ContantContainer>
          <div className={style['comment-list']}>
            <Dialog
              disabled={isProcessing}
              title="コメントする"
              open={commentDialog}
              onOk={async () => {
                await startProcessing(async () => {
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
                });
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
                  <Card
                    sx={{ boxShadow: 4 }}
                    className={style.comment}
                    key={comment.commentId}
                  >
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
                        <div>
                          {dayjs.utc(comment.commentedAt).format('HH:mm')}
                        </div>
                      </div>
                    </div>
                    <Box
                      className={style['comment-body']}
                      sx={{ wordBreak: 'break-all' }}
                    >
                      {comment.text}
                    </Box>
                    <div className={style['comment-footer']}>
                      <LikeButton
                        onLike={async () => {
                          if (loggedInUser.userId) {
                            await likeComment(comment.commentId);
                          } else {
                            goToAuth();
                          }
                        }}
                        onUnlike={async () => {
                          await unlikeComment(comment.commentId);
                        }}
                        isLiked={comment.isLiked}
                        count={comment.likeCount}
                      />
                    </div>
                  </Card>
                ))
              : 'まだコメントがありません。'}
          </div>
        </ContantContainer>
      </SectionContainer>
    </div>
  );
};

export default ToiebaTotal;
