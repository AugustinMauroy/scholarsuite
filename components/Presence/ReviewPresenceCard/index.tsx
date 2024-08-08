import classNames from 'classnames';
import { CheckIcon, CheckCircleIcon, BellIcon } from 'lucide-react';
import styles from './index.module.css';
import type { Class, Presence, Student, TimeSlot, User } from '@prisma/client';
import type { FC } from 'react';

type ReviewPresenceCardProps = {
  presence: Presence & {
    student: Student & {
      class: Class | null;
    };
    user: User;
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
          <BellIcon className={styles.notifyIcon} />
          Notify
        </button>
      )}
    </div>
    <span>
      {new Date(presence.date).toLocaleDateString() +
        ' ' +
        presence.timeSlot.name}
    </span>
    <span>
      {presence.student.firstName} {presence.student.lastName}{' '}
      <small className={styles.class}>({presence.student.class?.name})</small>
    </span>
    <span>
      By {presence.user.firstName} {presence.user.lastName}
    </span>
    <span>{presence.state}</span>
  </div>
);

export default ReviewPresenceCard;
