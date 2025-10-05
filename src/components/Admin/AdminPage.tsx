import React, { useEffect, useMemo, useState } from 'react';
import { listingsApi } from '../../api/listings';
import { usersApi } from '../../api/users';
import styles from './AdminPage.module.scss';

type Stats = {
  totalListings: number;
  last30Days: number;
  byType: Record<string, number>;
  topLocations: Array<{ location: string; count: number }>;
};

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const pageSize = 100;
        let offset = 0;
        let all: any[] = [];
        while (true) {
          const res = await listingsApi.search({ limit: pageSize, offset });
          all = all.concat(res.listings || []);
          if (!res.hasNext) break;
          offset += pageSize;
        }

        const now = Date.now();
        const last30 = new Date(now - 30 * 24 * 60 * 60 * 1000);
        const byType: Record<string, number> = {};
        const byLocation: Record<string, number> = {};

        for (const l of all) {
          const type = (l.animalType || 'Не указан').toString();
          byType[type] = (byType[type] || 0) + 1;

          const loc = (l.location || 'Не указано').toString();
          byLocation[loc] = (byLocation[loc] || 0) + 1;
        }

        const last30Count = all.filter((l) => {
          const d = new Date(l.createdAt || l.dateLost);
          return d >= last30;
        }).length;

        const topLocations = Object.entries(byLocation)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([location, count]) => ({ location, count }));

        setStats({
          totalListings: all.length,
          last30Days: last30Count,
          byType,
          topLocations,
        });
        // подгружаем пользователей для таблицы
        setUsersLoading(true);
        try {
          const list = await usersApi.getAll();
          setUsers(list);
        } finally {
          setUsersLoading(false);
        }
      } catch (e) {
        setError('Не удалось загрузить статистику');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = useMemo(() => {
    if (!stats) return [] as any[];
    return [
      { title: 'Всего объявлений', value: stats.totalListings },
      { title: 'За последние 30 дней', value: stats.last30Days },
    ];
  }, [stats]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Админ-панель</h1>

      <section className={styles.section}>
        {loading ? (
          <p>Загрузка...</p>
        ) : error ? (
          <p style={{ color: 'crimson' }}>{error}</p>
        ) : stats ? (
          <>
            <div className={styles.cards}>
              {cards.map((c) => (
                <div key={c.title} className={styles.card}>
                  <div className={styles.cardTitle}>{c.title}</div>
                  <div className={styles.cardValue}>{c.value}</div>
                </div>
              ))}
            </div>

            <div className={styles.section}>
              <h3>По типам</h3>
              <div className={styles.subgrid}>
                {Object.entries(stats.byType).map(([type, count]) => (
                  <div key={type} className={styles.pill}>
                    <div className={styles.pillTitle}>{type}</div>
                    <div className={styles.pillValue}>{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>

      <section className={styles.section}>
        <h2>Пользователи</h2>
        {usersLoading ? (
          <p>Загрузка...</p>
        ) : users.length === 0 ? (
          <p>Пока нет пользователей.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Роль</th>
                  <th className={styles.th}>Создан</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className={styles.td}>{u.email}</td>
                    <td className={styles.td}>{u.role}</td>
                    <td className={styles.td}>
                      {new Date(u.createdAt).toLocaleString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
