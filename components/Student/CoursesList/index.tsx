'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import List from '@/components/Common/List';
import type { FC } from 'react';
import type { Course } from '@prisma/client';
import type { Tag } from '@/types/tag';
import type { Patch } from '@/types/patch';

type CourseListProps = {
  studentId: number;
  patch: Patch | null;
  setPatch: (patch: Patch) => void;
};

const CourseList: FC<CourseListProps> = ({ studentId, patch, setPatch }) => {
  const toast = useToast();
  const [studentCourseList, setStudentCourseList] = useState<Course[]>([]);
  const [courseList, setCourseList] = useState<Course[]>([]);

  useEffect(() => {
    fetch('/api/course/student', {
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
        setStudentCourseList(data.data);
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

    setStudentCourseList([...studentCourseList, newCourse]);

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
    const newCourseList = studentCourseList.filter(
      Course => Course.id !== tag.id
    );

    setStudentCourseList(newCourseList);

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
      list={courseList}
      activeList={studentCourseList}
      onTagClick={handleAddClass}
      onTagRemove={handleRemoveClass}
    />
  );
};

export default CourseList;
