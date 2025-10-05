import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { Logout } from '../Auth';

export const Navbar: React.FC = () => { 
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={`${styles.logoText} ${isScrolled ? styles.scrolled : ''}`}>Pet</span>
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
              <Link to="/login" className={`${styles.link} ${isScrolled ? styles.scrolled : ''}`}>Вход</Link>
              <Link to="/register" className={`${styles.link} ${styles.link_primary}`}>Регистрация</Link> 
            </> 
          )} 
        </nav>
      </div>
    </header> 
  ); 
};