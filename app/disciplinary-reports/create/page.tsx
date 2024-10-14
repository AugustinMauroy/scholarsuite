'use client';
import { useState } from 'react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import StudentSearch from '@/components/Student/Search';
import { useToast } from '@/hooks/useToast';
import BaseLayout from '@/components/Layout/Base';
import styles from './page.module.css';
import type { FC, FormEvent } from 'react';

const Page: FC = () => {
  const toast = useToast();
  const [studentId, setStudentId] = useState<number>();
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch('/api/disciplinary-reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: Number(studentId),
        description,
        date: new Date(date),
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast({
            message: data.error,
            kind: 'error',
          });
        } else {
          setStudentId(undefined);
          setDescription('');
          setDate('');
          toast({
            message: 'Disciplinary report created',
            kind: 'success',
          });
        }
      });
  };

  return (
    <BaseLayout title="Create Disciplinary Report">
      <form className={styles.form} onSubmit={handleSubmit}>
        <StudentSearch
          studentId={studentId}
          setStudentId={id => setStudentId(id)}
        />
        <Input
          label="Description"
          id="description"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <Input
          label="Date"
          id="date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <Button type="submit" className={styles.submit}>
          Create
        </Button>
      </form>
    </BaseLayout>
  );
};

export default Page;
