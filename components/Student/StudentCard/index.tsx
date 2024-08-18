import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { EllipsisVerticalIcon } from 'lucide-react';
import { useMemo } from 'react';
import Button from '@/components/Common/Button';
import { getAcronymFromString } from '@/utils/string';
import styles from './index.module.css';
import type { Student, Class } from '@prisma/client';
import type { FC, ComponentProps } from 'react';

type StudentCardProps = {
  student: {
    firstName: Student['firstName'];
    lastName: Student['lastName'];
    className?: Class['name'];
  };
  image?: string;
  actions?: ComponentProps<typeof Button>[];
  withInfo?: boolean;
};

const StudentCard: FC<StudentCardProps> = ({
  student,
  image,
  actions,
  withInfo,
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
          <h3 className={styles.firstName}>{student.firstName}</h3>
          <h3 className={styles.lastName}>{student.lastName}</h3>
          {student.className && (
            <small className={styles.className}>{student.className}</small>
          )}
          {withInfo && (
            <button className={styles.more}>
              <EllipsisVerticalIcon />
            </button>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        {actions &&
          actions.map((action, i) => (
            <Button key={i} className={styles.action} {...action} />
          ))}
      </div>
    </div>
  );
};

export default StudentCard;
