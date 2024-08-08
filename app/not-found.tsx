'use client';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import style from './not-found.module.css';
import type { FC } from 'react';

const NotFoundPage: FC = () => {
  const t = useTranslations('app.notFound');

  return (
    <main className={style.notFound}>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <Link href="/">
        {t('backHome')}
        <MoveRight />
      </Link>
    </main>
  );
};

export default NotFoundPage;
