'use client';
import { ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useMemo } from 'react';
import Button from '@/components/Common/Button';
import Select from '@/components/Common/Select';
import Pagination from '@/components/Common/Pagination';
import styles from './index.module.css';
import type {
  AbsencePeriod,
  Student,
  AcademicYear,
  Attendance,
  Class,
  Group,
  AbsencePeriodStatus,
} from '@prisma/client';
import type { FC } from 'react';

type AbsenceWithRelations = AbsencePeriod & {
  Student: Student & { Class: Class | null };
  AcademicYear: AcademicYear;
  FirstAbsence: Attendance;
  LastAbsence: Attendance;
  NextPresence: Attendance | null;
  count: number;
};

const AbsencePeriodsList: FC = () => {
  const session = useSession();
  const router = useRouter();
  const [absencePeriods, setAbsencePeriods] = useState<
    AbsenceWithRelations[] | null
  >(null);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<AbsencePeriodStatus>('PENDING');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 10;

  useEffect(() => {
    if (!session.data?.user.id) return;

    fetch('/api/group/user', {
      method: 'POST',
      body: JSON.stringify({ userId: session.data.user.id }),
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          setGroups(data.data);
        });
      }
    });
  }, [session.data?.user.id]);

  useEffect(() => {
    if (!selectedGroup) return;

    fetch('/api/absence-period', {
      method: 'POST',
      body: JSON.stringify({
        groupId: selectedGroup,
        selectedStatus: selectedStatus,
        page: currentPage,
      }),
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          const absencePeriods = data.data.map(
            (absencePeriod: AbsenceWithRelations) => ({
              ...absencePeriod,
              FirstAbsence: {
                ...absencePeriod.FirstAbsence,
                date: new Date(absencePeriod.FirstAbsence.date),
              },
              LastAbsence: {
                ...absencePeriod.LastAbsence,
                date: new Date(absencePeriod.LastAbsence.date),
              },
              NextPresence: absencePeriod.NextPresence
                ? {
                    ...absencePeriod.NextPresence,
                    date: new Date(absencePeriod.NextPresence.date),
                  }
                : null,
            })
          );
          setAbsencePeriods(absencePeriods);
        });
      }
    });
  }, [selectedGroup, selectedStatus, currentPage]);

  const sortedAbsencePeriods = useMemo(() => {
    if (!absencePeriods) return [];

    return absencePeriods.sort((a, b) => {
      if (sortBy === 'studentName') {
        return sortOrder === 'asc'
          ? `${a.Student.firstName} ${a.Student.lastName}`.localeCompare(
              `${b.Student.firstName} ${b.Student.lastName}`
            )
          : `${b.Student.firstName} ${b.Student.lastName}`.localeCompare(
              `${a.Student.firstName} ${a.Student.lastName}`
            );
      } else if (sortBy === 'firstAbsence') {
        return sortOrder === 'asc'
          ? a.FirstAbsence.date.getTime() - b.FirstAbsence.date.getTime()
          : b.FirstAbsence.date.getTime() - a.FirstAbsence.date.getTime();
      } else if (sortBy === 'lastAbsence') {
        return sortOrder === 'asc'
          ? a.LastAbsence.date.getTime() - b.LastAbsence.date.getTime()
          : b.LastAbsence.date.getTime() - a.LastAbsence.date.getTime();
      } else if (sortBy === 'academicYear') {
        return sortOrder === 'asc'
          ? a.AcademicYear.name.localeCompare(b.AcademicYear.name)
          : b.AcademicYear.name.localeCompare(a.AcademicYear.name);
      } else if (sortBy === 'status') {
        return sortOrder === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }

      return 0;
    });
  }, [absencePeriods, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedAbsencePeriods.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAbsencePeriods = sortedAbsencePeriods.slice(
    startIndex,
    endIndex
  );

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={styles.filters}>
        <Select
          label="Group"
          values={
            groups?.map(group => ({
              label: group.name || group.ref,
              value: group.id.toString(),
            })) || []
          }
          onChange={v => setSelectedGroup(parseInt(v))}
          className={styles.groupSelect}
        />
        <Select
          label="Status"
          defaultValue={selectedStatus}
          values={
            [
              { label: 'Pending', value: 'PENDING' },
              { label: 'Justified', value: 'JUSTIFIED' },
              { label: 'Unjustified', value: 'UNJUSTIFIED' },
            ] as { label: string; value: AbsencePeriodStatus }[]
          }
          onChange={v => setSelectedStatus(v as AbsencePeriodStatus)}
        />
      </div>
      {absencePeriods !== null && absencePeriods.length > 0 ? (
        <div className={styles.table}>
          <table>
            <thead>
              <th
                className={styles.cursorPointer}
                onClick={() => handleSort('studentName')}
              >
                Student
                {sortBy === 'studentName' &&
                  (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
              </th>
              <th
                className={styles.cursorPointer}
                onClick={() => handleSort('firstAbsence')}
              >
                First Absence
                {sortBy === 'firstAbsence' &&
                  (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
              </th>
              <th
                className={styles.cursorPointer}
                onClick={() => handleSort('lastAbsence')}
              >
                Last Absence
                {sortBy === 'lastAbsence' &&
                  (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
              </th>
              <th
                className={styles.cursorPointer}
                onClick={() => handleSort('academicYear')}
              >
                Academic Year{' '}
                {sortBy === 'academicYear' &&
                  (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
              </th>
              <th
                className={styles.cursorPointer}
                onClick={() => handleSort('status')}
              >
                Status{' '}
                {sortBy === 'status' &&
                  (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
              </th>
              <th
                className={styles.cursorPointer}
                onClick={() => handleSort('count')}
              >
                Count{' '}
                {sortBy === 'count' &&
                  (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
              </th>
              <th>Actions</th>
            </thead>
            <tbody>
              {currentAbsencePeriods.map(absencePeriod => (
                <tr key={absencePeriod.id}>
                  <td>
                    {absencePeriod.Student.firstName}{' '}
                    {absencePeriod.Student.lastName}
                    <small> {absencePeriod.Student.Class?.name}</small>
                  </td>
                  <td>
                    {absencePeriod.FirstAbsence.date.toLocaleDateString()}
                  </td>
                  <td>{absencePeriod.LastAbsence.date.toLocaleDateString()}</td>
                  <td>{absencePeriod.AcademicYear.name}</td>
                  <td>{absencePeriod.status}</td>
                  <td>{absencePeriod.count}</td>
                  <td>
                    <Button
                      onClick={() =>
                        router.push(`/attendance/absence/${absencePeriod.id}`)
                      }
                    >
                      <Eye />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      ) : (
        <p>No absence periods found</p>
      )}
    </>
  );
};

export default AbsencePeriodsList;
