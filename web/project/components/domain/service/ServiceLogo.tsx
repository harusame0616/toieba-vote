import Image from 'next/image';
import Link from 'next/link';
import style from './ServiceLogo.module.scss';

interface Prop {
  mobile?: boolean;
}

const ServiceLogo = (prop: Prop) => {
  return (
    <Link href="/">
      <a className={style.container}>
        {prop.mobile ? (
          <Image
            src="/icon.png"
            alt="連想投票SNS といえばぼーと"
            width="70"
            height="70"
            className={style.logo}
          />
        ) : (
          <Image
            src="/logo.png"
            alt="連想投票SNS といえばぼーと"
            width="420"
            height="140"
            className={style.logo}
          />
        )}
      </a>
    </Link>
  );
};

export default ServiceLogo;
