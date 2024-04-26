'use client';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useState, useEffect } from 'react';
import Tabs from '@/components/Common/Tabs';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import StudentSearch from '@/components/Student/Search';
import type { FC, FormEvent } from 'react';
import type { DisciplinaryReport, User, Student } from '@prisma/client';

type DisciplinaryState = DisciplinaryReport & {
  createdBy: User;
  student: Student;
};

const Page: FC = () => {
  const [disciplinaryReports, setDisciplinaryReports] = useState<
    DisciplinaryState[] | null
  >(null);
  const [studentId, setStudentId] = useState<number>();
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    fetch('/api/disciplinaryReport', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => setDisciplinaryReports(data.disciplinaryReports));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch('/api/disciplinaryReport', {
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
          alert(data.error);
        } else {
          setDisciplinaryReports(data.disciplinaryReports);
          setStudentId(undefined);
          setDescription('');
          setDate('');
        }
      });
  };

  return (
    <>
      <Tabs
        className="mx-auto w-1/2"
        defaultValue="see"
        tabs={[
          { key: 'see', label: 'See disciplinary report' },
          { key: 'create', label: 'Create disciplinary report' },
        ]}
      >
        <TabsPrimitive.Content key="see" value="see">
          {disciplinaryReports ? (
            <ul className="divide-y divide-gray-200 py-4">
              {disciplinaryReports.map(disciplinaryReport => (
                <li key={disciplinaryReport.id}>
                  <h2 className="text-xl">
                    {disciplinaryReport.student.firstName}
                  </h2>
                  <p>{disciplinaryReport.description}</p>
                  <p>
                    {new Date(disciplinaryReport.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Created by: {disciplinaryReport.createdBy.firstName}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
          {disciplinaryReports && disciplinaryReports.length === 0 && (
            <p>No disciplinary reports</p>
          )}
        </TabsPrimitive.Content>
        <TabsPrimitive.Content key="create" value="create" asChild>
          <form className="space-y-4 py-4">
            <StudentSearch
              studentId={studentId || 0}
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
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              Create
            </Button>
          </form>
        </TabsPrimitive.Content>
      </Tabs>
    </>
  );
};

export default Page;
