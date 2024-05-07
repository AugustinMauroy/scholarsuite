import classNames from 'classnames';
import styles from './index.module.css';
import type { FC, PropsWithChildren, ReactNode } from 'react';

type BadgeProps = PropsWithChildren<{
  kind?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  onClick?: () => void;
}>;

const Badge: FC<BadgeProps> = ({ children, kind = 'primary', onClick }) => (
  <span
    className={classNames(styles.badge, styles[kind])}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
  >
    {children}
  </span>
);

export default Badge;
