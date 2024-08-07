import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { useMemo } from 'react';
import Badge from '@/components/Common/Badge';
import Button from '@/components/Common/Button';
import { getAcronymFromString } from '@/utils/string';
import styles from './index.module.css';
import type { Student } from '@prisma/client';
import type { FC, ComponentProps } from 'react';

type StudentCardProps = {
  student: {
    firstName: Student['firstName'];
    lastName: Student['lastName'];
  };
  badge?: ComponentProps<typeof Badge>;
  image?: string;
  actions?: ComponentProps<typeof Button>[];
};

const StudentCard: FC<StudentCardProps> = ({
  student,
  badge,
  image,
  actions,
}) => {
  const acronym = useMemo(
    () => getAcronymFromString(`${student.firstName} ${student.lastName}`),
    [student.firstName, student.lastName]
  );

  return (
    <div className={styles.studentCard}>
      <div className={styles.info}>
        {image ? (
          <AvatarPrimitive.Root className={styles.avatar}>
            <AvatarPrimitive.Image
              src={image}
              alt={acronym}
              loading="lazy"
              className={styles.avatar}
            />
            <AvatarPrimitive.Fallback>{acronym}</AvatarPrimitive.Fallback>
          </AvatarPrimitive.Root>
        ) : (
          <span className={styles.avatar}>
            <span className={styles.avatar}>{acronym}</span>
          </span>
        )}
        <div className={styles.content}>
          <h3>
            {student.firstName} {student.lastName}
          </h3>
          {badge && <Badge {...badge} />}
        </div>
      </div>
      <div className={styles.actions}>
        {actions && actions.map((action, i) => <Button key={i} {...action} />)}
      </div>
    </div>
  );
};

export default StudentCard;
