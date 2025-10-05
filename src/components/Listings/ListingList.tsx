import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/axiosConfig';
import { useListings } from '../../hooks/useListingsQueries';
import { useListingStore } from '../../store/listingStore';
import styles from './ListingList.module.scss';
import { SearchFilters } from './SearchFilters';

type Props = {
  showFilters?: boolean;
  searchQuery?: string;
  animalType?: string;
};

export const ListingList: React.FC<Props> = ({
  showFilters = true,
  searchQuery,
  animalType,
}) => {
  const { filters } = useListingStore();
  const { data: listingsResponse, isLoading, error } = useListings(filters);

  const listings = listingsResponse?.listings || [];
  const filteredByQuery = searchQuery
    ? listings.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : listings;
  const filteredFinal = animalType
    ? filteredByQuery.filter(
        (l) => l.animalType.toLowerCase() === animalType.toLowerCase(),
      )
    : filteredByQuery;

  if (isLoading) {
    return (
      <div className={styles.container}>
        {showFilters && <SearchFilters />}
        <div className={styles.loading}>Загрузка объявлений...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        {showFilters && <SearchFilters />}
        <div className={styles.error}>
          Ошибка загрузки объявлений: {error.message}
        </div>
      </div>
    );
  }

  if (!filteredFinal || filteredFinal.length === 0) {
    return (
      <div className={styles.container}>
        {showFilters && <SearchFilters />}
        <div className={styles.noListings}>
          <h3>Объявления не найдены</h3>
          <p>
            Попробуйте изменить фильтры поиска или создать новое объявление.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showFilters && <SearchFilters />}

      {showFilters && (
        <div className={styles.listHeader}>
          <h2>Найдено объявлений: {listingsResponse?.total || 0}</h2>
        </div>
      )}

      <div className={styles.list}>
        {filteredFinal.map((listing) => (
          <Link
            key={listing.id}
            to={`/listing/${listing.id}`}
            className={styles.listingCard}
          >
            <div className={styles.photoSection}>
              {listing.photos && listing.photos.length > 0 ? (
                <img
                  src={
                    listing.photos[0].startsWith('http')
                      ? listing.photos[0]
                      : `${API_BASE_URL}${listing.photos[0].startsWith('/') ? '' : '/'}${listing.photos[0]}`
                  }
                  alt={listing.title}
                  className={styles.photo}
                />
              ) : (
                <div className={styles.noPhoto}>
                  <span>📷</span>
                </div>
              )}
            </div>

            <div className={styles.contentSection}>
              <div className={styles.header}>
                <h3 className={styles.title}>{listing.title}</h3>
                <span className={styles.date}>
                  {new Date(listing.dateLost).toLocaleDateString('ru-RU')}
                </span>
              </div>

              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Тип:</span>
                  <span className={styles.value}>{listing.animalType}</span>
                </div>
                {listing.breed && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Порода:</span>
                    <span className={styles.value}>{listing.breed}</span>
                  </div>
                )}
                <div className={styles.infoItem}>
                  <span className={styles.label}>Место:</span>
                  <span className={styles.value}>{listing.location}</span>
                </div>
              </div>

              <p className={styles.description}>
                {listing.description.length > 150
                  ? `${listing.description.substring(0, 150)}...`
                  : listing.description}
              </p>

              <div className={styles.footer}>
                <span className={styles.contact}>{listing.contactPhone}</span>
                {listing.isFavorite && (
                  <span className={styles.favorite}>❤️ В избранном</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
