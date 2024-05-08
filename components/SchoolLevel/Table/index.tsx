'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import {
  PencilIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Select from '@/components/Common/Select';
import { useToast } from '@/hooks/useToast';
import styles from './index.module.css';
import type { FC } from 'react';
import type { SchoolLevel } from '@prisma/client';

const SchoolLevelsTable: FC = () => {
  const toast = useToast();
  const [schoolLevels, setSchoolLevels] = useState<SchoolLevel[]>([]);
  const [selectedSchoolLevel, setSelectedSchoolLevel] =
    useState<SchoolLevel | null>(null);

  useEffect(() => {
    fetch('/api/schoolLevel')
      .then(response => response.json())
      .then(data => setSchoolLevels(data.data));
  }, []);

  const handleEdit = async () => {
    if (!selectedSchoolLevel) return;

    const response = await fetch('/api/schoolLevel', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedSchoolLevel),
    });

    response.json().then(data => {
      if (data.error) {
        toast({
          message: (
            <>
              <ExclamationTriangleIcon />
              {data.error}
            </>
          ),
          kind: 'error',
        });
        setSelectedSchoolLevel(null);

        return;
      }

      toast({
        message: (
          <>
            <CheckCircleIcon />
            User updated
          </>
        ),
        kind: 'success',
      });
      setSelectedSchoolLevel(null);
      setSchoolLevels(prev =>
        prev.map(user =>
          user.id === selectedSchoolLevel.id ? selectedSchoolLevel : user
        )
      );
    });
  };

  return (
    <DialogPrimitive.Root>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schoolLevels.map(schoolLevel => (
            <tr key={schoolLevel.id}>
              <td>{schoolLevel.id}</td>
              <td>{schoolLevel.name}</td>
              <td>
                <DialogPrimitive.Trigger asChild>
                  <Button onClick={() => setSelectedSchoolLevel(schoolLevel)}>
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
        <DialogPrimitive.Overlay className={styles.modalOverlay} />
        <DialogPrimitive.Content className={styles.modalContent}>
          <DialogPrimitive.Close asChild>
            <XMarkIcon
              className={styles.closeIcon}
              onClick={() => setSelectedSchoolLevel(null)}
            />
          </DialogPrimitive.Close>
          <DialogPrimitive.Title>
            School Level: {selectedSchoolLevel?.name}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description>
            Edit the school level
          </DialogPrimitive.Description>
          <Input
            label="Name"
            value={selectedSchoolLevel?.name}
            onChange={e =>
              selectedSchoolLevel &&
              setSelectedSchoolLevel({
                ...selectedSchoolLevel,
                name: e.target.value,
              })
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

export default SchoolLevelsTable;
