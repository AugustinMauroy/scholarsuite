'use client';
import {
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
} from '@heroicons/react/24/solid';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import Button from '@/components/Common/Button';
import EditModal from '@/components/Common/EditModal';
import Input from '@/components/Common/Input';
import Select from '@/components/Common/Select';
import { useToast } from '@/hooks/useToast';
import type { Course, SchoolLevel, Subject } from '@prisma/client';
import type { FC } from 'react';

type CoursesWithRelations = Course & {
  schoolLevel: SchoolLevel;
  subject: Subject;
};

const Table: FC = () => {
  const toast = useToast();
  const [courses, setCourses] = useState<CoursesWithRelations[]>([]);
  const [schoolLevels, setSchoolLevels] = useState<SchoolLevel[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [courseId, setCourseId] = useState<number>();
  const [name, setName] = useState('');
  const [schoolLevelId, setSchoolLevelId] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const courseRes = await fetch('/api/course');
      const schoolLevelRes = await fetch('/api/schoolLevel');
      const subjectRes = await fetch('/api/subject');

      const courseData = await courseRes.json();
      const schoolLevelData = await schoolLevelRes.json();
      const subjectData = await subjectRes.json();

      setCourses(courseData.data);
      setSchoolLevels(schoolLevelData.data);
      setSubjects(subjectData.data);
    };

    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!name || !schoolLevelId || !subjectId) {
      toast({
        message: (
          <>
            <ExclamationTriangleIcon />
            All fields are required
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const course = await fetch('/api/course', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        schoolLevelId,
        subjectId,
      }),
    }).then(res => res.json());

    if (course.error) {
      toast({
        message: (
          <>
            <ExclamationTriangleIcon />
            {course.error}
          </>
        ),
        kind: 'error',
      });

      return;
    }

    setCourses([...courses, course.data]);
    toast({
      message: (
        <>
          <CheckCircleIcon />
          Course added successfully
        </>
      ),
      kind: 'success',
    });
  };

  const handleEdit = async () => {
    if (!name || !schoolLevelId || !subjectId) {
      toast({
        message: (
          <>
            <ExclamationTriangleIcon />
            All fields are required
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const course = await fetch('/api/course', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: courseId,
        name,
        schoolLevelId,
        subjectId,
      }),
    }).then(res => res.json());

    if (course.error) {
      toast({
        message: (
          <>
            <ExclamationTriangleIcon />
            {course.error}
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const index = courses.findIndex(course => course.id === courseId);
    courses[index] = course.data;
    setCourses([...courses]);

    toast({
      message: (
        <>
          <CheckCircleIcon />
          Course updated successfully
        </>
      ),
      kind: 'success',
    });
  };

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <Button
          kind="outline"
          onClick={() => setIsAdding(true)}
          className="mb-4"
        >
          <PlusIcon />
          Add Course
        </Button>
      </DialogPrimitive.Trigger>
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>School Level</th>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.schoolLevel?.name}</td>
              <td>{course.subject?.name}</td>
              <td>
                <DialogPrimitive.Trigger asChild>
                  <Button
                    kind="outline"
                    onClick={() => {
                      setCourseId(course.id);
                      setName(course.name);
                      setSchoolLevelId(course.schoolLevelId);
                      setSubjectId(course.subjectId);
                      setIsAdding(false);
                    }}
                  >
                    <PencilIcon />
                    Edit
                  </Button>
                </DialogPrimitive.Trigger>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditModal
        title={isAdding ? 'Add Course' : 'Edit Course'}
        onClose={() => setIsAdding(false)}
      >
        <Input
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Select
          inline
          label="School Level"
          values={schoolLevels.map(level => ({
            value: level.id.toString(),
            label: level.name,
          }))}
          defaultValue={schoolLevelId?.toString()}
          onChange={value => setSchoolLevelId(Number(value))}
        />

        <Select
          inline
          label="Subject"
          values={subjects.map(subject => ({
            value: subject.id.toString(),
            label: subject.name,
          }))}
          defaultValue={subjectId?.toString()}
          onChange={value => setSubjectId(Number(value))}
        />
        <Button
          kind="outline"
          onClick={() => (isAdding ? handleAdd() : handleEdit())}
        >
          {isAdding ? <PlusIcon /> : <PencilIcon />}
          {isAdding ? 'Add' : 'Edit'}
        </Button>
      </EditModal>
    </DialogPrimitive.Root>
  );
};

export default Table;
