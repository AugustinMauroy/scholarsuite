import { useState, useEffect } from 'react';
import Input from '@/components/Common/Input';
import styles from './index.module.css';
import type { Student, Class } from '@prisma/client';
import type { FC } from 'react';

type StudentsState = Student & {
  Class: Class | null;
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
    <div className={styles.wrapper}>
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
        <ul className={styles.list}>
          {students.map(student => (
            <li
              key={student.id}
              onClick={() => {
                setStudentId(student.id);
                setSearch(`${student.firstName} ${student.lastName}`);
              }}
            >
              {student.firstName} {student.lastName}{' '}
              {student?.Class?.name && <span>({student.Class.name})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentSearch;
