'use client';
import { useState, useEffect } from 'react';
import StudentCard from '@/components/Student/StudentCard';
import BaseLayout from '@/components/Layout/base';
import styles from './page.module.css';
import type { FC } from 'react';
import type { Student, Class } from '@prisma/client';

type PageProps = {
  params: { id: string };
};

type ClassWithStudents = Class & {
  students: Student[];
};

const Page: FC<PageProps> = ({ params }) => {
  const [data, setData] = useState<ClassWithStudents | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/class/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setData(data.data));
  }, []);

  return (
    <BaseLayout
      title={data?.name ?? 'Loading...'}
      sectionClassName={styles.studentList}
    >
      {data?.students.map(student => (
        <StudentCard
          key={student.id}
          firstName={student.firstName}
          lastName={student.lastName}
          image={`http://localhost:3000/api/content/student-picture/${student.id}`}
        />
      ))}
    </BaseLayout>
  );
};

export default Page;
