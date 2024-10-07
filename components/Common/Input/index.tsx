import classNames from 'classnames';
import { forwardRef } from 'react';
import Label from '@/components/Common/Label';
import styles from './index.module.css';
import type { InputHTMLAttributes, ReactNode } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  inline?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, inline, type, className, ...inputProps }, ref) => (
    <div
      className={classNames(className, styles.inputWrapper, {
        [styles.inline]: inline,
        [styles.checkbox]: type === 'checkbox',
      })}
    >
      {label && <Label>{label}</Label>}
      <input className={styles.input} type={type} ref={ref} {...inputProps} />
    </div>
  )
);

Input.displayName = 'Input';

export default Input;
