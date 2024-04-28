'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useState } from 'react';
import {
  PencilIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { useToast } from '@/hooks/useToast';
import styles from './index.module.css';
import type { FC } from 'react';
import type { Class, SchoolLevel } from '@prisma/client';

type ClassState = Class & { schoolLevel: SchoolLevel | null };

type TableProps = {
  classes: ClassState[];
};

const ClassTable: FC<TableProps> = ({ classes }) => {
  const toast = useToast();
  const [classList, setClassList] = useState<ClassState[]>(classes);
  const [selectedClass, setSelectedClass] = useState<ClassState | null>(null);

  const handleEdit = async () => {
    if (
      !selectedClass ||
      selectedClass === classList.find(c => c.id === selectedClass.id)
    ) {
      toast({
        message: (
          <>
            <ExclamationTriangleIcon />
            Please select a class to edit
          </>
        ),
        kind: 'warning',
      });

      return;
    }

    const response = await fetch(`/api/class/${selectedClass.id}`, {
      method: 'PATCH',
      body: JSON.stringify(selectedClass),
    });

    if (response.ok) {
      setClassList(prevList =>
        prevList.map(c => (c.id === selectedClass.id ? selectedClass : c))
      );
      setSelectedClass(null);

      toast({
        message: (
          <>
            <CheckCircleIcon />
            Class updated successfully
          </>
        ),
        duration: 5000,
      });
    }
  };

  return (
    <DialogPrimitive.Root>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>School Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classList.map(classItem => (
            <tr key={classItem.id}>
              <td>{classItem.name}</td>
              <td>{classItem.schoolLevel?.name}</td>
              <td>
                <DialogPrimitive.Trigger asChild>
                  <Button onClick={() => setSelectedClass(classItem)}>
                    <PencilIcon />
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
              onClick={() => setSelectedClass(null)}
            />
          </DialogPrimitive.Close>
          <DialogPrimitive.Title>Edit Class</DialogPrimitive.Title>
          <DialogPrimitive.Description>
            Update the class&apos;s information
          </DialogPrimitive.Description>

          <Input
            label="Name"
            name="name"
            value={selectedClass?.name || ''}
            onChange={e =>
              setSelectedClass(prevClass => ({
                ...(prevClass as ClassState),
                name: e.target.value,
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

export default ClassTable;
