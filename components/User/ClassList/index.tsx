'use client';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import TagList from '@/components/Common/TagList';
import { useToast } from '@/hooks/useToast';
import type { FC } from 'react';
import type { Class } from '@prisma/client';

export type Patch = {
  userId: number;
  data: {
    opp: 'add' | 'remove';
    classId: number;
  }[];
};

type ClassListProps = {
  userId: number;
  patch: Patch | null;
  setPatch: (patch: Patch | null) => void;
};

const ClassList: FC<ClassListProps> = ({ userId, patch, setPatch }) => {
  const toast = useToast();
  const [userClassList, setUserClassList] = useState<Class[]>([]);
  const [ClassList, setClassList] = useState<Class[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Class[]>([]);
  const [focus, setFocus] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/class', {
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
        setUserClassList(data.data);
      });
    fetch('/api/class', {
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
        setClassList(data.data);
      });
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResult([]);

      return;
    }

    const result = ClassList.filter(Class =>
      userClassList.every(userClass => userClass.id !== Class.id)
    ).filter(Class =>
      Class.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResult(result);
  }, [searchQuery, ClassList]);

  useEffect(() => {
    if (!patch) return;
    const debounce = setTimeout(() => {}, 1000);

    return () => clearTimeout(debounce);
  }, [patch]);

  const handleAddClass = (id: number) => {
    const newClass = ClassList.find(Class => Class.id === id);

    if (!newClass) return;

    setUserClassList([...userClassList, newClass]);
    if (!patch) {
      setPatch({
        userId,
        data: [{ opp: 'add', classId: id }],
      });

      return;
    } else {
      setPatch({
        userId,
        data: [...patch.data, { opp: 'add', classId: id }],
      });
    }
  };

  const handleRemoveClass = (id: number) => {
    const newClassList = userClassList.filter(Class => Class.id !== id);
    setUserClassList(newClassList);

    if (!patch) {
      setPatch({
        userId,
        data: [{ opp: 'remove', classId: id }],
      });

      return;
    } else {
      setPatch({
        userId,
        data: [...patch.data, { opp: 'remove', classId: id }],
      });
    }
  };

  return (
    <div className="relative flex items-center justify-start border-2 border-gray-200 py-2">
      <TagList
        tags={userClassList}
        onClick={handleRemoveClass}
        className="w-1/2"
        icon={<XMarkIcon />}
      />
      <input
        className="w-1/2 border-l-2 border-gray-200 p-2 caret-brand-500 focus:outline-none"
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 200)}
      />
      {searchResult.length > 0 && focus && (
        <div className="absolute right-0 top-full my-2 w-1/2 border-2 border-gray-200 bg-white py-2">
          <TagList
            tags={searchResult}
            onClick={handleAddClass}
            icon={<PlusIcon />}
          />
        </div>
      )}
    </div>
  );
};

export default ClassList;
