import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites, useUserListings } from '../../hooks/useListingsQueries';
import { useAuthStore } from '../../store/authStore';
import styles from './Dashboard.module.scss';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { data: userListings, isLoading: listingsLoading } = useUserListings();
  const { data: favorites, isLoading: favoritesLoading } = useFavorites();

  if (listingsLoading || favoritesLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Личный кабинет</h1>
        {user && (
          <div className={styles.userInfo}>
            <p>Добро пожаловать, {user.email}!</p>
            <p>Роль: {user.role}</p>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Link to="/create-listing" className={styles.button}>
          Создать объявление
        </Link>
        <Link to="/listings" className={styles.button}>
          Все объявления
        </Link>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h2>Мои объявления ({userListings?.length || 0})</h2>
          {userListings && userListings.length > 0 ? (
            <div className={styles.listingsPreview}>
              {userListings.slice(0, 3).map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className={styles.listingPreview}
                >
                  <h3>{listing.title}</h3>
                  <p>
                    {listing.animalType} • {listing.location}
                  </p>
                  <span>
                    {new Date(listing.dateLost).toLocaleDateString('ru-RU')}
                  </span>
                </Link>
              ))}
              {userListings.length > 3 && (
                <Link to="/my-listings" className={styles.viewAll}>
                  Показать все ({userListings.length})
                </Link>
              )}
            </div>
          ) : (
            <p className={styles.empty}>У вас пока нет объявлений</p>
          )}
        </div>

        <div className={styles.section}>
          <h2>Избранное ({favorites?.length || 0})</h2>
          {favorites && favorites.length > 0 ? (
            <div className={styles.listingsPreview}>
              {favorites.slice(0, 3).map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className={styles.listingPreview}
                >
                  <h3>{listing.title}</h3>
                  <p>
                    {listing.animalType} • {listing.location}
                  </p>
                  <span>
                    {new Date(listing.dateLost).toLocaleDateString('ru-RU')}
                  </span>
                </Link>
              ))}
              {favorites.length > 3 && (
                <Link to="/favorites" className={styles.viewAll}>
                  Показать все ({favorites.length})
                </Link>
              )}
            </div>
          ) : (
            <p className={styles.empty}>У вас пока нет избранных объявлений</p>
          )}
        </div>
      </div>
    </div>
  );
};
