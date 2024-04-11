import { getTranslations } from 'next-intl/server';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import style from './not-found.module.css';
import type { FC } from 'react';

const NotFoundPage: FC = async () => {
  const t = await getTranslations('app.notFound');

  return (
    <main className={style.notFound}>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <Link href="/">
        {t('backHome')}
        <ArrowRightIcon />
      </Link>
    </main>
  );
};

export default NotFoundPage;
