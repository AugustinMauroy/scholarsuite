import { useState, useEffect } from 'react';
import Input from '@/components/Common/Input';
import type { FC } from 'react';
import type { Student } from '@prisma/client';

type StudentSearchProps = {
  studentId: number;
  setStudentId: (id: number) => void;
};

const StudentSearch: FC<StudentSearchProps> = ({ studentId, setStudentId }) => {
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch('/api/student/search', {
        method: 'POST',
        body: JSON.stringify({ string: search }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          console.error(data.error);
          setStudents([]);

          return;
        }

        setStudents(data);
      }
    };

    const debounced = setTimeout(() => {
      if (search.length > 0) {
        fetchStudents();
      }
    }, 500);

    return () => clearTimeout(debounced);
  }, [search]);

  return (
    <div className="relative w-full">
      <Input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search for student"
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setTimeout(() => setFocused(false), 200);
        }}
      />
      {focused && students.length > 0 && (
        <ul className="absolute mt-1 w-full rounded border border-gray-300 bg-white">
          {students.map(student => (
            <li
              key={student.id}
              onClick={() => {
                setStudentId(student.id);
                setSearch(`${student.firstName} ${student.lastName}`);
              }}
              className="cursor-pointer p-2 hover:bg-gray-100"
            >
              {student.firstName} {student.lastName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentSearch;
