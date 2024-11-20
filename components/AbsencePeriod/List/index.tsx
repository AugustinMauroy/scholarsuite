'use client';
import {
  CircleDotIcon,
  CircleDotDashedIcon,
  NotepadTextIcon,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useFormatter } from 'next-intl';
import Badge from '@/components/Common/Badge';
import Button from '@/components/Common/Button';
import Select from '@/components/Common/Select';
import Pagination from '@/components/Common/Pagination';
import BaseLayout from '@/components/Layout/Base';
import type {
  AbsencePeriod,
  Student,
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
  FirstAbsence: Attendance & {
    TimeSlot: TimeSlot;
  };
  LastAbsence: Attendance & {
    TimeSlot: TimeSlot;
  };
  count: number;
};

const AbsencePeriodsList: FC = () => {
  const session = useSession();
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
        <table className="w-full">
          <thead className="border-b-2 border-gray-200 dark:border-gray-800">
            <tr>
              <th className="text-left">Student</th>
              <th className="text-left">First Absence</th>
              <th className="text-left">Last Absence</th>
              <th className="text-left">Justify Overview</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {currentAbsencePeriods.map(absencePeriod => (
              <tr
                key={absencePeriod.id}
                className="odd:bg-white even:bg-gray-50 odd:dark:bg-gray-900 even:dark:bg-gray-800"
              >
                <td className="flex justify-between pr-2">
                  {absencePeriod.Student.firstName}{' '}
                  {absencePeriod.Student.lastName}
                  <small className="text-gray-500 dark:text-gray-400">
                    {' '}
                    ({absencePeriod.Student.Class?.name})
                  </small>
                </td>
                <td>
                  {format.dateTime(
                    absencePeriod.FirstAbsence.date,
                    dateTimeOptions
                  )}
                  <br />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {absencePeriod.FirstAbsence.TimeSlot.name}
                  </span>
                </td>
                <td>
                  {format.dateTime(
                    absencePeriod.LastAbsence.date,
                    dateTimeOptions
                  )}
                  <br />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {absencePeriod.LastAbsence.TimeSlot.name}
                  </span>
                </td>
                <td>NOT IMPLEMENTED</td>
                <td>
                  <Badge
                    kind={absencePeriod.status === 'OPEN' ? 'success' : 'error'}
                  >
                    {absencePeriod.status === 'OPEN' ? (
                      <CircleDotIcon className="text-green-500" />
                    ) : (
                      <CircleDotDashedIcon className="text-red-500" />
                    )}
                    {absencePeriod.status}
                  </Badge>
                </td>
                <td>
                  <Button onClick={() => alert('Not implemented yet')}>
                    Justify
                    <NotepadTextIcon />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
