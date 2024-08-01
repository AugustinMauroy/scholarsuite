'use client';
import classNames from 'classnames';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import styles from './index.module.css';
import type { FC } from 'react';

const Breadcrumb: FC = () => {
  const t = useTranslations('common.breadcrumb');
  const paths = usePathname();
  const pathNames = paths
    .split('/')
    .filter(path => path)
    .filter(path => isNaN(Number(path)));

  return (
    <ul className={styles.breadcrumb}>
      <li
        className={classNames('font-bold', {
          'hover:underline': pathNames.length > 0,
        })}
      >
        <Link href="/">SchoolarSuite</Link>
      </li>
      {pathNames.length > 0 && <ChevronRightIcon />}
      {pathNames.map((link, index) => {
        const href = `/${pathNames.slice(0, index + 1).join('/')}`;
        const islast = pathNames.length === index + 1;

        return (
          <Fragment key={index}>
            <li
              className={classNames({
                [styles.activeItem]: islast,
              })}
            >
              <Link href={href} aria-disabled={islast}>
                {t(link)}
              </Link>
            </li>
            {pathNames.length !== index + 1 && <ChevronRightIcon />}
          </Fragment>
        );
      })}
    </ul>
  );
};

export default Breadcrumb;
