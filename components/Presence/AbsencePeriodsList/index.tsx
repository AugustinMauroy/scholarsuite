'use client';
import { Search, ArrowUp, ArrowDown, Eye, Command } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef, useMemo } from 'react';
import Button from '@/components/Common/Button';
import Select from '@/components/Common/Select';
import { useCommand } from '@/hooks/useCommand';
import type {
  AbsencePeriod,
  Student,
  AcademicYear,
  Presence,
  Class,
  Group,
} from '@prisma/client';
import type { FC, ChangeEvent } from 'react';

type AbsenceWithRelations = AbsencePeriod & {
  Student: Student & { Class: Class | null };
  AcademicYear: AcademicYear;
  FirstAbsence: Presence;
  LastAbsence: Presence;
  NextPresence: Presence | null;
};

const AbsencePeriodsList: FC = () => {
  const session = useSession();
  const [absencePeriods, setAbsencePeriods] = useState<
    AbsenceWithRelations[] | null
  >(null);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const inputRef = useRef<HTMLInputElement>(null);
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
      body: JSON.stringify({ groupId: selectedGroup }),
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          const absencePeriods = data.data.map((absencePeriod: any) => ({
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
          }));
          setAbsencePeriods(absencePeriods);
        });
      }
    });
  }, [selectedGroup]);

  const filteredAbsencePeriods = useMemo(() => {
    if (!absencePeriods) return [];

    return absencePeriods.filter(absencePeriod =>
      `${absencePeriod.Student.firstName} ${absencePeriod.Student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [absencePeriods, searchTerm]);

  const sortedAbsencePeriods = useMemo(() => {
    if (!filteredAbsencePeriods) return [];

    return filteredAbsencePeriods.sort((a, b) => {
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
  }, [filteredAbsencePeriods, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedAbsencePeriods.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAbsencePeriods = sortedAbsencePeriods.slice(
    startIndex,
    endIndex
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

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

  const handleCommand = () => {
    inputRef.current?.focus();
  };

  useCommand('k', handleCommand);

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <div className="relative w-1/3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a student..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full rounded border border-gray-300 p-2 pl-20 focus:outline-none focus:ring focus:ring-violet-500"
          />
          <div className="absolute left-3 top-1/2 flex -translate-y-1/2 transform flex-row items-center gap-2 text-gray-500">
            <Search className="size-6" />
            <Command className="size-4" />
            {' k'}
          </div>
        </div>
        <Select
          label="Group"
          values={
            groups?.map(group => ({
              label: group.name || group.ref,
              value: group.id.toString(),
            })) || []
          }
          onChange={v => setSelectedGroup(parseInt(v))}
          className="w-1/3"
        />
      </div>
      <table>
        <thead>
          <th
            className="cursor-pointer"
            onClick={() => handleSort('studentName')}
          >
            Student
            {sortBy === 'studentName' &&
              (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
          </th>
          <th
            className="cursor-pointer"
            onClick={() => handleSort('firstAbsence')}
          >
            First Absence
            {sortBy === 'firstAbsence' &&
              (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
          </th>
          <th
            className="cursor-pointer"
            onClick={() => handleSort('lastAbsence')}
          >
            Last Absence
            {sortBy === 'lastAbsence' &&
              (sortOrder === 'asc' ? <ArrowUp /> : <ArrowDown />)}
          </th>
          <th
            className="cursor-pointer"
            onClick={() => handleSort('academicYear')}
          >
            Academic Year{' '}
            {sortBy === 'academicYear' &&
              (sortOrder === 'asc' ? (
                <ArrowUp className="ml-1 size-4" />
              ) : (
                <ArrowDown className="ml-1 size-4" />
              ))}
          </th>
          <th className="cursor-pointer" onClick={() => handleSort('status')}>
            Status{' '}
            {sortBy === 'status' &&
              (sortOrder === 'asc' ? (
                <ArrowUp className="ml-1 size-4" />
              ) : (
                <ArrowDown className="ml-1 size-4" />
              ))}
          </th>
          <th>Actions</th>
        </thead>
        <tbody>
          {currentAbsencePeriods.map(absencePeriod => (
            <tr key={absencePeriod.id}>
              <td>
                {absencePeriod.Student.firstName}{' '}
                {absencePeriod.Student.lastName}
                <small className="text-gray-500">
                  {' '}
                  {absencePeriod.Student.Class?.name}
                </small>
              </td>
              <td>{absencePeriod.FirstAbsence.date.toLocaleDateString()}</td>
              <td>{absencePeriod.LastAbsence.date.toLocaleDateString()}</td>
              <td>{absencePeriod.AcademicYear.name}</td>
              <td>{absencePeriod.status}</td>
              <td>
                <Button>
                  <Eye />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`mx-1 rounded px-3 py-1 ${
                page === currentPage
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-300'
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default AbsencePeriodsList;
