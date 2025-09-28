import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './PetForm.module.scss';
import type { Pet } from '@/types/Pet';
import { useAuth } from '@/hooks/useAuth';
import { getPetById, updatePet } from '@/services/api';
import { petTypes } from './constants';

type FormData = Omit<Pet, 'id' | 'userId'>;


const PetEdit: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
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
  const { id } = useParams<{ id: string }>();
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      getPetById(Number(id))
        .then(pet => {
          reset(pet);
          setPreview(pet.photo);
          setLoading(false);
        })
        .catch(() => {
          setError('Ошибка загрузки питомца');
          setLoading(false);
        });
    }
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    if (!user || !id) {
      setError('Требуется авторизация');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await updatePet(Number(id), { ...data });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления питомца');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error && !id) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Редактировать питомца</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            {...register('name', { required: 'Кличка обязательна' })}
            placeholder="Кличка"
            className={styles.input}
            disabled={loading}
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <select
            {...register('type', { required: 'Вид обязателен' })}
            className={styles.input}
            disabled={loading}
          >
            <option value="" disabled>Выберите вид</option>
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
            disabled={loading}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            {...register('photo', { required: 'URL фото обязателен' })}
            placeholder="URL фото"
            className={styles.input}
            onChange={(e) => setPreview(e.target.value)}
            disabled={loading}
          />
          {errors.photo && <p className={styles.error}>{errors.photo.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <textarea
            {...register('description', { required: 'Описание обязательно' })}
            placeholder="Описание"
            className={styles.textarea}
            disabled={loading}
          />
          {errors.description && <p className={styles.error}>{errors.description.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <input
            {...register('contacts', { required: 'Контакты обязательны' })}
            placeholder="Контакты"
            className={styles.input}
            disabled={loading}
          />
          {errors.contacts && <p className={styles.error}>{errors.contacts.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <input
            type="date"
            {...register('dateLost', { required: 'Дата пропажи обязательна' })}
            className={styles.input}
            disabled={loading}
          />
          {errors.dateLost && <p className={styles.error}>{errors.dateLost.message}</p>}
        </div>
        {preview && <img src={preview} alt="Preview" className={styles.preview} />}
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Загрузка...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
};

export default PetEdit;