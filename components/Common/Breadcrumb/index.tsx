'use client';
import classNames from 'classnames';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import type { FC } from 'react';

const Breadcrumb: FC = () => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter(path => path);

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
        const isActive = paths === href;

        return (
          <Fragment key={index}>
            <li
              className={classNames({
                'rounded bg-brand-600 px-2 py-1 text-white': isActive,
              })}
            >
              <Link
                href={href}
                aria-disabled={isActive}
                className={classNames('capitalize', {
                  '!hover:no-underline': isActive,
                  'hover:underline': !isActive,
                })}
              >
                {link}
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
