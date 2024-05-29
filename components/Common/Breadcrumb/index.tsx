'use client';
import classNames from 'classnames';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { FC } from 'react';

const Breadcrumb: FC = () => {
  const t = useTranslations('common.breadcrumb');
  const paths = usePathname();
  const pathNames = paths
    .split('/')
    .filter(path => path)
    .filter(path => isNaN(Number(path)));

  return (
    <ul className="flex flex-row items-center justify-start gap-2">
      <li
        className={classNames('font-bold', {
          'hover:underline': pathNames.length > 0,
        })}
      >
        <Link href="/">SchoolarSuite</Link>
      </li>
      {pathNames.length > 0 && <ChevronRightIcon className="size-5" />}
      {pathNames.map((link, index) => {
        const href = `/${pathNames.slice(0, index + 1).join('/')}`;
        const islast = pathNames.length === index + 1;

        return (
          <Fragment key={index}>
            <li
              className={classNames({
                'rounded bg-brand-600 px-2 py-1 text-white': islast,
              })}
            >
              <Link
                href={href}
                aria-disabled={islast}
                className={classNames('capitalize', {
                  '!hover:no-underline': islast,
                  'hover:underline': !islast,
                })}
              >
                {t(link)}
              </Link>
            </li>
            {pathNames.length !== index + 1 && (
              <ChevronRightIcon className="size-5" />
            )}
          </Fragment>
        );
      })}
    </ul>
  );
};

export default Breadcrumb;
