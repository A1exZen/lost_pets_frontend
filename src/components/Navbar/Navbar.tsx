import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { Logout } from '../Auth';

export const Navbar: React.FC = () => { 
  const { user } = useAuth(); 
  
  return ( 
    <header className={styles.header}> 
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Pet</span>
          <span className={styles.logoHighlight}>Finder</span>
        </Link>

        <nav className={styles.navLinks}>
          {user ? ( 
            <> 
              <Link to="/dashboard" className={styles.link}>Личный кабинет</Link> 
              <div className={styles.logout}>
                <Logout /> 
              </div>
            </> 
          ) : ( 
            <> 
              <Link to="/login" className={styles.link}>Вход</Link> 
              <Link to="/register" className={`${styles.link} ${styles.link_primary}`}>Регистрация</Link> 
            </> 
          )} 
        </nav>
      </div>
    </header> 
  ); 
};