'use client';
// @TODO: Add to adminstrate ref of group
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
import Select from '@/components/Common/Select';
import { useToast } from '@/hooks/useToast';
import type { Group, SchoolLevel, Subject } from '@prisma/client';
import type { FC } from 'react';

type GroupsWithRelations = Group & {
  SchoolLevel: SchoolLevel | null;
  Subject: Subject | null;
};

const Table: FC = () => {
  const toast = useToast();
  const [groups, setGroups] = useState<GroupsWithRelations[]>([]);
  const [schoolLevels, setSchoolLevels] = useState<SchoolLevel[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [groupId, setGroupId] = useState<number>();
  const [name, setName] = useState('');
  const [schoolLevelId, setSchoolLevelId] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const groupRes = await fetch('/api/group');
      const schoolLevelRes = await fetch('/api/schoolLevel');
      const subjectRes = await fetch('/api/subject');

      const groupData = await groupRes.json();
      const schoolLevelData = await schoolLevelRes.json();
      const subjectData = await subjectRes.json();

      setGroups(groupData.data);
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
            <TriangleAlertIcon />
            All fields are required
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const group = await fetch('/api/group', {
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

    if (group.error) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            {group.error}
          </>
        ),
        kind: 'error',
      });

      return;
    }

    setGroups([...groups, group.data]);
    toast({
      message: (
        <>
          <CheckCircleIcon />
          Group added successfully
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
            <TriangleAlertIcon />
            All fields are required
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const group = await fetch('/api/group', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: groupId,
        name,
        schoolLevelId,
        subjectId,
      }),
    }).then(res => res.json());

    if (group.error) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            {group.error}
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const index = groups.findIndex(group => group.id === groupId);
    groups[index] = group.data;
    setGroups([...groups]);

    toast({
      message: (
        <>
          <CheckCircleIcon />
          Group updated successfully
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
          Add Group
        </Button>
      </DialogPrimitive.Trigger>
      <table>
        <thead>
          <tr>
            <th>Group</th>
            <th>School Level</th>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(group => (
            <tr key={group.id}>
              <td>{group.name}</td>
              <td>{group.SchoolLevel?.name}</td>
              <td>{group.Subject?.name}</td>
              <td>
                <DialogPrimitive.Trigger asChild>
                  <Button
                    kind="outline"
                    onClick={() => {
                      setGroupId(group.id);
                      setName(group.name || '');
                      setSchoolLevelId(group.schoolLevelId);
                      setSubjectId(group.subjectId);
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
        title={isAdding ? 'Add Group' : 'Edit Group'}
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
