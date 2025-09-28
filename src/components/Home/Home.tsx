import React, { useEffect, useRef, useState } from 'react';
import { getPets } from '../../services/api';
import type { Pet } from '../../types/Pet';
import styles from './Home.module.scss';

export const Home: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getPets();
        setPets(data);
        setFilteredPets(data);
      } catch {
        console.error('Error fetching pets');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  useEffect(() => {
    let result = pets;
    if (search)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    if (filterType)
      result = result.filter(
        (p) => p.type.toLowerCase() === filterType.toLowerCase(),
      );
    setFilteredPets(result);
    setPage(1);
  }, [search, filterType, pets]);

  const paginatedPets = filteredPets.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleFind = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return <div className={styles['loading']}>Загрузка...</div>;

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
              placeholder="Поиск по кличке"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles['search-input']}
              aria-label="Поиск по кличке питомца"
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
        <PetList pets={paginatedPets} />
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
            disabled={page * itemsPerPage >= filteredPets.length}
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
