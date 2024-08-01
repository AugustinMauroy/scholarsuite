'use client';
import { useState, useEffect } from 'react';
import List from '@/components/Common/List';
import { useToast } from '@/hooks/useToast';
import type { Patch } from '@/types/patch';
import type { Tag } from '@/types/tag';
import type { Group } from '@prisma/client';
import type { FC } from 'react';

type GroupListProps = {
  userId: number;
  patch: Patch | null;
  setPatch: (patch: Patch) => void;
};

const GroupList: FC<GroupListProps> = ({ userId, patch, setPatch }) => {
  const toast = useToast();
  const [userGroupList, setUserGroupList] = useState<Group[]>([]);
  const [groupList, setGroupList] = useState<Group[]>([]);

  useEffect(() => {
    fetch('/api/group/user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
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
        setUserGroupList(data.data);
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

    setUserGroupList([...userGroupList, newGroup]);

    if (!patch) {
      setPatch({
        id: userId,
        data: [{ opp: 'add', id: tag.id }],
      });

      return;
    } else {
      setPatch({
        id: userId,
        data: [...patch.data, { opp: 'add', id: tag.id }],
      });
    }
  };

  const handleRemoveClass = (tag: Tag) => {
    const newGroupList = userGroupList.filter(Group => Group.id !== tag.id);

    setUserGroupList(newGroupList);

    if (!patch) {
      setPatch({
        id: userId,
        data: [{ opp: 'remove', id: tag.id }],
      });

      return;
    } else {
      setPatch({
        id: userId,
        data: [...patch.data, { opp: 'remove', id: tag.id }],
      });
    }
  };

  return (
    <List
      list={groupList}
      activeList={userGroupList}
      onTagClick={handleAddClass}
      onTagRemove={handleRemoveClass}
    />
  );
};

export default GroupList;
