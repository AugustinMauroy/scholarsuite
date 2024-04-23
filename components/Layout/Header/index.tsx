'use client';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Avatar from '@/components/Common/Avatar';
import { getAcronymFromString } from '@/utils/string';
import Button from '@/components/Common/Button';
import type { FC } from 'react';

const Header: FC = () => {
  const sessionData = useSession();
  const t = useTranslations('components.layout.header');
  const alt = getAcronymFromString(sessionData.data?.user.name || '');

  return (
    <header className="mb-4 flex flex-row items-center justify-between bg-gray-100 p-4 shadow-md dark:border-b dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
      <Link href="/" className="text-xl font-bold">
        SchoolarSuite
      </Link>
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500">
          <Avatar src={sessionData.data?.user?.image || ''} alt={alt} />
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            sideOffset={5}
            className="flex flex-col gap-4 rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800"
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
    </header>
  );
};

export default Header;
