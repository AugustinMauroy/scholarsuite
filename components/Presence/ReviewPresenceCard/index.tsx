import {
  CheckIcon,
  CheckCircleIcon,
  BellAlertIcon,
} from '@heroicons/react/24/solid';
import classNames from 'classnames';
import type { Class, Presence, Student, TimeSlot } from '@prisma/client';
import type { FC } from 'react';

type ReviewPresenceCardProps = {
  presence: Presence & {
    student: Student & {
      class: Class | null;
    };
    timeSlot: TimeSlot;
  };
  onClick: (id: number) => void;
};

const ReviewPresenceCard: FC<ReviewPresenceCardProps> = ({
  presence,
  onClick,
}) => (
  <div
    className={classNames(
      'flex flex-col gap-2 rounded border p-2 transition-colors duration-200 ease-in-out',
      { 'bg-gray-100 dark:bg-gray-800': presence.processed },
      { 'border-brand-500 bg-white dark:bg-gray-900': !presence.processed }
    )}
  >
    <div className="flex flex-row items-center justify-between">
      <button
        onClick={() => onClick(presence.id)}
        disabled={presence.processed}
        className="size-fit rounded p-1 enabled:hover:bg-gray-100 enabled:hover:dark:bg-gray-800"
      >
        {presence.processed ? (
          <CheckCircleIcon className="size-5 text-green-500 dark:text-green-400" />
        ) : (
          <CheckIcon className="size-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      {presence.student.contactEmail && (
        <button className="flex size-fit items-center justify-between gap-2 rounded p-1 hover:bg-gray-100 hover:dark:bg-gray-800">
          <BellAlertIcon className="size-5 fill-current hover:animate-pulse" />
          Notify
        </button>
      )}
    </div>
    <span>{new Date(presence.date).toLocaleDateString()}</span>
    <span>{presence.timeSlot.name}</span>
    <span>
      {presence.student.firstName} {presence.student.lastName}{' '}
      <small className="text-gray-500 dark:text-gray-400">
        ({presence.student.class?.name})
      </small>
    </span>
    <span>{presence.state}</span>
  </div>
);

export default ReviewPresenceCard;
