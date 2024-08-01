import styles from './index.module.css';
import type { FC, LabelHTMLAttributes } from 'react';

type Props = LabelHTMLAttributes<HTMLLabelElement>;

const Label: FC<Props> = ({ children, ...props }) => (
  <label className={styles.label} {...props}>
    {children}
  </label>
);

export default Label;
