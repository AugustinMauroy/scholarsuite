'use client';
import { useState, useEffect } from 'react';
import ReviewPresenceCard from '../ReviewPresenceCard';
import styles from './index.module.css';
import type { Class, Presence, Student, TimeSlot } from '@prisma/client';
import type { FC } from 'react';

type PresenceState = Presence & {
  student: Student & {
    class: Class | null;
  };
  timeSlot: TimeSlot;
};

const ReviewPresence: FC = () => {
  const [presence, setPresence] = useState<PresenceState[]>([]);

  useEffect(() => {
    fetch('/api/presence')
      .then(response => response.json())
      .then(data => setPresence(data.data));
  }, []);

  const handleProcessed = async (id: Number) => {
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

  return (
    <main className={styles.wrapper}>
      {presence.map(presence => (
        <ReviewPresenceCard
          key={presence.id}
          presence={presence}
          onClick={handleProcessed}
        />
      ))}
    </main>
  );
};

export default ReviewPresence;
