'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { useMemo, useState } from 'react';
import {
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import DropZone from '@/components/Common/DropZone';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Select from '@/components/Common/Select';
import { useToast } from '@/hooks/useToast';
import EditModal from '@/components/Common/EditModal';
import Avatar from '@/components/Common/Avatar';
import { getAcronymFromString } from '@/utils/string';
import CourseList from '../CoursesList';
import styles from './index.module.css';
import type { FC } from 'react';
import type { Student, Class } from '@prisma/client';
import type { Patch } from '@/types/patch';

type StudentState = Student & { class: Class | null };
type ClassWithSchoolLevel = Class & { schoolLevel: { name: string } };

type TableProps = {
  students: StudentState[];
  possibleClasses: ClassWithSchoolLevel[];
};

const Table: FC<TableProps> = ({ students, possibleClasses }) => {
  const toast = useToast();
  const [studentList, setStudentList] = useState<StudentState[]>(students);
  const [selectedStudent, setSelectedStudent] = useState<StudentState | null>(
    null
  );
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [displayRemove, setDisplayRemove] = useState(false);
  const [coursePatch, setCoursePatch] = useState<Patch | null>(null);

  const selectClassValue = useMemo(
    () =>
      possibleClasses.map(c => ({
        label: (
          <>
            {c.name} <small>{c.schoolLevel.name}</small>
          </>
        ),
        value: c.id.toString(),
      })),
    [possibleClasses]
  );
  console.log('selectClassValue', selectClassValue);

  const handlePatch = async () => {
    const res = await fetch('/api/student/course', {
      method: 'PATCH',
      body: JSON.stringify(coursePatch),
    });

    if (res.ok) {
      setCoursePatch(null);
      toast({
        message: (
          <>
            <CheckCircleIcon />
            Courses updated successfully
          </>
        ),
        kind: 'success',
      });
    } else {
      toast({
        message: (
          <>
            <ExclamationTriangleIcon />
            Error updating courses
          </>
        ),
        kind: 'error',
      });
    }
  };

  const handleEdit = async () => {
    if (coursePatch) await handlePatch();
    if (selectedStudent) {
      const formData = new FormData();
      formData.append('firstName', selectedStudent.firstName);
      formData.append('lastName', selectedStudent.lastName);
      selectedStudent.classId &&
        formData.append('classId', selectedStudent.classId.toString());
      selectedStudent.contactEmail &&
        formData.append('contactEmail', selectedStudent.contactEmail);
      formData.append('enabled', selectedStudent.enabled.toString());
      file && formData.append('file', file);

      const response = await fetch(`/api/student/${selectedStudent.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        const updatedStudent = (await response.json()).student as StudentState;
        setStudentList(prevList =>
          prevList.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
        );
        setSelectedStudent(null);
        setFile(null);

        toast({
          message: (
            <>
              <CheckCircleIcon />
              Student updated successfully
            </>
          ),
          kind: 'success',
        });
      }
    }
  };

  return (
    <DialogPrimitive.Root>
      <table>
        <thead>
          <tr>
            <th />
            <th>First Name</th>
            <th>Last Name</th>
            <th>Enabled</th>
            <th>Class</th>
            <th>Contact Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentList.map(student => (
            <tr key={student.id}>
              <td>
                <Avatar
                  src={`http://localhost:3000/api/content/student-picture/${student.id}`}
                  alt={getAcronymFromString(
                    `${student.firstName} ${student.lastName}`
                  )}
                />
              </td>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>
                <Input type="checkbox" checked={student.enabled} disabled />
              </td>
              <td>{student.class?.name}</td>
              <td>{student.contactEmail}</td>
              <td>
                <DialogPrimitive.Trigger asChild>
                  <Button onClick={() => setSelectedStudent(student)}>
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
        title="Edit Student"
        description="Update the student's information"
        onClose={() => setSelectedStudent(null)}
      >
        {selectedStudent && (
          <>
            {imagePreview ? (
              <AvatarPrimitive.Root
                className={styles.avatarRoot}
                onMouseEnter={() => setDisplayRemove(true)}
                onMouseLeave={() => setDisplayRemove(false)}
              >
                <AvatarPrimitive.Image
                  src={imagePreview}
                  alt="Student's photo"
                  className={styles.avatar}
                />
                <AvatarPrimitive.Fallback className={styles.avatar}>
                  {getAcronymFromString(
                    `${selectedStudent.firstName} ${selectedStudent.lastName}`
                  )}
                </AvatarPrimitive.Fallback>
                {displayRemove && (
                  <button
                    className={styles.avatarRemove}
                    onClick={() => {
                      setFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove
                  </button>
                )}
              </AvatarPrimitive.Root>
            ) : (
              <DropZone
                file={file}
                setFile={(file: File) => {
                  setFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
                title="Student's photo"
              />
            )}
            <Input
              label="First Name"
              name="firstName"
              value={selectedStudent.firstName || ''}
              onChange={e =>
                setSelectedStudent({
                  ...selectedStudent,
                  firstName: e.target.value,
                })
              }
            />
            <Input
              label="Last Name"
              name="lastName"
              value={selectedStudent.lastName || ''}
              onChange={e =>
                setSelectedStudent({
                  ...selectedStudent,
                  lastName: e.target.value,
                })
              }
            />
            <Select
              label="Class"
              inline
              values={selectClassValue}
              defaultValue={selectedStudent.class?.id.toString()}
              onChange={v =>
                setSelectedStudent({
                  ...selectedStudent,
                  classId: parseInt(v),
                })
              }
            />
            <Input
              label="Contact Email"
              name="email"
              value={selectedStudent.contactEmail || ''}
              onChange={e =>
                setSelectedStudent({
                  ...selectedStudent,
                  contactEmail: e.target.value,
                })
              }
            />
            <Input
              label="Enabled"
              name="enabled"
              type="checkbox"
              checked={selectedStudent.enabled}
              onChange={e =>
                setSelectedStudent({
                  ...selectedStudent,
                  enabled: e.target.checked,
                })
              }
            />
            <CourseList
              studentId={selectedStudent.id}
              patch={coursePatch}
              setPatch={setCoursePatch}
            />
            <DialogPrimitive.Close asChild>
              <Button kind="outline" onClick={handleEdit}>
                Save
              </Button>
            </DialogPrimitive.Close>
          </>
        )}
      </EditModal>
    </DialogPrimitive.Root>
  );
};

export default Table;
