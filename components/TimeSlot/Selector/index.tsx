import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useMemo } from 'react';
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
}) => {
  const f = useFormatter();
  const t = useTranslations('components.timeSlot.selector');

  const displayDate = useMemo(() => {
    if (!selectedDate) return '';

    return f.dateTime(selectedDate, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [selectedDate, f]);

  return (
    <PopoverPrimitive.Root>
      <div className={styles.wrapper}>
        <button
          onClick={() => onChange('prev')}
          disabled={disabledPrev}
          className={styles.button}
          type="button"
          aria-label={t('prev')}
          aria-disabled={disabledPrev}
        >
          <ArrowLeft />
        </button>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            className={styles.selector}
            aria-label="Select date"
          >
            <span className={styles.name}>
              {name}
              <CalendarDays />
            </span>

            {(selectedDate?.getMonth() !== new Date().getMonth() ||
              selectedDate?.getDate() !== new Date().getDate() ||
              selectedDate?.getFullYear() !== new Date().getFullYear()) && (
              <span className={styles.date}>{displayDate}</span>
            )}
          </button>
        </PopoverPrimitive.Trigger>
        <button
          onClick={() => onChange('next')}
          disabled={disabledNext}
          className={styles.button}
          type="button"
          aria-label={t('next')}
          aria-disabled={disabledNext}
        >
          <ArrowRight />
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
};

export default Selector;
