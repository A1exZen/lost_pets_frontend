import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import styles from './Auth.module.scss';

export const Logout: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.logoutWrapper}>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Выйти
      </button>
    </div>
  );
};
