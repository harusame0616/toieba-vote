import Link from 'next/link';
import Image from 'next/image';
import style from './ServiceLogo.module.scss';

const ServiceLogo = () => {
  return (
    <Link href="/">
      <a className={style.container}>
        <Image
          src="/logo.png"
          alt="連想投票SNS といえばぼーと"
          width="420"
          height="140"
          className={style.logo}
        />
      </a>
    </Link>
  );
};

export default ServiceLogo;
