'use client';
import {
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import Button from '@/components/Common/Button';
import EditModal from '@/components/Common/EditModal';
import Input from '@/components/Common/Input';
import { useToast } from '@/hooks/useToast';
import type { SchoolLevel } from '@prisma/client';
import type { FC } from 'react';

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

    if (response.ok) {
      const newSchoolLevels = await fetch('/api/schoolLevel')
        .then(response => response.json())
        .then(data => data.data);
      setSchoolLevels(newSchoolLevels);

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
    } else {
      const data = await response.json();
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
    }
  };

  return (
    <DialogPrimitive.Root>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schoolLevels
            .sort((a, b) => a.order - b.order)
            .map(schoolLevel => (
              <tr key={schoolLevel.id}>
                <td>{schoolLevel.order}</td>
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
      <EditModal
        title="Edit School Level"
        onClose={() => setSelectedSchoolLevel(null)}
      >
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
        <Input
          label="Order"
          type="number"
          value={selectedSchoolLevel?.order}
          onChange={e =>
            selectedSchoolLevel &&
            setSelectedSchoolLevel({
              ...selectedSchoolLevel,
              order: parseInt(e.target.value),
            })
          }
        />
        <Button type="submit" kind="outline" onClick={() => handleEdit()}>
          Save
        </Button>
      </EditModal>
    </DialogPrimitive.Root>
  );
};

export default SchoolLevelsTable;
