import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { EllipsisVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import Button from '@/components/Common/Button';
import DropDownMenu from '@/components/Common/DropDownMenu';
import StudentAvatar from '../StudentAvatar';
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
  actions?: ComponentProps<typeof Button>[];
  withInfo?: boolean;
  from?: string;
};

const StudentCard: FC<StudentCardProps> = ({
  student,
  actions,
  withInfo,
  from,
}) => {
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
    [student.id, from]
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
          <StudentAvatar student={student} />
          <div className={styles.content}>
            <h3 className={styles.firstName}>{student.firstName}</h3>
            <h3 className={styles.lastName}>{student.lastName}</h3>
            {student.className && (
              <small className={styles.className}>{student.className}</small>
            )}
          </div>
        </div>
        {actions && (
          <div className={styles.actions}>
            {actions.map((action, i) => (
              <Button key={i} className={styles.action} {...action} />
            ))}
          </div>
        )}
      </div>
      <DropDownMenu>
        <DropdownMenuPrimitive.Item asChild>
          <Link href={studentUrl}>View Student</Link>
        </DropdownMenuPrimitive.Item>
        <DropdownMenuPrimitive.Item asChild>
          <Link href={disciplinaryReportUrl}>Write Disciplinary Report</Link>
        </DropdownMenuPrimitive.Item>
      </DropDownMenu>
    </DropdownMenuPrimitive.Root>
  );
};

export default StudentCard;
