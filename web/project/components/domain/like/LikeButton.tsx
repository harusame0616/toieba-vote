import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import style from './LikeButton.module.scss';

interface LikeButtonParam {
  isLiked: boolean;
  count: number;
  onLike?: () => void | Promise<void>;
  onUnlike?: () => void | Promise<void>;
}

const LikeButton = (param: LikeButtonParam) => {
  const [isLiked, setIsLike] = useState(param.isLiked);
  const [isShaked, setIsShaked] = useState(false);
  const [isBeatted, setIsBeatted] = useState(false);
  const count = param.isLiked ? param.count - 1 : param.count;

  const setPlusOneReaction = () => {
    setIsShaked(true);
    setTimeout(() => {
      setIsShaked(false);
    }, 500);
  };

  const toggleLike = async () => {
    if (!isLiked) {
      setPlusOneReaction();
      setIsBeatted(false);
      await param.onLike?.();
    } else {
      setIsBeatted(true);
      await param.onUnlike?.();
    }

    setIsLike(!isLiked);
  };

  return (
    <button
      onClick={async () => toggleLike()}
      onMouseEnter={() => !isLiked && setIsBeatted(true)}
      onMouseLeave={() => setIsBeatted(false)}
      className={style.container}
    >
      <div className={style.icon}>
        <FontAwesomeIcon
          icon={isLiked ? faHeartSolid : faHeartRegular}
          color="#ff5050"
          shake={isShaked}
          beat={isBeatted}
          size="1x"
        />
      </div>
      <div className={style['count-wrap']}>
        <div
          className={`${style.count} ${style.upper} ${
            isLiked ? style.active : style.inactive
          }`}
        >
          {(count + 1).toLocaleString()}
        </div>
        <div
          className={`${style.count} ${style.current} ${
            isLiked ? style.inactive : style.active
          }`}
        >
          {count.toLocaleString()}
        </div>
      </div>
    </button>
  );
};

export default LikeButton;
