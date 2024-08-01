import classNames from 'classnames';
import Label from '@/components/Common/Label';
import styles from './index.module.css';
import type { FC, InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  inline?: boolean;
};

const Input: FC<InputProps> = ({ label, inline, type, ...inputProps }) => (
  <div
    className={classNames(styles.inputWrapper, {
      [styles.inline]: inline,
      [styles.checkbox]: type === 'checkbox',
    })}
  >
    {label && <Label>{label}</Label>}
    <input className={styles.input} type={type} {...inputProps} />
  </div>
);

export default Input;
