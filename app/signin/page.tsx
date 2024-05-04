'use client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import styles from './page.module.css';
import type { FC, FormEvent } from 'react';

const Page: FC = () => {
  const t = useTranslations('app.signin');
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push('/');
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const password = formData.get('password') as string;
    await signIn('credentials', { firstName, lastName, password });
  };

  return (
    <main className={styles.wrapper}>
      <h1>{t('title')}</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label={t('firstName')}
          placeholder={t('firstName')}
          name="firstName"
          required
        />
        <Input
          label={t('lastName')}
          placeholder={t('lastName')}
          name="lastName"
          required
        />
        <Input
          label={t('password')}
          placeholder={t('password')}
          type="password"
          name="password"
          required
        />
        <Button type="submit" className="mt-4">
          {t('submit')}
        </Button>
      </form>
    </main>
  );
};

export default Page;
