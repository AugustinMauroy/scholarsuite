'use client';
import { useState, useEffect } from 'react';
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

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {data.name}
      <div>
        {data.students.map(student => (
          <div key={student.id}>{student.firstName}</div>
        ))}
      </div>
    </div>
  );
};

export default Page;
