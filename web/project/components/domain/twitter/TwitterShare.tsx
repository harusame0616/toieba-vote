import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import style from './TwitterShare.module.scss';

interface Prop {
  url: string;
  hashTag?: string;
  text?: string;
}

const TwitterShare = (prop: Prop) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(
      `https://twitter.com/share?url=${prop.url}%0a0a${
        prop.text ? `&text=${prop.text}` : ''
      }${prop.hashTag ? `&hashtags=${prop.hashTag}` : ''}`
    );
  }, [prop.hashTag, prop.text, prop.url]);

  return (
    <a target="_about" className={style.container} href={url}>
      <FontAwesomeIcon icon={faTwitter} color="white" size="xs" /> シェア
    </a>
  );
};
export default TwitterShare;
