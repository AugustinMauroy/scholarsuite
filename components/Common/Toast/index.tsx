import * as ToastPrimitive from '@radix-ui/react-toast';
import classNames from 'classnames';
import styles from './index.module.css';
import type { FC, ReactNode } from 'react';

type ToastProps = {
  open?: boolean;
  duration?: number;
  onChange?: (value: boolean) => void;
  children?: ReactNode;
  className?: string;
  kind?: 'info' | 'success' | 'error' | 'warning';
};

const Toast: FC<ToastProps> = ({
  open,
  duration = 5000,
  onChange,
  children,
  className,
  kind = 'info',
}) => (
  <ToastPrimitive.Root
    open={open}
    duration={duration}
    onOpenChange={onChange}
    className={classNames(styles.root, className, styles[kind])}
  >
    <ToastPrimitive.Title className={styles.message}>
      {children}
    </ToastPrimitive.Title>
  </ToastPrimitive.Root>
);

export default Toast;
