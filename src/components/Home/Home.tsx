import React, { useEffect, useRef, useState } from 'react';

import { listingsApi } from '@/api/listings';
import type { Listing } from '@/types/listings';
import { ListingList } from '../Listings/ListingList';
import { Loading } from '../Loading';
import styles from './Home.module.scss';

export const Home: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await listingsApi.search();
        setListings(data.listings);
        setFilteredListings(data.listings);
      } catch {
        console.error('Error fetching listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    let result = listings;
    if (search)
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.description.toLowerCase().includes(search.toLowerCase()),
      );
    if (filterType)
      result = result.filter(
        (l) => l.animalType.toLowerCase() === filterType.toLowerCase(),
      );
    setFilteredListings(result);
    setPage(1);
  }, [search, filterType, listings]);

  const handleFind = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={styles['main-layout']}>
      <header className={styles['hero-section']}>
        <div className={styles['overlay']}>
          <h1 className={styles['hero-title']}>
            Найдите своего потерянного друга
          </h1>
          <p className={styles['hero-subtitle']}>
            Воссоедините питомцев с их семьями
          </p>
          <div className={styles['search-controls']}>
            <input
              type="text"
              placeholder="Поиск по названию"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles['search-input']}
              aria-label="Поиск по названию объявления"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={styles['filter-select']}
              aria-label="Фильтр по виду животного"
            >
              <option value="">Все виды</option>
              <option value="Кот">Кот</option>
              <option value="Собака">Собака</option>
              <option value="Птица">Птица</option>
              <option value="Другое">Другое</option>
            </select>
            <button
              onClick={handleFind}
              className={styles['find-button']}
              aria-label="Найти питомцев"
            >
              Найти
            </button>
          </div>
        </div>
      </header>
      <main className={styles['content']} ref={contentRef}>
        <ListingList
          showFilters={false}
          searchQuery={search}
          animalType={filterType}
        />
        <div className={styles['pagination']}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={styles['pagination-button']}
            aria-label="Предыдущая страница"
          >
            Назад
          </button>
          <span className={styles['pagination-info']}>Страница {page}</span>
          <button
            disabled={page * itemsPerPage >= filteredListings.length}
            onClick={() => setPage((p) => p + 1)}
            className={styles['pagination-button']}
            aria-label="Следующая страница"
          >
            Вперед
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
