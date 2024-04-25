'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useState } from 'react';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Select from '@/components/Common/Select';
import styles from './index.module.css';
import type { FC } from 'react';
import type { Student, Class } from '@prisma/client';

type StudentState = Student & { class: Class | null };

type TableProps = {
  students: StudentState[];
  possibleClasses: Class[];
};

const Table: FC<TableProps> = ({ students, possibleClasses }) => {
  const [studentList, setStudentList] = useState<StudentState[]>(students);
  const [selectedStudent, setSelectedStudent] = useState<StudentState | null>(
    null
  );

  const handleEdit = async () => {
    if (
      !selectedStudent ||
      selectedStudent === studentList.find(s => s.id === selectedStudent.id)
    )
      return;

    const response = await fetch(`/api/student/${selectedStudent.id}`, {
      method: 'PATCH',
      body: JSON.stringify(selectedStudent),
    });

    if (response.ok) {
      const updatedStudent = (await response.json()).student as StudentState;
      setStudentList(prevList =>
        prevList.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
      );
      setSelectedStudent(null);
    }
  };

  return (
    <DialogPrimitive.Root>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentList.map(student => (
            <tr key={student.id}>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.class?.name}</td>
              <td>
                <DialogPrimitive.Trigger asChild>
                  <Button onClick={() => setSelectedStudent(student)}>
                    <PencilIcon className="size-5" />
                    Edit
                  </Button>
                </DialogPrimitive.Trigger>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.overlay} />
        <DialogPrimitive.Content className={styles.modalContent}>
          <DialogPrimitive.Close asChild>
            <XMarkIcon
              className={styles.closeIcon}
              onClick={() => setSelectedStudent(null)}
            />
          </DialogPrimitive.Close>
          <DialogPrimitive.Title>Edit Student</DialogPrimitive.Title>
          <DialogPrimitive.Description>
            Update the student&apos;s information
          </DialogPrimitive.Description>
          <Input
            label="First Name"
            name="firstName"
            value={selectedStudent?.firstName || ''}
            onChange={e =>
              setSelectedStudent(prevStudent => ({
                ...(prevStudent as StudentState),
                firstName: e.target.value,
              }))
            }
          />
          <Input
            label="Last Name"
            name="lastName"
            value={selectedStudent?.lastName || ''}
            onChange={e =>
              setSelectedStudent(prevStudent => ({
                ...(prevStudent as StudentState),
                lastName: e.target.value,
              }))
            }
          />
          <Select
            label="Class"
            values={possibleClasses.map(c => ({
              value: c.id.toString(),
              label: c.name,
            }))}
            defaultValue={selectedStudent?.class?.id.toString()}
            onChange={v =>
              setSelectedStudent(prevStudent => ({
                ...(prevStudent as StudentState),
                classId: parseInt(v),
              }))
            }
          />
          <DialogPrimitive.Close asChild>
            <Button kind="outline" onClick={handleEdit}>
              Save
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Table;
