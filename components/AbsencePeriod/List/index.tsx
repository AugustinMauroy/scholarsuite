'use client';
import { EyeIcon, CircleDotIcon, CircleDotDashedIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useFormatter } from 'next-intl';
import Badge from '@/components/Common/Badge';
import Button from '@/components/Common/Button';
import Select from '@/components/Common/Select';
import Card from '@/components/Common/Card';
import Pagination from '@/components/Common/Pagination';
import BaseLayout from '@/components/Layout/Base';
import type {
  AbsencePeriod,
  Student,
  AcademicYear,
  Attendance,
  Class,
  Group,
  AbsencePeriodStatus,
  TimeSlot,
} from '@prisma/client';
import type { FC } from 'react';
import type { DateTimeFormatOptions } from 'next-intl';

type AbsenceWithRelations = AbsencePeriod & {
  Student: Student & { Class: Class | null };
  AcademicYear: AcademicYear;
  FirstAbsence: Attendance & {
    TimeSlot: TimeSlot;
  };
  LastAbsence: Attendance & {
    TimeSlot: TimeSlot;
  };
  NextPresence:
    | (Attendance & {
        TimeSlot: TimeSlot;
      })
    | null;
  count: number;
};

const AbsencePeriodsList: FC = () => {
  const session = useSession();
  const router = useRouter();
  const format = useFormatter();
  const [absencePeriods, setAbsencePeriods] = useState<
    AbsenceWithRelations[] | null
  >(null);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<AbsencePeriodStatus>('OPEN');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const dateTimeOptions: DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
  };

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

  const totalPages =
    absencePeriods && Math.ceil(absencePeriods.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAbsencePeriods =
    absencePeriods && absencePeriods.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <BaseLayout
      title="Absence Periods"
      actions={
        <div className="mb-4 flex flex-row gap-2">
          <Select
            label="Group"
            inline
            placeholder="Select a group"
            values={
              groups?.map(group => ({
                label: group.name || group.ref,
                value: group.id.toString(),
              })) || []
            }
            onChange={v => setSelectedGroup(parseInt(v))}
          />
          <Select
            label="Status"
            defaultValue={selectedStatus}
            inline
            values={[
              {
                label: 'Open',
                value: 'OPEN',
                iconImage: <CircleDotIcon className="text-green-500" />,
              },
              {
                label: 'Closed',
                value: 'CLOSED',
                iconImage: <CircleDotDashedIcon className="text-red-500" />,
              },
            ]}
            onChange={v => setSelectedStatus(v as AbsencePeriodStatus)}
          />
        </div>
      }
    >
      {absencePeriods !== null &&
      currentAbsencePeriods &&
      absencePeriods.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentAbsencePeriods.map(absencePeriod => (
            <Card key={absencePeriod.id} className="flex flex-col gap-2.5">
              <h3 className="text-lg font-semibold">
                {absencePeriod.Student.firstName}{' '}
                {absencePeriod.Student.lastName}{' '}
                {absencePeriod.Student.Class?.name && (
                  <small className="text-sm font-normal text-gray-600 dark:text-gray-400">
                    ({absencePeriod.Student.Class.name})
                  </small>
                )}
              </h3>
              <p>
                First Absence: {absencePeriod.FirstAbsence.TimeSlot.name}{' '}
                {format.dateTime(
                  absencePeriod.FirstAbsence.date,
                  dateTimeOptions
                )}{' '}
                <br />
                Last Absence: {absencePeriod.LastAbsence.TimeSlot.name}{' '}
                {absencePeriod.FirstAbsence.date.toDateString() !==
                  absencePeriod.LastAbsence.date.toDateString() &&
                  format.dateTime(
                    absencePeriod.LastAbsence.date,
                    dateTimeOptions
                  )}
              </p>
              <Badge
                kind={absencePeriod.status === 'OPEN' ? 'success' : 'error'}
              >
                {absencePeriod.status === 'OPEN' ? (
                  <CircleDotIcon className="mr-2" />
                ) : (
                  <CircleDotDashedIcon className="mr-2" />
                )}
                {absencePeriod.status}
              </Badge>
              <p>Count: {absencePeriod.count}</p>
              <Button
                onClick={() =>
                  router.push(`/attendance/absence/${absencePeriod.id}`)
                }
                className="mt-2"
              >
                <EyeIcon className="mr-2" />
                View
              </Button>
            </Card>
          ))}
        </div>
      ) : !selectedGroup ? (
        <p className="text-center">Please select a group</p>
      ) : (
        <p className="text-center">No absence periods found</p>
      )}
      {absencePeriods &&
        absencePeriods.length > 0 &&
        totalPages &&
        totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
    </BaseLayout>
  );
};

export default AbsencePeriodsList;
