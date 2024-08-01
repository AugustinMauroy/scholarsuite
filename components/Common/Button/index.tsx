import classNames from 'classnames';
import { forwardRef } from 'react';
import styles from './index.module.css';
import type { FC, ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: 'solid' | 'outline' | 'danger';
};
const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, kind = 'solid', className, ...props }, ref) => (
    <button
      ref={ref}
      className={classNames(styles.button, styles[kind], className)}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';

export default Button;
