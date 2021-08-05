import { FC } from 'react';
import styles from './styles.module.scss';
import SignInButton from '../SignInButton';
import ActiveLink from './components/ActiveLink';

const Header: FC = () => {
  return (
    <header className={styles.header__container}>
      <div className={styles.header__content}>
        <img src="/images/logo.svg" alt="ig.news" />

        <nav>
          <ActiveLink activeClassName={styles.link__active} href="/">
            <a>Home</a>
          </ActiveLink>

          <ActiveLink activeClassName={styles.link__active} href="/posts" prefetch>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}

export default Header;