import { InformationCircleIcon } from '@heroicons/react/24/outline';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import classNames from 'classnames';
import Link from 'next/link';
import { getAcronymFromString } from '@/utils/string';
import styles from './index.module.css';
import type { PresenceState } from '@prisma/client';
import type { FC } from 'react';

type StudentCardProps = {
  state?: PresenceState;
  firstName: string;
  lastName: string;
  id: number;
  from?: string;
  image?: string;
  onContextMenu?: () => void;
  onClick?: () => void;
};

const StudentCard: FC<StudentCardProps> = ({
  state,
  firstName,
  lastName,
  id,
  from,
  onContextMenu,
  onClick,
  image,
}) => (
  <div
    className={styles.card}
    onClick={onClick}
    onContextMenu={e => {
      e.preventDefault();
      onContextMenu && onContextMenu();
    }}
  >
    <div className={styles.info}>
      <Link
        href={`/student/${id}${from ? '?' + new URLSearchParams({ from: from }).toString() : ''}`}
      >
        <InformationCircleIcon />
      </Link>
    </div>
    <AvatarPrimitive.Root className={styles.avatar}>
      <AvatarPrimitive.Image
        loading="lazy"
        src={image}
        alt={getAcronymFromString(firstName + ' ' + lastName)}
        className={styles.image}
        height={240}
        width={160}
      />
      <AvatarPrimitive.Fallback delayMs={250} className={styles.fallback}>
        {getAcronymFromString(firstName + ' ' + lastName)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
    <p
      className={classNames(
        styles.state,
        state && styles[state.toLocaleLowerCase()]
      )}
    >
      {state}
    </p>
    <p className={styles.firstName}>{firstName}</p>
    <p className={styles.lastName}>{lastName}</p>
  </div>
);

export default StudentCard;
