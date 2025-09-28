import { useAuth } from '@/hooks/useAuth';
import { addPet } from '@/services/api';
import type { Pet } from '@/types/Pet';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { petTypes } from './constants';
import styles from './PetForm.module.scss';

type FormData = Omit<Pet, 'id' | 'userId'>;

export const PetForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      type: '',
      breed: '',
      photo: '',
      description: '',
      contacts: '',
      dateLost: '',
    },
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      setError('Требуется авторизация');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await addPet({ ...data, userId: user.id });
      navigate('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ошибка добавления питомца',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Добавить питомца</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            {...register('name', { required: 'Кличка обязательна' })}
            placeholder="Кличка"
            className={styles.input}
            disabled={isLoading}
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <select
            {...register('type', { required: 'Вид обязателен' })}
            className={styles.input}
            disabled={isLoading}
          >
            <option value="" disabled>
              Выберите вид
            </option>
            {petTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && <p className={styles.error}>{errors.type.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <input
            {...register('breed')}
            placeholder="Порода"
            className={styles.input}
            disabled={isLoading}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            {...register('photo', { required: 'URL фото обязателен' })}
            placeholder="URL фото"
            className={styles.input}
            onChange={(e) => setPreview(e.target.value)}
            disabled={isLoading}
          />
          {errors.photo && (
            <p className={styles.error}>{errors.photo.message}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <textarea
            {...register('description', { required: 'Описание обязательно' })}
            placeholder="Описание"
            className={styles.textarea}
            disabled={isLoading}
          />
          {errors.description && (
            <p className={styles.error}>{errors.description.message}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <input
            {...register('contacts', { required: 'Контакты обязательны' })}
            placeholder="Контакты"
            className={styles.input}
            disabled={isLoading}
          />
          {errors.contacts && (
            <p className={styles.error}>{errors.contacts.message}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <input
            type="date"
            {...register('dateLost', { required: 'Дата пропажи обязательна' })}
            className={styles.input}
            disabled={isLoading}
          />
          {errors.dateLost && (
            <p className={styles.error}>{errors.dateLost.message}</p>
          )}
        </div>
        {preview && (
          <img src={preview} alt="Preview" className={styles.preview} />
        )}
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Добавить'}
        </button>
      </form>
    </div>
  );
};
