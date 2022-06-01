import Link from 'next/link';
import style from './UserMenu.module.scss';

const Menu = () => {
  return (
    <ul className={style.container}>
      <Link href="/logout">
        <a>
          <li className={style['menu-item']}>ログアウト</li>
        </a>
      </Link>
    </ul>
  );
};

export default Menu;
