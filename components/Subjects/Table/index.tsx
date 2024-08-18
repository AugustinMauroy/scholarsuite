'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  PlusIcon,
  CheckCircleIcon,
  TriangleAlertIcon,
  PencilIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '@/components/Common/Button';
import EditModal from '@/components/Common/EditModal';
import Input from '@/components/Common/Input';
import { useToast } from '@/hooks/useToast';
import type { Subject } from '@prisma/client';
import type { FC } from 'react';

const Table: FC = () => {
  const toast = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [subjectId, setSubjectId] = useState<number>();
  const [name, setName] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('/api/subject');
        const { data } = await res.json();
        setSubjects(data);
      } catch (error) {
        toast({
          kind: 'error',
          message: (
            <>
              <TriangleAlertIcon />
              Failed to fetch subjects
            </>
          ),
        });
      }
    };

    fetchSubjects();
  }, []);

  const handleAdd = async () => {
    if (!name) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            Subject name cannot be empty
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const subject = await fetch('/api/subject', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        enabled,
      }),
    }).then(res => res.json());

    if (subject.error) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            {subject.error}
          </>
        ),
        kind: 'error',
      });

      return;
    }

    setSubjects([...subjects, subject.data]);
    toast({
      message: (
        <>
          <CheckCircleIcon />
          Subject added successfully
        </>
      ),
      kind: 'success',
    });
  };

  const handleEdit = async () => {
    if (!name) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            Subject name cannot be empty
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const subject = await fetch('/api/subject', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: subjectId,
        name,
        enabled,
      }),
    }).then(res => res.json());

    if (subject.error) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            {subject.error}
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const index = subjects.findIndex(subject => subject.id === subjectId);
    subjects[index] = subject.data;
    setSubjects([...subjects]);

    toast({
      message: (
        <>
          <CheckCircleIcon />
          Subject updated successfully
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
          onClick={() => {
            setIsAdding(true);
            setName('');
          }}
          className="mb-4"
        >
          <PlusIcon />
          Add Subject
        </Button>
      </DialogPrimitive.Trigger>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Enables</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(subject => (
            <tr key={subject.id}>
              <td>{subject.name}</td>
              <td>
                <Input
                  type="checkbox"
                  checked={subject.enabled}
                  disabled
                  aria-disabled={true}
                />
              </td>
              <td>
                <DialogPrimitive.Trigger asChild>
                  <Button
                    kind="outline"
                    onClick={() => {
                      setSubjectId(subject.id);
                      setName(subject.name);
                      setIsAdding(false);
                      setEnabled(subject.enabled);
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
        title={isAdding ? 'Add Subject' : 'Edit Subject'}
        onClose={() => setIsAdding(false)}
      >
        <Input
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Input
          type="checkbox"
          label="Enabled"
          checked={enabled}
          onChange={e => setEnabled(e.target.checked)}
        />
        <DialogPrimitive.Close asChild>
          <Button
            kind="outline"
            onClick={() => (isAdding ? handleAdd() : handleEdit())}
          >
            {isAdding ? <PlusIcon /> : <PencilIcon />}
            {isAdding ? 'Add' : 'Edit'}
          </Button>
        </DialogPrimitive.Close>
      </EditModal>
    </DialogPrimitive.Root>
  );
};

export default Table;
