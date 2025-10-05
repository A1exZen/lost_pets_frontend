import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Logout } from '../Auth';
import styles from './Navbar.module.scss';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  console.log(user);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Pet</span>
          <span className={styles.logoHighlight}>Finder</span>
        </Link>

        <nav className={styles.navLinks}>
          <Link to="/listings" className={styles.link}>
            Объявления
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={styles.link}>
                Личный кабинет
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className={styles.link}>
                  Админ панель
                </Link>
              )}
              <Link to="/create-listing" className={styles.link}>
                Создать объявление
              </Link>
              <div className={styles.logout}>
                <Logout />
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link}>
                Вход
              </Link>
              <Link
                to="/register"
                className={`${styles.link} ${styles.link_primary}`}
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
