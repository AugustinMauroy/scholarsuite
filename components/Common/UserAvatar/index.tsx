'use client';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Avatar from '@/components/Common/Avatar';
import Button from '@/components/Common/Button';
import DropDownMenu from '@/components/Common/DropDownMenu';
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
        <span className={styles.name}>
          {sessionData.data?.user.firstName} {sessionData.data?.user.lastName}
        </span>
      </DropdownMenuPrimitive.Trigger>
      <DropDownMenu className={styles.content}>
        <DropdownMenuPrimitive.Item asChild>
          <Link href="/profile">
            <Settings />
            <span>{t('profile')}</span>
          </Link>
        </DropdownMenuPrimitive.Item>
        <DropdownMenuPrimitive.Item asChild>
          <Button onClick={() => signOut()} kind="outline">
            {t('signout')}
          </Button>
        </DropdownMenuPrimitive.Item>
      </DropDownMenu>
    </DropdownMenuPrimitive.Root>
  );
};

export default UserAvatar;
