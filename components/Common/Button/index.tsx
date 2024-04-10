import classNames from 'classnames';
import styles from './index.module.css';
import type { FC, ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: 'solid' | 'outline' | 'danger';
};

const Button: FC<ButtonProps> = ({
  children,
  kind = 'solid',
  className,
  ...props
}) => (
  <button
    className={classNames(styles.button, styles[kind], className)}
    {...props}
  >
    {children}
  </button>
);

export default Button;
