import React from 'react';
import styles from './Auth.module.scss';
import { useAuth } from '@/hooks/useAuth';

export const Logout: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className={styles.logoutWrapper}>
      <button onClick={logout} className={styles.logoutButton}>
        Выйти
      </button>
    </div>
  );
};
