import classNames from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useState, useEffect, forwardRef } from 'react';
import styles from './index.module.css';

type CalendarProps = {
  onChange?: (date: Date) => void;
  selectedDate?: Date;
};

const getCalendarDays = (year: number, month: number): number[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDay = new Date(year, month - 1, daysInMonth).getDay();

  const daysBefore = Array.from({ length: firstDay }, () => 0);
  const daysAfter = Array.from({ length: 6 - lastDay }, () => 0);

  return [...daysBefore, ...days, ...daysAfter];
};

const Calendar = forwardRef<HTMLButtonElement, CalendarProps>(
  ({ onChange, selectedDate: defaultSelectedDate = null }, ref) => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const locale = useLocale();
    const [activeDate, setActiveDate] = useState(
      defaultSelectedDate || new Date()
    );
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
      setDaysInMonth(
        getCalendarDays(activeDate.getFullYear(), activeDate.getMonth() + 1)
      );
    }, [activeDate]);

    const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
    const weeksArray = Array.from(
      { length: daysInMonth.length / 7 },
      (_, i) => i
    );

    const handleChangeMonth = (direction: 'prev' | 'next') => {
      setActiveDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(
          direction === 'prev' ? newDate.getMonth() - 1 : newDate.getMonth() + 1
        );

        return newDate;
      });
    };

    const handleSelectDate = (day: number) => {
      const newDate = new Date(activeDate);
      newDate.setDate(day);
      setSelectedDate(newDate);
      onChange?.(newDate);
    };

    const isToday = (day: number) => {
      const today = new Date();

      return (
        day === today.getDate() && activeDate.getMonth() === today.getMonth()
      );
    };

    const isSelected = (day: number) => {
      return (
        selectedDate?.getDate() === day &&
        selectedDate?.getMonth() === activeDate.getMonth()
      );
    };

    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <button
            tabIndex={0}
            type="button"
            className={styles.button}
            onClick={() => handleChangeMonth('prev')}
            aria-label="Previous month"
            ref={ref}
          >
            <ChevronLeftIcon />
          </button>
          <span>
            {activeDate.toLocaleDateString(locale, {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button
            tabIndex={0}
            type="button"
            className={styles.button}
            onClick={() => handleChangeMonth('next')}
            aria-label="Next month"
          >
            <ChevronRightIcon />
          </button>
        </div>
        <div className={styles.daysList}>
          {days.map(day => (
            <span key={day} className={styles.dayName}>
              {day}
            </span>
          ))}
        </div>
        <div>
          {weeksArray.map(week => (
            <div key={week} className={styles.daysList}>
              {daysInMonth.slice(week * 7, week * 7 + 7).map((day, index) => (
                <button
                  type="button"
                  tabIndex={day > 0 ? 0 : -1}
                  key={index}
                  onClick={() => handleSelectDate(day)}
                  className={classNames({
                    [styles.today]: isToday(day),
                    [styles.selected]: isSelected(day),
                  })}
                  disabled={day === 0}
                >
                  {day > 0 ? day : ''}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export default Calendar;
