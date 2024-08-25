import classNames from 'classnames';
import styles from './index.module.css';
import type { FC, PropsWithChildren } from 'react';

type BadgeProps = PropsWithChildren<{
  kind?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  className?: string;
  onClick?: () => void;
}>;

const Badge: FC<BadgeProps> = ({
  children,
  kind = 'primary',
  onClick,
  className,
}) => (
  <span
    className={classNames(className, styles.badge, styles[kind])}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
  >
    {children}
  </span>
);

export default Badge;
