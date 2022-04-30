import { faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './LoginCard.module.scss';

const supportMethods = ['Google', 'Twitter'] as const;
export type Method = typeof supportMethods[number];

const methodInfo = {
  Google: {
    icon: faGoogle,
    label: 'Google',
    color: '#ea4335',
  },
  Twitter: {
    icon: faTwitter,
    label: 'Twitter',
    color: '#00ACEE',
  },
};

interface LoginCardProp {
  login: (method: Method) => void;
}

const LoginCard = ({ login }: LoginCardProp) => {
  return (
    <div className={styles['login-card']}>
      {supportMethods.map((method) => (
        <button
          key={method}
          onClick={() => login(method)}
          className={styles['login-button']}
        >
          <div className={styles['brand-icon']}>
            <FontAwesomeIcon
              icon={methodInfo[method].icon}
              style={{ color: methodInfo[method].color }}
            />
          </div>
          Login with <span className={styles['brand-name']}>{method}</span>
        </button>
      ))}
    </div>
  );
};

export default LoginCard;
