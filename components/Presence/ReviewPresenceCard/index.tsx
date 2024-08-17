import classNames from 'classnames';
import { CheckIcon, CheckCircleIcon, BellIcon } from 'lucide-react';
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

type ReviewPresenceCardProps = {
  presence: Presence & {
    student: Student & {
      class: Class | null;
    };
    user: User;
    timeSlot: TimeSlot;
    PresenceAudit: (PresenceAudit & { user: User })[];
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
    {presence.PresenceAudit.length > 0 && (
      <div className={styles.audit}>
        <h4>Audit :</h4>
        <ul>
          {presence.PresenceAudit.map(audit => (
            <li key={audit.id}>
              {new Date(audit.date).toLocaleString()} - {audit.user.firstName}{' '}
              {audit.user.lastName} - {audit.state}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default ReviewPresenceCard;
