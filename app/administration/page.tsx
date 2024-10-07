import Link from 'next/link';
import BaseLayout from '@/components/Layout/Base';
import Card from '@/components/Common/Card';
import styles from './page.module.css';
import type { FC } from 'react';

const CARDS = [
  {
    title: 'Manage Students',
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
    links: [
      { href: '/administration/academicYear', text: 'Manage Academic Years' },
    ],
  },
  {
    title: 'Mange groups',
    links: [{ href: '/administration/groups', text: 'Manage Groups' }],
  },
  {
    title: 'Manage Subjects',
    links: [{ href: '/administration/subjects', text: 'Manage Subjects' }],
  },
];

const Page: FC = async () => (
  <BaseLayout
    sectionClassName={styles.section}
    title="Administration Dashboard"
  >
    {CARDS.map(({ title, links }) => (
      <Card key={title} className={styles.card}>
        <h2>{title}</h2>
        {links?.map(({ href, text }) => (
          <Link key={href} href={href}>
            {text}
          </Link>
        ))}
      </Card>
    ))}
  </BaseLayout>
);

export default Page;
