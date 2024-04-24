import prisma from '@/lib/prisma';
import styles from './page.module.css';
import type { FC } from 'react';

const Page: FC = async () => {
  const students = await prisma.student.findMany({
    include: {
      class: true,
    },
  });

  return (
    <main className={styles.page}>
      <header>
        <h1>Administration</h1>
        <p>List of students</p>
      </header>
      <section>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.class?.name ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default Page;
