import Image from 'next/image';
import classNames from 'classnames';
import styles from './index.module.css';
import type { FC } from 'react';

type StudentCardProps = {
  state?: 'present' | 'absent' | 'late';
  name: string;
  image: string;
  onContextMenu?: () => void;
  onClick?: () => void;
};

const StudentCard: FC<StudentCardProps> = ({
  state,
  name,
  onContextMenu,
  onClick,
  image,
}) => (
  <div className={styles.card} onContextMenu={onContextMenu} onClick={onClick}>
    <div className={styles.imgWrapper}>
      <Image src={image} alt="Avatar" width={160} height={90} />
    </div>
    <div className={classNames(styles.state, state && styles[state])}>
      {state}
    </div>
    <p className={styles.name}>{name}</p>
  </div>
);

export default StudentCard;
