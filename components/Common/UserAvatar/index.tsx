'use client';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Avatar from '@/components/Common/Avatar';
import Button from '@/components/Common/Button';
import { getAcronymFromString } from '@/utils/string';
import styles from './index.module.css';
import type { FC } from 'react';

const UserAvatar: FC = () => {
  const sessionData = useSession();
  const t = useTranslations('components.common.userAvatar');
  const alt = getAcronymFromString(sessionData.data?.user.name || '');

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger className={styles.trigger}>
        <Avatar src={sessionData.data?.user?.image || ''} alt={alt} />
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          sideOffset={5}
          className={styles.content}
        >
          <DropdownMenuPrimitive.CheckboxItem asChild>
            <Link href="/profile">
              <Settings />
              <span>{t('profile')}</span>
            </Link>
          </DropdownMenuPrimitive.CheckboxItem>
          <DropdownMenuPrimitive.CheckboxItem asChild>
            <Button onClick={() => signOut()} kind="outline">
              {t('signout')}
            </Button>
          </DropdownMenuPrimitive.CheckboxItem>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export default UserAvatar;
