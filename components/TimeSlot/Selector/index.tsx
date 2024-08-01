import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
} from '@heroicons/react/24/solid';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import Calendar from '@/components/Common/Calendar';
import styles from './index.module.css';
import type { FC } from 'react';

type SelectorProps = {
  name: string;
  onChange: (kind: 'prev' | 'next') => void;
  onDateChange?: (date: Date) => void;
  selectedDate?: Date;
  disabledPrev?: boolean;
  disabledNext?: boolean;
};

const Selector: FC<SelectorProps> = ({
  name,
  onChange,
  disabledPrev,
  disabledNext,
  onDateChange,
  selectedDate,
}) => (
  <PopoverPrimitive.Root>
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
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={styles.selector}
          aria-label="Select date"
        >
          <span className={styles.name}>
            {name}
            <CalendarIcon />
          </span>

          {(selectedDate?.getMonth() !== new Date().getMonth() ||
            selectedDate?.getDate() !== new Date().getDate() ||
            selectedDate?.getFullYear() !== new Date().getFullYear()) && (
            <span className={styles.date}>
              {selectedDate?.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </button>
      </PopoverPrimitive.Trigger>
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
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={5}
        side="bottom"
        align="center"
        autoFocus={false}
      >
        <Calendar onChange={onDateChange} selectedDate={selectedDate} />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  </PopoverPrimitive.Root>
);

export default Selector;
