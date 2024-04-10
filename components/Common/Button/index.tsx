import classNames from 'classnames';
import styles from './index.module.css';
import type { FC, ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: 'solid' | 'outline' | 'danger';
};

const Button: FC<ButtonProps> = ({ children, kind, ...props }) => (
  <button
    className={classNames(styles.button, styles[kind ?? 'solid'])}
    {...props}
  >
    {children}
  </button>
);

export default Button;
