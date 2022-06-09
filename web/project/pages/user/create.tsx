import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import Band from '../../components/base/Band';
import ErrorMessage from '../../components/case/error/ErrorMessage';
import useUserCreation from '../../hooks/user/use-user-creation';
import style from './create.module.scss';

const CreateUser: NextPage = () => {
  const router = useRouter();
  const { error, setName, name, comment, setComment, create } =
    useUserCreation();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const createHandler = async () => {
    if (!(await create())) {
      return;
    }

    location.href =
      typeof router.query.to === 'string' && router.query.to.length
        ? decodeURIComponent(router.query.to)
        : '/';
  };

  useEffect(() => {
    const { name: defaultName } = router.query;
    if (typeof defaultName !== 'string') {
      return;
    }

    setName(defaultName);
  }, [router.query]);

  useEffect(() => {
    nameInputRef?.current?.focus?.();
  }, []);

  return (
    <div className={style.container}>
      <Head>
        <title>プロフィール登録 - 連想投稿SNS！といえばボート</title>
        <meta name="robots" content="noindex" key="robots" />
      </Head>
      <Band>
        <div className={style['items-wrap']}>
          <div className={style.item}>
            <div>名前</div>
            <div>
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={style.control}
                ref={nameInputRef}
              />
              <ErrorMessage>{error.nameError}</ErrorMessage>
            </div>
          </div>
          <div className={style.item}>
            <div>コメント</div>
            <div>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className={style.control}
                rows={5}
              />
              <ErrorMessage>{error.commentError}</ErrorMessage>
            </div>
          </div>
        </div>
      </Band>
      <button onClick={createHandler} className={style['register-button']}>
        登録
      </button>
      <div className={style['error-message']}>
        <ErrorMessage>{error.createError}</ErrorMessage>
      </div>
    </div>
  );
};

export default CreateUser;
