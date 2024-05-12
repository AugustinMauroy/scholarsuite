import {
  CheckIcon,
  CheckCircleIcon,
  BellAlertIcon,
} from '@heroicons/react/24/solid';
import classNames from 'classnames';
import styles from './index.module.css';
import type { Class, Presence, Student, TimeSlot } from '@prisma/client';
import type { FC } from 'react';

type ReviewPresenceCardProps = {
  presence: Presence & {
    student: Student & {
      class: Class | null;
    };
    timeSlot: TimeSlot;
  };
  processPresence: (id: number) => void;
  notifyStudent: (id: number) => void;
};

const ReviewPresenceCard: FC<ReviewPresenceCardProps> = ({
  presence,
  processPresence,
  notifyStudent,
}) => (
  <div
    className={classNames(styles.wrapper, {
      [styles.processed]: presence.processed,
      [styles.pending]: !presence.processed,
    })}
  >
    <div className={styles.actions}>
      <button
        onClick={() => processPresence(presence.id)}
        disabled={presence.processed}
      >
        {presence.processed ? (
          <CheckCircleIcon className={styles.doneIcon} />
        ) : (
          <CheckIcon className={styles.todoIcon} />
        )}
      </button>
      {presence.student.contactEmail && !presence.notified && (
        <button
          disabled={presence.notified}
          onClick={() => notifyStudent(presence.id)}
        >
          <BellAlertIcon className={styles.notifyIcon} />
          Notify
        </button>
      )}
    </div>
    <span>{new Date(presence.date).toLocaleDateString()}</span>
    <span>{presence.timeSlot.name}</span>
    <span>
      {presence.student.firstName} {presence.student.lastName}{' '}
      <small className={styles.class}>({presence.student.class?.name})</small>
    </span>
    <span>{presence.state}</span>
  </div>
);

export default ReviewPresenceCard;
