'use client';
import classNames from 'classnames';
import { useState, useEffect, useMemo } from 'react';
import Button from '@/components/Common/Button';
import ReviewPresenceCard from '../ReviewPresenceCard';
import styles from './index.module.css';
import type {
  Class,
  Presence,
  Student,
  TimeSlot,
  User,
  PresenceAudit,
} from '@prisma/client';
import type { FC } from 'react';

type PresenceState = Presence & {
  student: Student & {
    class: Class | null;
  };
  timeSlot: TimeSlot;
  user: User;
  PresenceAudit: (PresenceAudit & { user: User })[];
};

const LIMIT = 5;

const ReviewPresence: FC = () => {
  const [presence, setPresence] = useState<PresenceState[]>([]);
  const [page, setPage] = useState<number>(0);
  const [max, setMax] = useState<number | null>(null);

  const pageList = useMemo(() => {
    if (max === null || max === 0) return [];

    const maxPage = Math.ceil(max / LIMIT);

    return Array.from({ length: maxPage }, (_, i) => i);
  }, [max]);

  useEffect(() => {
    fetch('/api/presence/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pagination: {
          page,
          limit: LIMIT,
        },
      }),
    })
      .then(response => response.json())
      .then(data => {
        setPresence(data.data);
        setMax(data.max);
      });
  }, [page]);

  const handleProcessed = async (id: number) => {
    const response = await fetch('/api/presence/review', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, processed: true }),
    });

    if (response.ok) {
      const data = await response.json();

      setPresence(presence =>
        presence.map(p =>
          p.id === data.data.id ? { ...p, processed: true } : p
        )
      );
    }
  };

  const handleExcused = async (id: number) => {
    const response = await fetch('/api/presence/review', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, state: 'EXCUSED' }),
    });

    if (response.ok) {
      const data = await response.json();

      setPresence(presence =>
        presence.map(p =>
          p.id === data.data.id ? { ...p, state: 'EXCUSED' } : p
        )
      );
    }
  };

  return (
    <main className={styles.wrapper}>
      {presence.length === 0 && (
        <h2 className={styles.empty}>There is no presence to review</h2>
      )}
      {presence.length > 0 && (
        <>
          <div className={styles.pagination}>
            <Button
              kind="outline"
              onClick={() => setPage(page => Math.max(page - 1, 0))}
              disabled={page === 0}
            >
              Previous
            </Button>
            {pageList.map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={classNames([
                  { [styles.active]: p === page },
                  styles.page,
                ])}
              >
                {p + 1}
              </button>
            ))}
            <Button
              kind="outline"
              onClick={() =>
                setPage(page => Math.min(page + 1, pageList.length))
              }
              disabled={page === pageList.length - 1}
            >
              Next
            </Button>
          </div>
          {presence.map(presence => (
            <ReviewPresenceCard
              key={presence.id}
              presence={presence}
              processPresence={handleProcessed}
              notifyStudent={() => {}}
              justifyPresence={handleExcused}
            />
          ))}
        </>
      )}
    </main>
  );
};

export default ReviewPresence;
