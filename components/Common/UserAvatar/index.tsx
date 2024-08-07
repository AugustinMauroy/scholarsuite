'use client';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Avatar from '@/components/Common/Avatar';
import Button from '@/components/Common/Button';
import { getAcronymFromString } from '@/utils/string';
import type { FC } from 'react';

const UserAvatar: FC = () => {
  const sessionData = useSession();
  const t = useTranslations('components.layout.header');
  const alt = getAcronymFromString(sessionData.data?.user.name || '');

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger className="size-fit rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500">
        <Avatar src={sessionData.data?.user?.image || ''} alt={alt} />
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          sideOffset={5}
          className="mx-1.5 flex flex-col gap-4 rounded-lg bg-white p-2 shadow-lg dark:border dark:border-gray-700 dark:bg-gray-900"
        >
          <DropdownMenuPrimitive.CheckboxItem asChild>
            <Link
              href="/profile"
              className="flex flex-row items-center gap-2 hover:underline hover:outline-none"
            >
              <Cog8ToothIcon className="size-5" />
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
