import classNames from 'classnames';
import styles from './index.module.css';
import type { FC, PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{
  className?: string;
}>;

const Card: FC<CardProps> = ({ children, className }) => (
  <div className={classNames(className, styles.card)}>{children}</div>
);

export default Card;
