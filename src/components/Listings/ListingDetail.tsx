import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config/axiosConfig';
import {
  useComments,
  useCreateComment,
  useDeleteComment,
} from '../../hooks/useCommentsQueries';
import {
  useDeleteListing,
  useListing,
  useToggleFavorite,
} from '../../hooks/useListingsQueries';
import { useAuthStore } from '../../store/authStore';
import styles from './ListingDetail.module.scss';

export const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [newComment, setNewComment] = useState('');

  const {
    data: listing,
    isLoading: listingLoading,
    error: listingError,
  } = useListing(id!);
  const { data: comments, isLoading: commentsLoading } = useComments(id!);

  const toggleFavoriteMutation = useToggleFavorite();
  const deleteListingMutation = useDeleteListing();
  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();

  const normalizedPhotos = useMemo(() => {
    const photos = listing?.photos ?? [];
    return photos.map((p) =>
      p.startsWith('http')
        ? p
        : `${API_BASE_URL}${p.startsWith('/') ? '' : '/'}${p}`,
    );
  }, [listing?.photos]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleFavoriteMutation.mutate(id!);
  };

  const handleDeleteListing = () => {
    if (window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      deleteListingMutation.mutate(id!, {
        onSuccess: () => {
          navigate('/dashboard');
        },
      });
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    createCommentMutation.mutate(
      {
        content: newComment,
        announcementId: id!,
      },
      {
        onSuccess: () => {
          setNewComment('');
        },
      },
    );
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  if (listingLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (listingError || !listing) {
    return <div className={styles.error}>Объявление не найдено</div>;
  }
  const isOwner = user?.id === listing.userId;
  const canEdit = isAuthenticated && isOwner;

  return (
    <div className={styles.container}>
      <div className={styles.listing}>
        <div className={styles.header}>
          <h1 className={styles.title}>{listing.title}</h1>
          <div className={styles.actions}>
            {isAuthenticated && (
              <button
                onClick={handleToggleFavorite}
                className={`${styles.favoriteButton} ${listing.isFavorite ? styles.favorited : ''}`}
                disabled={toggleFavoriteMutation.isPending}
                aria-pressed={listing.isFavorite}
              >
                {listing.isFavorite ? 'В избранном' : 'В избранное'}
              </button>
            )}
            {canEdit && (
              <button
                onClick={handleDeleteListing}
                className={styles.deleteButton}
                disabled={deleteListingMutation.isPending}
              >
                {deleteListingMutation.isPending ? 'Удаление...' : 'Удалить'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.photos}>
            {normalizedPhotos && normalizedPhotos.length > 0 ? (
              <div className={styles.photoGrid}>
                {normalizedPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Фото ${index + 1}`}
                    className={styles.photo}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.noPhotos}>Нет фотографий</div>
            )}
          </div>

          <div className={styles.details}>
            <div className={styles.description}>
              <h3>Описание</h3>
              <p>{listing.description}</p>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <strong>Тип животного:</strong>
                <span>{listing.animalType}</span>
              </div>
              {listing.breed && (
                <div className={styles.infoItem}>
                  <strong>Порода:</strong>
                  <span>{listing.breed}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <strong>Местоположение:</strong>
                <span>{listing.location}</span>
              </div>
              <div className={styles.infoItem}>
                <strong>Дата пропажи:</strong>
                <span>
                  {new Date(listing.dateLost).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className={styles.infoItem}>
                <strong>Контактный телефон:</strong>
                <a
                  href={`tel:${listing.contactPhone}`}
                  className={styles.phoneLink}
                >
                  {listing.contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.commentsSection}>
        <h2>Комментарии</h2>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Добавить комментарий..."
              className={styles.commentInput}
              rows={3}
              disabled={createCommentMutation.isPending}
            />
            <button
              type="submit"
              className={styles.commentSubmit}
              disabled={!newComment.trim() || createCommentMutation.isPending}
            >
              {createCommentMutation.isPending ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        ) : (
          <p className={styles.loginPrompt}>
            <a href="/login">Войдите</a>, чтобы оставить комментарий
          </p>
        )}

        <div className={styles.commentsList}>
          {commentsLoading ? (
            <p>Загрузка комментариев...</p>
          ) : comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <strong>{comment.author.email}</strong>
                  <span className={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                  {isAuthenticated &&
                    (user?.id === comment.authorId ||
                      user?.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className={styles.deleteCommentButton}
                        disabled={deleteCommentMutation.isPending}
                      >
                        Удалить
                      </button>
                    )}
                </div>
                <p className={styles.commentContent}>{comment.content}</p>
              </div>
            ))
          ) : (
            <p className={styles.noComments}>Пока нет комментариев</p>
          )}
        </div>
      </div>
    </div>
  );
};
