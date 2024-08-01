import { useState, useEffect } from 'react';
import Input from '@/components/Common/Input';
import type { Student, Class } from '@prisma/client';
import type { FC } from 'react';

type StudentsState = Student & {
  class: Class | null;
};

type StudentSearchProps = {
  studentId?: number;
  setStudentId: (id: number) => void;
};

const StudentSearch: FC<StudentSearchProps> = ({ studentId, setStudentId }) => {
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<StudentsState[]>([]);

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

  useEffect(() => {
    if (!studentId) {
      setSearch('');
    }
  }, [studentId]);

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
        <ul className="absolute mt-2 max-h-60 w-full divide-y divide-gray-300 overflow-y-auto rounded border border-gray-300 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
          {students.map(student => (
            <li
              key={student.id}
              onClick={() => {
                setStudentId(student.id);
                setSearch(`${student.firstName} ${student.lastName}`);
              }}
              className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {student.firstName} {student.lastName}{' '}
              {student?.class?.name && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({student.class.name})
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentSearch;
