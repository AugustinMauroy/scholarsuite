import { HomeIcon } from '@heroicons/react/24/outline';
import { getServerSession } from 'next-auth';
import Environment from '@/components/Common/Environement';
import UserAvatar from '@/components/Common/UserAvatar';
import nextAuthConfig from '@/lib/auth';
import prisma from '@/lib/prisma';
import ContainerNav from './Container';
import type { FC } from 'react';

const NavBar: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (!session) return null;

  const user = session.user;
  const schoolLevels = await prisma.schoolLevel.findMany({
    include: {
      group: {
        where: {
          userGroup: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    },
    where: {
      group: {
        some: {
          userGroup: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    },
  });
  const PresenceAccordionItems = schoolLevels.map(schoolLevel => ({
    label: schoolLevel.name,
    children: schoolLevel.group.map(group => ({
      label: group.name,
      href: `/group/${group.id}`,
    })),
  }));
  let links = [{ label: 'Disciplinary Report', href: '/disciplinaryReport' }];

  switch (user.role) {
    case 'ADMIN':
      links.push(
        { label: 'Presence Review', href: '/presence' },
        { label: 'Admin Dashboard', href: '/administration' }
      );
      break;
    case 'MANAGER':
      links.push({ label: 'Presence Review', href: '/presence' });
  }

  return (
    <ContainerNav
      topLinks={[
        {
          label: (
            <>
              <HomeIcon />
              ScholarSuite
            </>
          ),
          href: '/',
        },
      ]}
      accordionMenu={[
        {
          title: 'Presence for Groups',
          items: PresenceAccordionItems,
        },
      ]}
      links={links}
      bottomElements={[
        { label: 'About', href: '/about' },
        { label: <UserAvatar /> },
        { label: <Environment /> },
      ]}
    />
  );
};

export default NavBar;
