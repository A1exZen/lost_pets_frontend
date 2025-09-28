import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.scss';
import { useAuth } from '@/hooks/useAuth';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

export const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: { email: '', password: '', confirmPassword: '', name: '' },
  });
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    setError('');
    setIsLoading(true);
    try {
      await registerUser(data.email, data.password, data.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Регистрация</h2>
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
                  {...register('name', { required: 'Имя обязательно' })}
                  placeholder="Имя"
                  className={styles.input}
                  disabled={isLoading}
                />
              </div>
            </div>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
            {errors.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <div className={styles.inputRow}>
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
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Подтверждение пароля обязательно',
                    validate: (value) =>
                      value === password || 'Пароли не совпадают',
                  })}
                  placeholder="Подтвердите пароль"
                  className={styles.input}
                  disabled={isLoading}
                />
              </div>
            </div>
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword.message}</p>
            )}
            {error && <p className={styles.error}>{error}</p>}
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
};
