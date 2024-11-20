import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { EllipsisVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import Button from '@/components/Common/Button';
import DropDownMenu from '@/components/Common/DropDownMenu';
import Card from '@/components/Common/Card';
import StudentAvatar from '../StudentAvatar';
import styles from './index.module.css';
import type { Student, Class } from '@prisma/client';
import type { FC, ComponentProps } from 'react';

type StudentCardProps = {
  student: Student & { Class?: Class };
  actions?: ComponentProps<typeof Button>[];
  withMore?: boolean;
  withDateOfBirth?: boolean;
  from?: string;
};

const StudentCard: FC<StudentCardProps> = ({
  student,
  actions,
  withMore,
  withDateOfBirth,
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
      '/disciplinary-reports/create?' +
      new URLSearchParams({
        studentId: student.id.toString(),
        from: from ? from : '',
      }).toString(),
    [student.id, from]
  );

  return (
    <DropdownMenuPrimitive.Root>
      <Card className={styles.card}>
        {withMore && (
          <DropdownMenuPrimitive.Trigger className={styles.trigger}>
            <EllipsisVerticalIcon />
          </DropdownMenuPrimitive.Trigger>
        )}
        <div className={styles.info}>
          <StudentAvatar student={student} />
          <div className={styles.content}>
            <h3 className={styles.name}>
              {student.firstName} {student.lastName}
            </h3>
            <span className={styles.info}>
              {student.Class && <small>{student.Class.name}</small>}
              {withDateOfBirth && student.dateOfBirth && (
                <small>
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </small>
              )}
            </span>
          </div>
        </div>
        {actions && (
          <div className={styles.actions}>
            {actions.map((action, i) => (
              <Button key={i} className={styles.action} {...action} />
            ))}
          </div>
        )}
      </Card>
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
