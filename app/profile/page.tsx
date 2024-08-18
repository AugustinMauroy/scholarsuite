'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Avatar from '@/components/Common/Avatar';
import Button from '@/components/Common/Button';
import DropZone from '@/components/Common/DropZone';
import { useToast } from '@/hooks/useToast';
import { getAcronymFromString } from '@/utils/string';
import styles from './page.module.css';
import type { FC } from 'react';

const Page: FC = () => {
  const sessionData = useSession();
  const t = useTranslations('app.profile');
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const alt = getAcronymFromString(sessionData.data?.user.name || '');

  const handleUpdate = async () => {
    if (!file) return;
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
          <DialogPrimitive.Trigger asChild>
            <Button>{t('edit')}</Button>
          </DialogPrimitive.Trigger>
        </div>
      </main>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.modalOverlay} />
        <DialogPrimitive.Content className={styles.modalContent}>
          <DialogPrimitive.Close asChild>
            <X className={styles.closeIcon} />
          </DialogPrimitive.Close>
          <DialogPrimitive.Title asChild>
            <h2>{t('edit')}</h2>
          </DialogPrimitive.Title>
          <DropZone file={file} setFile={setFile} title={t('dropzone.title')} />
          <DialogPrimitive.Close asChild>
            <Button kind="outline" onClick={handleUpdate}>
              {t('update')}
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Page;
