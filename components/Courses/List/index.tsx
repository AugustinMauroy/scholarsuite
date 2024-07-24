'use client';
import { useState, useEffect, use } from 'react';
import { useToast } from '@/hooks/useToast';
import List from '@/components/Common/List';
import type { FC } from 'react';
import type { Course } from '@prisma/client';
import type { Tag } from '@/types/tag';

export type Patch = {
  userId: number;
  data: {
    opp: 'add' | 'remove';
    id: number;
  }[];
};

type CourseListProps = {
  userId: number;
  patch: Patch | null;
  setPatch: (patch: Patch) => void;
};

const CourseList: FC<CourseListProps> = ({ userId, patch, setPatch }) => {
  const toast = useToast();
  const [userCourseList, setUserCourseList] = useState<Course[]>([]);
  const [courseList, setCourseList] = useState<Course[]>([]);

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
    if (!patch) return;
    const debounce = setTimeout(() => {}, 1000);

    return () => clearTimeout(debounce);
  }, [patch]);

  const handleAddClass = (tag: Tag) => {
    const newCourse = courseList.find(Course => Course.id === tag.id);

    if (!newCourse) return;

    setUserCourseList([...userCourseList, newCourse]);

    if (!patch) {
      setPatch({
        userId,
        data: [{ opp: 'add', id: tag.id }],
      });

      return;
    } else {
      setPatch({
        userId,
        data: [...patch.data, { opp: 'add', id: tag.id }],
      });
    }
  };

  const handleRemoveClass = (tag: Tag) => {
    const newCourseList = userCourseList.filter(Course => Course.id !== tag.id);

    setUserCourseList(newCourseList);

    if (!patch) {
      setPatch({
        userId,
        data: [{ opp: 'remove', id: tag.id }],
      });

      return;
    } else {
      setPatch({
        userId,
        data: [...patch.data, { opp: 'remove', id: tag.id }],
      });
    }
  };

  return (
    <List
      list={courseList}
      activeList={userCourseList}
      onTagClick={handleAddClass}
      onTagRemove={handleRemoveClass}
    />
  );
};

export default CourseList;
