'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import GlowingBackdrop from '@/components/Common/Background';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import styles from './page.module.css';
import type { FC, FormEvent } from 'react';

type ProviderMap = {
  id?: string;
  name?: string;
};

const SigninForm: FC = () => {
  const t = useTranslations('app.signin');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [providerMap, setProviderMap] = useState<ProviderMap[]>([]);

  if (session) {
    router.push('/');
  }

  useEffect(() => {
    const fetchProviders = async () => {
      const resp = await fetch('/api/auth-utils');
      const data = await resp.json();
      setProviderMap(data);
    };
    fetchProviders();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    await signIn('credentials', {
      email,
      password,
      callbackUrl: searchParams.get('callbackUrl') ?? '/',
    });
  };

  return (
    <>
      <main className={styles.wrapper}>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
        {searchParams.get('error') === 'CredentialsSignin' && (
          <div className={styles.error}>{t('credentialsError')}</div>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            label={t('email')}
            placeholder={t('email')}
            type="email"
            name="email"
            required
          />
          <Input
            label={t('password')}
            placeholder={t('password')}
            type="password"
            name="password"
            required
          />
          <Button type="submit">{t('submit')}</Button>
        </form>
        {providerMap.length > 0 && (
          <div className={styles.providersWrapper}>
            <p>{t('or')}</p>
            <div className={styles.providers}>
              {providerMap.map(provider => (
                <Button
                  key={provider.name}
                  className={styles.button}
                  onClick={() =>
                    signIn(provider.id, {
                      callbackUrl: searchParams.get('callbackUrl') ?? '/',
                    })
                  }
                >
                  {t('signInWith', { provider: provider.name })}
                </Button>
              ))}
            </div>
          </div>
        )}
      </main>
      <GlowingBackdrop />
    </>
  );
};

export default SigninForm;
