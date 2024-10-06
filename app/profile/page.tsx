'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Avatar from '@/components/Common/Avatar';
import Button from '@/components/Common/Button';
import DropZone from '@/components/Common/DropZone';
import Select from '@/components/Common/Select';
import { useToast } from '@/hooks/useToast';
import { getAcronymFromString } from '@/utils/string';
import { availableLocales } from '@/lib/i18nClients';
import EditModal from '@/components/Common/EditModal';
import styles from './page.module.css';
import type { FC } from 'react';

const Page: FC = () => {
  const sessionData = useSession();
  const t = useTranslations('app.profile');
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preferedLanguage, setPreferedLanguage] = useState<string | null>(null);
  const alt = getAcronymFromString(sessionData.data?.user.name || '');

  const handleUpdate = async () => {
    if (file)
      await fetch(
        `/api/content/profile-picture/${sessionData.data?.user.firstName}${sessionData.data?.user.lastName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        }
      )
        .then(response => {
          if (response.ok) {
            setFile(null);
            toast({
              message: 'Profile picture updated successfully',
              kind: 'success',
            });
          }
        })
        .catch(() => {
          toast({
            message: 'An error occurred',
            kind: 'error',
          });
        });

    if (preferedLanguage)
      await fetch(`/api/user/${sessionData.data?.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sessionData.data?.user,
          preferredLanguage: preferedLanguage,
        }),
      })
        .then(response => {
          if (response.ok) {
            setPreferedLanguage(null);
            toast({
              message: 'Language updated successfully',
              kind: 'success',
            });
          }
        })
        .catch(() => {
          toast({
            message: 'An error occurred',
            kind: 'error',
          });
        });
  };

  return (
    <DialogPrimitive.Root>
      <main className={styles.page}>
        <h1>{t('title')}</h1>
        <div className={styles.profileInfo}>
          <Avatar
            src={sessionData.data?.user.image || ''}
            alt={alt}
            className={styles.avatar}
          />
          <p className={styles.name}>
            {t('name', {
              firstName: sessionData.data?.user.firstName,
              lastName: sessionData.data?.user.lastName,
            })}
          </p>
          <p className={styles.email}>
            {t('email', { email: sessionData.data?.user.email })}
          </p>
          {sessionData.data?.user.preferredLanguage && (
            <p>
              {t('preferedLanguage', {
                lang: availableLocales.find(
                  locale =>
                    locale.code === sessionData.data?.user.preferredLanguage
                )?.localName,
              })}
            </p>
          )}
          <DialogPrimitive.Trigger asChild>
            <Button>{t('edit')}</Button>
          </DialogPrimitive.Trigger>
        </div>
      </main>
      <EditModal
        onClose={() => {
          setFile(null);
          setPreferedLanguage(null);
        }}
        title={t('edit')}
      >
        <DropZone file={file} setFile={setFile} title={t('dropzone.title')} />
        <Select
          label={t('language')}
          defaultValue={sessionData.data?.user.preferredLanguage?.toString()}
          values={availableLocales.map(locale => ({
            label: locale.localName,
            value: locale.code,
          }))}
          onChange={v => setPreferedLanguage(v)}
        />
        <DialogPrimitive.Close asChild>
          <Button kind="outline" onClick={handleUpdate}>
            {t('update')}
          </Button>
        </DialogPrimitive.Close>
      </EditModal>
    </DialogPrimitive.Root>
  );
};

export default Page;
