import React from 'react';
import { useListingStore } from '../../store/listingStore';
import styles from './SearchFilters.module.scss';

const ANIMAL_TYPES = ['Собака', 'Кошка', 'Птица', 'Другое'];

export const SearchFilters: React.FC = () => {
  const { filters, setFilters, clearFilters } = useListingStore();

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handleDateChange = (key: 'dateFrom' | 'dateTo', value: string) => {
    setFilters({
      ...filters,
      [key]: value ? new Date(value) : undefined,
    });
  };

  return (
    <div className={styles.filtersCard}>
      <div className={styles.header}>
        <h3>Фильтры поиска</h3>
        <button onClick={clearFilters} className={styles.clearButton}>
          Очистить
        </button>
      </div>

      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Тип животного</label>
          <select
            value={filters.animalType || ''}
            onChange={(e) => handleFilterChange('animalType', e.target.value)}
            className={styles.select}
          >
            <option value="">Все типы</option>
            {ANIMAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Местоположение</label>
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="Введите город или район"
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Дата от</label>
          <input
            type="date"
            value={
              filters.dateFrom
                ? filters.dateFrom.toISOString().split('T')[0]
                : ''
            }
            onChange={(e) => handleDateChange('dateFrom', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Дата до</label>
          <input
            type="date"
            value={
              filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''
            }
            onChange={(e) => handleDateChange('dateTo', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.paginationControls}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Результатов на странице</label>
          <select
            value={filters.limit || 10}
            onChange={(e) => handleFilterChange('limit', e.target.value)}
            className={styles.select}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};
