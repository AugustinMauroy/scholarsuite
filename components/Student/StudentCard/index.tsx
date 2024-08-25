import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { EllipsisVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import Button from '@/components/Common/Button';
import DropDownMenu from '@/components/Common/DropDownMenu';
import { getAcronymFromString } from '@/utils/string';
import styles from './index.module.css';
import type { Student, Class } from '@prisma/client';
import type { FC, ComponentProps } from 'react';

type StudentCardProps = {
  student: {
    id: Student['id'];
    firstName: Student['firstName'];
    lastName: Student['lastName'];
    className?: Class['name'];
  };
  image?: string;
  actions?: ComponentProps<typeof Button>[];
  withInfo?: boolean;
  from?: string;
};

const StudentCard: FC<StudentCardProps> = ({
  student,
  image,
  actions,
  withInfo,
  from,
}) => {
  const acronym = useMemo(
    () => getAcronymFromString(`${student.firstName} ${student.lastName}`),
    [student.firstName, student.lastName]
  );
  const studentUrl = useMemo(
    () =>
      `/student/${student.id}?` +
      (from ? new URLSearchParams({ from }).toString() : ''),
    [student.id, from]
  );
  const disciplinaryReportUrl = useMemo(
    () =>
      '/disciplinary-report?' +
      new URLSearchParams({
        studentId: student.id.toString(),
        'tab-key': 'create',
        from: from ? from : '',
      }).toString(),
    [student]
  );

  return (
    <DropdownMenuPrimitive.Root>
      <div className={styles.studentCard}>
        {withInfo && (
          <DropdownMenuPrimitive.Trigger className={styles.trigger}>
            <EllipsisVerticalIcon />
          </DropdownMenuPrimitive.Trigger>
        )}
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
          </div>
        </div>
        <div className={styles.actions}>
          {actions &&
            actions.map((action, i) => (
              <Button key={i} className={styles.action} {...action} />
            ))}
        </div>
      </div>
      <DropDownMenu>
        <DropdownMenuPrimitive.Item asChild>
          <Link href={studentUrl}>View Profile</Link>
        </DropdownMenuPrimitive.Item>
        <DropdownMenuPrimitive.Item asChild>
          <Link href={disciplinaryReportUrl}>Write Disciplinary Report</Link>
        </DropdownMenuPrimitive.Item>
      </DropDownMenu>
    </DropdownMenuPrimitive.Root>
  );
};

export default StudentCard;
