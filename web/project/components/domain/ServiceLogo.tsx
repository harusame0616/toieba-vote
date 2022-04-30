import style from './ServiceLogo.module.scss';

const ServiceLogo = () => {
  return (
    <a href="/" className={style.container}>
      <img
        src="/logo.png"
        alt="連想投票SNS といえばぼーと"
        width="420"
        height="140"
        className={style.logo}
      />
    </a>
  );
};

export default ServiceLogo;
