import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Table from '@/components/Student/Table';
import nextAuthConfig from '@/lib/auth';
import styles from './page.module.css';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (session?.user.role !== 0) notFound();

  const students = await prisma.student.findMany({
    include: {
      class: true,
    },
  });

  const possibleClasses = await prisma.class.findMany();

  return (
    <main className={styles.page}>
      <header>
        <h1>Administration</h1>
        <p>List of students</p>
      </header>
      <section>
        <Table students={students} possibleClasses={possibleClasses} />
      </section>
    </main>
  );
};

export default Page;
