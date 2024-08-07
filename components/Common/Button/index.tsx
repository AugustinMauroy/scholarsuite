import classNames from 'classnames';
import { forwardRef } from 'react';
import styles from './index.module.css';
import type { FC, ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: 'solid' | 'outline';
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'light';
};

const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, kind = 'solid', variant = 'primary', className, ...props },
    ref
  ) => (
    <button
      ref={ref}
      className={classNames(
        styles.button,
        styles[kind],
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';

export default Button;
