import { ArrowRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import style from './not-found.module.css';
import type { FC } from 'react';

const NotFoundPage: FC = () => (
  <main className={style.notFound}>
    <h1>404 - Not Found</h1>
    <p>The page you requested could not be found.</p>
    <Link href="/">
      Go back home
      <ArrowRightIcon />
    </Link>
  </main>
);

export default NotFoundPage;
