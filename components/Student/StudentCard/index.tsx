import * as AvatarPrimitive from '@radix-ui/react-avatar';
import classNames from 'classnames';
import { getAcronymFromString } from '@/utils/string';
import styles from './index.module.css';
import type { FC } from 'react';

type StudentCardProps = {
  state?: 'present' | 'absent' | 'late' | 'excused';
  firstName: string;
  lastName: string;
  image?: string;
  onContextMenu?: () => void;
  onClick?: () => void;
};

const StudentCard: FC<StudentCardProps> = ({
  state,
  firstName,
  lastName,
  onContextMenu,
  onClick,
  image,
}) => (
  <div className={styles.card} onContextMenu={onContextMenu} onClick={onClick}>
    <AvatarPrimitive.Root className={styles.avatar}>
      <AvatarPrimitive.Image
        loading="lazy"
        src={image}
        alt={getAcronymFromString(firstName + ' ' + lastName)}
        className={styles.avatar}
        height={240}
        width={160}
      />
      <AvatarPrimitive.Fallback delayMs={500} className={styles.avatar}>
        {getAcronymFromString(firstName + ' ' + lastName)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
    <div className={classNames(styles.state, state && styles[state])}>
      {state}
    </div>
    <p className={styles.firstName}>{firstName}</p>
    <p className={styles.lastName}>{lastName}</p>
  </div>
);

export default StudentCard;
