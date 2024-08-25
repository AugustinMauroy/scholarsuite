import classNames from 'classnames';
import { CheckIcon, CheckCircleIcon, BellIcon, UserCheck } from 'lucide-react';
import { useFormatter } from 'next-intl';
import Badge from '@/components/Common/Badge';
import styles from './index.module.css';
import type {
  Class,
  Presence,
  Student,
  TimeSlot,
  User,
  PresenceAudit,
} from '@prisma/client';
import type { DateTimeFormatOptions } from 'next-intl';
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
  processPresence?: (id: number) => void;
  notifyStudent?: (id: number) => void;
  justifyPresence?: (id: number) => void;
};

const ReviewPresenceCard: FC<ReviewPresenceCardProps> = ({
  presence,
  processPresence,
  notifyStudent,
  justifyPresence,
}) => {
  const format = useFormatter();
  const formatConfig = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    minute: 'numeric',
  } as DateTimeFormatOptions;

  const getkind = (state: string) => {
    if (state === 'ABSENT') {
      return 'error';
    } else if (state === 'LATE') {
      return 'warning';
    } else if (state === 'EXCUSED') {
      return 'info';
    } else if (state === 'PRESENT') {
      return 'success';
    } else {
      return 'primary';
    }
  };

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.processed]: presence.processed,
        [styles.pending]: !presence.processed,
      })}
    >
      <div className={styles.actions}>
        <div>
          {processPresence && (
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
          )}
          {justifyPresence && presence.state !== 'EXCUSED' && (
            <button onClick={() => justifyPresence(presence.id)}>
              <UserCheck />
              Justify
            </button>
          )}
        </div>
        {presence.student.contactEmail &&
          !presence.notified &&
          notifyStudent && (
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
        {format.dateTime(new Date(presence.date), formatConfig)} -{' '}
        {presence.timeSlot.name}
      </span>
      <span>
        {presence.student.firstName} {presence.student.lastName}{' '}
        <small className={styles.class}>({presence.student.class?.name})</small>
      </span>
      <span>
        By {presence.user.firstName} {presence.user.lastName}
      </span>
      <Badge className={styles.badge} kind={getkind(presence.state)}>
        {presence.state}
      </Badge>
      {presence.PresenceAudit.length > 0 && (
        <details className={styles.audit}>
          <summary>History</summary>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>New state</th>
              </tr>
            </thead>
            <tbody>
              {presence.PresenceAudit.map(audit => (
                <tr key={audit.id}>
                  <td>
                    {format.dateTime(new Date(audit.changedAt), {
                      ...formatConfig,
                      hour: 'numeric',
                    })}
                  </td>
                  <td>
                    {audit.user.firstName} {audit.user.lastName}
                  </td>
                  <td>
                    <Badge kind={getkind(audit.state)}>{audit.state}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </div>
  );
};

export default ReviewPresenceCard;
