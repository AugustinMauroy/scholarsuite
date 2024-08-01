import { useState, useEffect } from 'react';
import List from '@/components/Common/List';
import { useToast } from '@/hooks/useToast';
import type { Patch } from '@/types/patch';
import type { Tag } from '@/types/tag';
import type { Group } from '@prisma/client';
import type { FC } from 'react';

type GroupsListProps = {
  studentId: number;
  patch: Patch | null;
  setPatch: (patch: Patch) => void;
};

const GroupsList: FC<GroupsListProps> = ({ studentId, patch, setPatch }) => {
  const toast = useToast();
  const [studentGroupList, setStudentGroupList] = useState<Group[]>([]);
  const [groupList, setGroupList] = useState<Group[]>([]);

  useEffect(() => {
    fetch('/api/group/student', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast({
            message: data.error,
            kind: 'error',
          });

          return;
        }
        setStudentGroupList(data.data);
      });
    fetch('/api/group', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast({
            message: data.error,
            kind: 'error',
          });

          return;
        }
        setGroupList(data.data);
      });
  }, []);

  useEffect(() => {
    if (!patch) return;
    const debounce = setTimeout(() => {}, 1000);

    return () => clearTimeout(debounce);
  }, [patch]);

  const handleAddClass = (tag: Tag) => {
    const newGroup = groupList.find(Group => Group.id === tag.id);

    if (!newGroup) return;

    setStudentGroupList([...studentGroupList, newGroup]);

    if (!patch) {
      setPatch({
        id: studentId,
        data: [{ opp: 'add', id: tag.id }],
      });

      return;
    } else {
      setPatch({
        id: studentId,
        data: [...patch.data, { opp: 'add', id: tag.id }],
      });
    }
  };

  const handleRemoveClass = (tag: Tag) => {
    const newGroupList = studentGroupList.filter(Group => Group.id !== tag.id);

    setStudentGroupList(newGroupList);

    if (!patch) {
      setPatch({
        id: studentId,
        data: [{ opp: 'remove', id: tag.id }],
      });

      return;
    } else {
      setPatch({
        id: studentId,
        data: [...patch.data, { opp: 'remove', id: tag.id }],
      });
    }
  };

  return (
    <List
      list={groupList}
      activeList={studentGroupList}
      onTagClick={handleAddClass}
      onTagRemove={handleRemoveClass}
    />
  );
};

export default GroupsList;
