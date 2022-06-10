import Link from 'next/link';
import style from './UserMenu.module.scss';

interface MenuProp {
  userId: string;
}

const Menu = ({ userId }: MenuProp) => {
  return (
    <ul className={style.container}>
      <Link href={`/user/${userId}`}>
        <a>
          <li className={style['menu-item']}>プロフィール</li>
        </a>
      </Link>
      <Link href="/logout">
        <a>
          <li className={style['menu-item']}>ログアウト</li>
        </a>
      </Link>
    </ul>
  );
};

export default Menu;
