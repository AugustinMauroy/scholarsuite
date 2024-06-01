import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BaseLayout from '@/components/Layout/Base';
import nextAuthConfig from '@/lib/auth';
import styles from './page.module.css';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (session?.user.role !== 'ADMIN') notFound();

  return (
    <BaseLayout sectionClassName={styles.section}>
      <div className={styles.card}>
        <h2>Manage Students</h2>
        <Link href="/administration/students">View Students</Link>
        <Link href="/administration/students/add">Add Student</Link>
      </div>
      <div className={styles.card}>
        <h2>Manage Classes</h2>
        <Link href="/administration/classes">View Classes</Link>
        <Link href="/administration/classes/add">Add Class</Link>
      </div>
      <div className={styles.card}>
        <h2>Manage TimeSlots</h2>
        <Link href="/administration/timeSlot">Manage TimeSlots</Link>
      </div>
      <div className={styles.card}>
        <h2>Manage Users</h2>
        <Link href="/administration/users">View Users</Link>
        <Link href="/administration/users/add">Add User</Link>
      </div>
      <div className={styles.card}>
        <h2>School Levels</h2>
        <Link href="/administration/schoolLevels">View Levels</Link>
        <Link href="/administration/schoolLevels/add">Add Level</Link>
      </div>
      <div className={styles.card}>
        <h2>Academic Years</h2>
        <Link href="/administration/academicYear">Manage Academic Years</Link>
      </div>
    </BaseLayout>
  );
};

export default Page;
