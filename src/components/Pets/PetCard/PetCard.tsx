import type { Pet } from '@/types/Pet';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PetCard.module.scss';

interface PetCardProps {
  pet: Pet;
  showActions?: boolean;
  onDelete?: (id: number) => void;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  showActions,
  onDelete,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={pet.photo} alt={pet.name} className={styles.image} />
        <div className={styles.overlay}>
          <h3 className={styles.name}>{pet.name}</h3>
          <p className={styles.type}>{pet.type}</p>
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.label}>Порода:</span>
          <span>{pet.breed || 'Не указана'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Описание:</span>
          <span>{pet.description}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Контакты:</span>
          <span>{pet.contacts}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Дата пропажи:</span>
          <span>{pet.dateLost}</span>
        </div>
      </div>
      {showActions && (
        <div className={styles.actions}>
          <Link to={`/edit-pet/${pet.id}`} className={styles.editButton}>
            Редактировать
          </Link>
          <button
            onClick={() => onDelete?.(pet.id)}
            className={styles.deleteButton}
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
};
