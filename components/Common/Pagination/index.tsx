import classNames from 'classnames';
import { ArrowRightIcon, ArrowLeftIcon, EllipsisIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Button from '../Button';
import styles from './index.module.css';
import type { FC } from 'react';

const MAX_ITEMS = 5;

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const t = useTranslations('components.common.pagination');
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  let start = Math.max(currentPage - Math.floor(MAX_ITEMS / 2), 1);
  const end = Math.min(start + MAX_ITEMS - 1, totalPages);

  if (end - start < MAX_ITEMS - 1) {
    start = Math.max(end - MAX_ITEMS + 1, 1);
  }

  return (
    <div className={styles.pagination}>
      <Button
        disabled={currentPage === 1}
        aria-disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ArrowLeftIcon aria-label={t('previous')} />
      </Button>
      {start > 1 && (
        <span className={styles.ellipsis} role="presentation">
          <EllipsisIcon />
        </span>
      )}
      {pages.slice(start - 1, end).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={classNames(styles.item, {
            [styles.active]: currentPage === page,
            [styles.inactive]: currentPage !== page,
          })}
          aria-label={t('page', { page })}
          title={t('page', { page })}
          tabIndex={currentPage === page ? -1 : undefined}
        >
          {page}
        </button>
      ))}
      {end < totalPages && (
        <span role="presentation" className={styles.ellipsis}>
          <EllipsisIcon />
        </span>
      )}
      <Button
        disabled={currentPage === totalPages}
        aria-disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ArrowRightIcon aria-label={t('next')} />
      </Button>
    </div>
  );
};

export default Pagination;
