import Link from 'next/link';
import {
  UserGroupIcon,
  UsersIcon,
  CalendarDaysIcon,
} from '@heroicons/react/20/solid';
import BaseLayout from '@/components/Layout/Base';
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
  {
    title: 'Mange Courses',
    links: [{ href: '/administration/courses', text: 'Manage Courses' }],
  },
  {
    title: 'Manage Subjects',
    links: [{ href: '/administration/subjects', text: 'Manage Subjects' }],
  },
];

const Page: FC = () => (
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

export default Page;
