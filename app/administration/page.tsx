import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  UserGroupIcon,
  UsersIcon,
  CalendarDaysIcon,
} from '@heroicons/react/20/solid';
import BaseLayout from '@/components/Layout/Base';
import nextAuthConfig from '@/lib/auth';
import styles from './page.module.css';
import type { FC } from 'react';

const CARDS = [
  {
    title: 'Manage Students',
    icon: UserGroupIcon,
    links: [
      { href: '/administration/students', text: 'View Students' },
      { href: '/administration/students/add', text: 'Add Student' },
    ],
  },
  {
    title: 'Manage Classes',
    links: [
      { href: '/administration/classes', text: 'View Classes' },
      { href: '/administration/classes/add', text: 'Add Class' },
    ],
  },
  {
    title: 'Manage TimeSlots',
    links: [{ href: '/administration/timeSlot', text: 'Manage TimeSlots' }],
  },
  {
    title: 'Manage Users',
    icon: UsersIcon,
    links: [
      { href: '/administration/users', text: 'View Users' },
      { href: '/administration/users/add', text: 'Add User' },
    ],
  },
  {
    title: 'School Levels',
    links: [
      { href: '/administration/schoolLevels', text: 'View Levels' },
      { href: '/administration/schoolLevels/add', text: 'Add Level' },
    ],
  },
  {
    title: 'Academic Years',
    icon: CalendarDaysIcon,
    links: [
      { href: '/administration/academicYear', text: 'Manage Academic Years' },
    ],
  },
];

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (session?.user.role !== 'ADMIN') notFound();

  return (
    <BaseLayout sectionClassName={styles.section}>
      {CARDS.map(({ title, links, icon: Icon }) => (
        <div className={styles.card} key={title}>
          <h2>
            {Icon && <Icon />}
            {title}
          </h2>
          {links?.map(({ href, text }) => (
            <Link key={href} href={href}>
              {text}
            </Link>
          ))}
        </div>
      ))}
    </BaseLayout>
  );
};

export default Page;
