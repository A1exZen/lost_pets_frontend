import React from 'react';
import styles from './PetList.module.scss';
import { PetCard } from '../PetCard';
import type { Pet } from '@/types/Pet';

interface PetListProps {
  pets: Pet[];
  showActions?: boolean;
  onDelete?: (id: number) => void;
}

export const PetList: React.FC<PetListProps> = ({
  pets,
  showActions,
  onDelete,
}) => {
  if (pets.length === 0)
    return <p className={styles.noPets}>Питомцы не найдены</p>;

  return (
    <div className={styles.listContainer}>
      <div className={styles.list}>
        {pets.map((pet, index) => (
          <PetCard
            key={pet.id}
            pet={pet}
            showActions={showActions}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
