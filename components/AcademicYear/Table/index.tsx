'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  PencilIcon,
  CheckCircleIcon,
  TriangleAlertIcon,
  PlusIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '@/components/Common/Button';
import EditModal from '@/components/Common/EditModal';
import Input from '@/components/Common/Input';
import { useToast } from '@/hooks/useToast';
import { generateCurrentAcademicYear, isPossible } from '@/utils/academicYear';
import type { AcademicYear } from '@prisma/client';
import type { FC } from 'react';

const Table: FC = () => {
  const toast = useToast();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [academicYearId, setAcademicYearId] = useState<number>();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const res = await fetch('/api/academicYear');
        const { data } = await res.json();
        setAcademicYears(data);
      } catch (error) {
        toast({
          kind: 'error',
          message: (
            <>
              <TriangleAlertIcon />
              Failed to fetch academic years
            </>
          ),
        });
      }
    };

    fetchAcademicYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModal = (edit: boolean, academicYear?: AcademicYear) => {
    if (academicYear) {
      setAcademicYearId(academicYear.id);
      setName(academicYear.name);
      setStartDate(
        new Date(academicYear.startDate).toISOString().split('T')[0]
      );
      setEndDate(new Date(academicYear.endDate).toISOString().split('T')[0]);
    } else {
      const preGeneratedData = generateCurrentAcademicYear();
      setName(preGeneratedData.name);
      setStartDate(preGeneratedData.startDate.toISOString().split('T')[0]);
      setEndDate(preGeneratedData.endDate.toISOString().split('T')[0]);
    }

    setIsAdding(edit);
  };

  const handleAdd = async () => {
    if (!name || !startDate || !endDate) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            Academic year cannot be empty
          </>
        ),
        kind: 'error',
      });

      return;
    }
    if (!isPossible(startDate, endDate)) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            Invalid date format
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const academicYear = await fetch('/api/academicYear', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        startDate,
        endDate,
      }),
    }).then(res => res.json());

    if (academicYear.error) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            {academicYear.error}
          </>
        ),
        kind: 'error',
      });

      return;
    }

    setAcademicYears([...academicYears, academicYear.data]);
    toast({
      message: (
        <>
          <CheckCircleIcon />
          Academic year added successfully
        </>
      ),
      kind: 'success',
    });
  };

  const handleEdit = async () => {
    if (!name || !startDate || !endDate) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            Academic year cannot be empty
          </>
        ),
        kind: 'error',
      });

      return;
    }
    if (!isPossible(startDate, endDate)) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            Invalid date format
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const academicYear = await fetch('/api/academicYear', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: academicYearId,
        name,
        startDate,
        endDate,
      }),
    }).then(res => res.json());

    if (academicYear.error) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            {academicYear.error}
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const index = academicYears.findIndex(
      academicYear => academicYear.id === academicYearId
    );

    academicYears[index] = academicYear.data;

    setAcademicYears([...academicYears]);
    toast({
      message: (
        <>
          <CheckCircleIcon />
          Academic year updated successfully
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
          onClick={() => handleOpenModal(true)}
          className="mb-4"
        >
          <PlusIcon />
          Add Academic Year
        </Button>
      </DialogPrimitive.Trigger>
      <table>
        <thead>
          <tr>
            <th>Academic Year</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
            <th>Current</th>
          </tr>
        </thead>
        <tbody>
          {academicYears.map(academicYear => (
            <tr key={academicYear.id}>
              <td>{academicYear.name}</td>
              <td>{new Date(academicYear.startDate).toLocaleDateString()}</td>
              <td>{new Date(academicYear.endDate).toLocaleDateString()}</td>
              <td>
                <Input
                  disabled
                  checked={academicYear.current}
                  type="checkbox"
                />
              </td>
              <td>
                <DialogPrimitive.Trigger asChild>
                  <Button
                    kind="outline"
                    onClick={() => handleOpenModal(false, academicYear)}
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
        title={isAdding ? 'Add Academic Year' : 'Edit Academic Year'}
        onClose={() => setIsAdding(false)}
      >
        <Input
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Input
          type="date"
          label="Start Date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          label="End Date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
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
