import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateListing } from '../../hooks/useListingsQueries';
import type { CreateListingInput } from '../../types/listings';
import styles from './CreateListingForm.module.scss';

const ANIMAL_TYPES = ['Собака', 'Кошка', 'Птица', 'Другое'];

export const CreateListingForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateListingInput>();

  const createListingMutation = useCreateListing();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<File[]>([]);

  const onSubmit = async (data: CreateListingInput) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });

      photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      await createListingMutation.mutateAsync(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Create listing error:', err);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos(files);
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Создать объявление</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Заголовок</label>
            <input
              {...register('title', { required: 'Заголовок обязателен' })}
              className={styles.input}
              placeholder="Потерялась собака породы лабрадор..."
              disabled={createListingMutation.isPending}
            />
            {errors.title && (
              <p className={styles.error}>{errors.title.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Описание</label>
            <textarea
              {...register('description', { required: 'Описание обязательно' })}
              className={styles.textarea}
              rows={4}
              placeholder="Подробное описание животного..."
              disabled={createListingMutation.isPending}
            />
            {errors.description && (
              <p className={styles.error}>{errors.description.message}</p>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Тип животного</label>
              <select
                {...register('animalType', {
                  required: 'Выберите тип животного',
                })}
                className={styles.select}
                disabled={createListingMutation.isPending}
              >
                <option value="">Выберите тип</option>
                {ANIMAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.animalType && (
                <p className={styles.error}>{errors.animalType.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Порода</label>
              <input
                {...register('breed')}
                className={styles.input}
                placeholder="Порода животного"
                disabled={createListingMutation.isPending}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Местоположение</label>
              <input
                {...register('location', {
                  required: 'Местоположение обязательно',
                })}
                className={styles.input}
                placeholder="Где пропало животное"
                disabled={createListingMutation.isPending}
              />
              {errors.location && (
                <p className={styles.error}>{errors.location.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Дата пропажи</label>
              <input
                {...register('dateLost', {
                  required: 'Дата пропажи обязательна',
                })}
                type="date"
                className={styles.input}
                disabled={createListingMutation.isPending}
              />
              {errors.dateLost && (
                <p className={styles.error}>{errors.dateLost.message}</p>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Контакты</label>
            <input
              {...register('contactPhone', {
                required: 'Контактный телефон обязателен',
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: 'Неверный формат телефона',
                },
              })}
              className={styles.input}
              placeholder="+375291111111"
              disabled={createListingMutation.isPending}
            />
            {errors.contactPhone && (
              <p className={styles.error}>{errors.contactPhone.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Фотографии</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              className={styles.fileInput}
              disabled={createListingMutation.isPending}
            />
            {photos.length > 0 && (
              <div className={styles.photosPreview}>
                {photos.map((photo, index) => (
                  <div key={index} className={styles.photoPreview}>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className={styles.previewImage}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {createListingMutation.error && (
            <p className={styles.error}>
              {createListingMutation.error.message ||
                'Ошибка создания объявления'}
            </p>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className={styles.cancelButton}
              disabled={createListingMutation.isPending}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={createListingMutation.isPending}
            >
              {createListingMutation.isPending
                ? 'Создание...'
                : 'Создать объявление'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
