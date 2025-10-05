import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import styles from './Auth.module.scss';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Register error:', err);
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
            </div>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
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
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.inputRow}>
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
