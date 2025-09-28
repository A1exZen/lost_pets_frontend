import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.scss';

type FormData = { email: string; password: string };

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setError('');
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Вход</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <div className={styles.inputRow}>
              <div className={styles.inputWrapper}>
                <input
                  {...register('email', {
                    required: 'Email обязателен',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Неверный формат email',
                    },
                  })}
                  placeholder="Email"
                  className={styles.input}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Пароль обязателен',
                    minLength: { value: 6, message: 'Минимум 6 символов' },
                  })}
                  placeholder="Пароль"
                  className={styles.input}
                  disabled={isLoading}
                />
              </div>
            </div>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
            {error && <p className={styles.error}>{error}</p>}
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};
