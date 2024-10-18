import { MailIcon, UsersIcon, DatabaseIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import ContainerNav from './Container';
import type { NavItem } from './Container';
import type { FC, ReactNode } from 'react';

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
    orderBy: [
      {
        name: 'asc',
      },
    ],
  });

  const attendanceGroups = groups.map(
    group =>
      ({
        label: group.name || (group.ref as ReactNode),
        href: `/group-attendance/${group.id}`,
      }) as NavItem
  );

  const items = [
    { title: t('attendanceGroup'), items: attendanceGroups },
    {
      label: t('disciplinaryReport'),
      href: '/disciplinary-reports',
      icon: <MailIcon />,
    },
  ];

  items[0].items?.push({
    href: '/group-attendance',
    label: <span className="italic">More ...</span>,
    notActive: true,
  } as NavItem);

  switch (session.user.role) {
    case 'ADMIN':
      items.push(
        { label: t('attendance'), href: '/attendance', icon: <UsersIcon /> },
        { label: t('admin'), href: '/administration', icon: <DatabaseIcon /> }
      );
      break;
    case 'MANAGER':
      items.push({
        label: t('attendance'),
        href: '/attendance',
        icon: <UsersIcon />,
      });
  }

  return (
    <ContainerNav
      items={items}
      bottomElements={[{ label: t('about'), href: '/about' }]}
    />
  );
};

export default NavBar;
