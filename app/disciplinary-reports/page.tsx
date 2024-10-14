'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import BaseLayout from '@/components/Layout/Base';
import styles from './page.module.css';
import type { DisciplinaryReport, User, Student } from '@prisma/client';
import type { FC } from 'react';

type DisciplinaryState = DisciplinaryReport & {
  CreatedBy: User;
  Student: Student;
};

const Page: FC = () => {
  const [disciplinaryReports, setDisciplinaryReports] = useState<
    DisciplinaryState[] | null
  >(null);

  useEffect(() => {
    fetch('/api/disciplinary-reports', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => setDisciplinaryReports(data.data));
  }, []);

  return (
    <BaseLayout title="Disciplinary Reports">
      {disciplinaryReports ? (
        <ul className={styles.list}>
          {disciplinaryReports.map(disciplinaryReport => (
            <li key={disciplinaryReport.id}>
              <h2>{disciplinaryReport.Student.firstName}</h2>
              <p>
                <CalendarIcon />
                {new Date(disciplinaryReport.date).toLocaleDateString()}
              </p>
              <p className={styles.createdBy}>
                Created by: {disciplinaryReport.CreatedBy.firstName}
              </p>
              <Link href={`/disciplinary-reports/${disciplinaryReport.id}`}>
                View
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </BaseLayout>
  );
};

export default Page;
