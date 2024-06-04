'use client';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import TagList from '@/components/Common/TagList';
import { useToast } from '@/hooks/useToast';
import type { FC } from 'react';
import type { Course } from '@prisma/client';

export type Patch = {
  userId: number;
  data: {
    opp: 'add' | 'remove';
    CourseId: number;
  }[];
};

type ClassListProps = {
  userId: number;
  patch: Patch | null;
  setPatch: (patch: Patch | null) => void;
};

const CourseList: FC<ClassListProps> = ({ userId, patch, setPatch }) => {
  const toast = useToast();
  const [userCourseList, setUserCourseList] = useState<Course[]>([]);
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Course[]>([]);
  const [focus, setFocus] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/course', {
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
        setUserCourseList(data.data);
      });
    fetch('/api/course', {
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
        setCourseList(data.data);
      });
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResult([]);

      return;
    }

    const result = courseList
      .filter(Course =>
        userCourseList.every(userCourse => userCourse.id !== Course.id)
      )
      .filter(Course =>
        Course.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    setSearchResult(result);
  }, [searchQuery, CourseList]);

  useEffect(() => {
    if (!patch) return;
    const debounce = setTimeout(() => {}, 1000);

    return () => clearTimeout(debounce);
  }, [patch]);

  const handleAddClass = (id: number) => {
    const newCourse = courseList.find(Course => Course.id === id);

    if (!newCourse) return;

    setUserCourseList([...userCourseList, newCourse]);

    if (!patch) {
      setPatch({
        userId,
        data: [{ opp: 'add', CourseId: id }],
      });

      return;
    } else {
      setPatch({
        userId,
        data: [...patch.data, { opp: 'add', CourseId: id }],
      });
    }
  };

  const handleRemoveClass = (id: number) => {
    const newCourseList = userCourseList.filter(Course => Course.id !== id);

    setUserCourseList(newCourseList);

    if (!patch) {
      setPatch({
        userId,
        data: [{ opp: 'remove', CourseId: id }],
      });

      return;
    } else {
      setPatch({
        userId,
        data: [...patch.data, { opp: 'remove', CourseId: id }],
      });
    }
  };

  return (
    <div className="relative flex items-center justify-start border-2 border-gray-200 py-2">
      <TagList
        tags={userCourseList}
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

export default CourseList;
