import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { useMemo } from 'react';
import { getAcronymFromString } from '@/utils/string';
import styles from './index.module.css';
import type { Student, Class } from '@prisma/client';
import type { FC } from 'react';

type StudentAvatarProps = {
  student: Student & { Class?: Class };
};

const StudentAvatar: FC<StudentAvatarProps> = ({ student }) => {
  const acronym = useMemo(
    () => getAcronymFromString(`${student.firstName} ${student.lastName}`),
    [student.firstName, student.lastName]
  );

  return (
    <AvatarPrimitive.Root className={styles.avatar}>
      <AvatarPrimitive.Image
        src={
          student.image
            ? `http://localhost:3000/api/content/student-picture/${student.id}`
            : undefined
        }
        alt={acronym}
        loading="lazy"
        className={styles.avatar}
      />
      <AvatarPrimitive.Fallback>{acronym}</AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};

export default StudentAvatar;
