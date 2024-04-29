import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import type { FC } from 'react';

type SelectorProps = {
  name: string;
  onChange: (kind: 'prev' | 'next') => void;
  disabledPrev?: boolean;
  disabledNext?: boolean;
};

const Selector: FC<SelectorProps> = ({
  name,
  onChange,
  disabledPrev,
  disabledNext,
}) => (
  <div className={styles.wrapper}>
    <button
      onClick={() => onChange('prev')}
      disabled={disabledPrev}
      className={styles.button}
      type="button"
      aria-label="Previous"
      aria-disabled={disabledPrev}
    >
      <ArrowLeftIcon />
    </button>
    <span className={styles.name}>{name}</span>
    <button
      onClick={() => onChange('next')}
      disabled={disabledNext}
      className={styles.button}
      type="button"
      aria-label="Next"
      aria-disabled={disabledNext}
    >
      <ArrowRightIcon />
    </button>
  </div>
);

export default Selector;
