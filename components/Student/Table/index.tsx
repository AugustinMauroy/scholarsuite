'use client';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { PencilIcon, CheckCircleIcon, TriangleAlertIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import Avatar from '@/components/Common/Avatar';
import Button from '@/components/Common/Button';
import DropZone from '@/components/Common/DropZone';
import EditModal from '@/components/Common/EditModal';
import Input from '@/components/Common/Input';
import Label from '@/components/Common/Label';
import Select from '@/components/Common/Select';
import { useToast } from '@/hooks/useToast';
import { getAcronymFromString } from '@/utils/string';
import GroupsList from '../GroupsList';
import styles from './index.module.css';
import type { Patch } from '@/types/patch';
import type { Student, Class } from '@prisma/client';
import type { FC } from 'react';

type StudentState = Student & { Class: Class | null };
type ClassWithSchoolLevel = Class & { SchoolLevel: { name: string } };

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
  const [groupPatch, setGroupPatch] = useState<Patch | null>(null);

  const selectClassValue = useMemo(
    () =>
      possibleClasses.map(c => ({
        label: (
          <>
            {c.name} <small>{c.SchoolLevel.name}</small>
          </>
        ),
        value: c.id.toString(),
      })),
    [possibleClasses]
  );

  const handlePatch = async () => {
    const res = await fetch('/api/student/group', {
      method: 'PATCH',
      body: JSON.stringify(groupPatch),
    });

    if (res.ok) {
      setGroupPatch(null);
      toast({
        message: (
          <>
            <CheckCircleIcon />
            Groups updated successfully
          </>
        ),
        kind: 'success',
      });
    } else {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            Error updating groups
          </>
        ),
        kind: 'error',
      });
    }
  };

  const handleEdit = async () => {
    if (groupPatch) await handlePatch();
    if (selectedStudent) {
      const formData = new FormData();
      formData.append('firstName', selectedStudent.firstName);
      formData.append('lastName', selectedStudent.lastName);
      if (selectedStudent.classId)
        formData.append('classId', selectedStudent.classId.toString());
      if (selectedStudent.contactEmail)
        formData.append('contactEmail', selectedStudent.contactEmail);
      formData.append('enabled', selectedStudent.enabled.toString());
      if (file) formData.append('file', file);

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
              <td>{student.Class?.name}</td>
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
              defaultValue={selectedStudent.Class?.id.toString()}
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
            <Label>Groups</Label>
            <GroupsList
              studentId={selectedStudent.id}
              patch={groupPatch}
              setPatch={setGroupPatch}
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
