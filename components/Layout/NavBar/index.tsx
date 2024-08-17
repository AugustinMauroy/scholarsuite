import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import Environment from '@/components/Common/Environement';
import Logo from '@/components/Common/Logo';
import UserAvatar from '@/components/Common/UserAvatar';
import nextAuthConfig from '@/lib/auth';
import prisma from '@/lib/prisma';
import ContainerNav from './Container';
import type { FC } from 'react';

const NavBar: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  const t = await getTranslations('components.layout.navbar');
  if (!session) return null;

  const permissions = await prisma.userPermission
    .findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        permission: {
          select: {
            name: true,
          },
        },
      },
    })
    .then(data => data.map(({ permission }) => permission.name));

  const groups = permissions.includes('create_presence')
    ? await prisma.group.findMany({
        where: {
          userGroup: {
            some: {
              userId: session.user.id,
            },
          },
        },
        // don't give all fields, to the client
        select: {
          id: true,
          name: true,
        },
      })
    : [];
  const presenceGroups = groups.map(group => ({
    label: group.name,
    href: `/group-presence/${group.id}`,
  }));
  let links = [] as { label: string; href: string }[];

  if (permissions.includes('disciplinaryReport'))
    links.push({ label: t('disciplinaryReport'), href: '/disciplinaryReport' });
  if (permissions.includes('full_admin'))
    links.push({ label: t('admin'), href: '/administration' });
  if (permissions.includes('review_presence'))
    links.push({ label: t('presence'), href: '/presence' });

  return (
    <ContainerNav
      logo={<Logo />}
      linkList={{
        title: t('presenceGroup'),
        items: presenceGroups,
      }}
      links={links}
      bottomElements={[
        { label: t('about'), href: '/about' },
        { label: <UserAvatar /> },
        { label: <Environment /> },
      ]}
    />
  );
};

export default NavBar;
