import { getTranslations } from 'next-intl/server';
import Environment from '@/components/Common/Environement';
import Logo from '@/components/Common/Logo';
import UserAvatar from '@/components/Common/UserAvatar';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import ContainerNav from './Container';
import type { FC } from 'react';

const NavBar: FC = async () => {
  const session = await auth();
  const t = await getTranslations('components.layout.navbar');
  if (!session || Number.isNaN(Number(session.user.id))) return null;

  const groups = await prisma.group.findMany({
    where: {
      UserGroup: {
        some: {
          userId: Number(session.user.id),
        },
      },
    },
    // don't give all fields, to the client
    select: {
      id: true,
      ref: true,
      name: true,
    },
  });

  const attendanceGroups = groups.map(group => ({
    label: group.name || group.ref,
    href: `/group-attendance/${group.id}`,
  }));
  const links = [
    { label: t('disciplinaryReport'), href: '/disciplinary-report' },
  ];

  switch (session.user.role) {
    case 'ADMIN':
      links.push(
        { label: t('attendance'), href: '/attendance' },
        { label: t('admin'), href: '/administration' }
      );
      break;
    case 'MANAGER':
      links.push({ label: t('attendance'), href: '/attendance' });
  }

  return (
    <ContainerNav
      logo={<Logo />}
      linkList={{
        title: t('attendanceGroup'),
        items: attendanceGroups,
      }}
      links={links}
      bottomElements={[
        { label: t('about'), href: '/about' },
        { label: <UserAvatar key="userAvatar" /> },
        { label: <Environment key="env" /> },
      ]}
    />
  );
};

export default NavBar;
