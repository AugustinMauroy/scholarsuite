import type { FC } from 'react';
import type { Student, Class } from '@prisma/client';

type PageProps = {
  params: {
    id: string;
  };
};

type ClassWithStudents = Class & {
  students: Student[];
};

const Page: FC<PageProps> = async ({ params }) => {
  const req = await fetch('http://localhost:3000/api/class/' + params.id);
  const data = (await req.json()) as ClassWithStudents;

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
