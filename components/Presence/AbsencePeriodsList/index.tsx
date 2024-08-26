'use client';
import { Search, ArrowUp, ArrowDown, Eye, Command } from 'lucide-react';
import { useState, useRef } from 'react';
import { useCommand } from '@/hooks/useCommand';
import type {
  AbsencePeriod,
  Student,
  AcademicYear,
  Presence,
  Class,
} from '@prisma/client';
import type { FC, ChangeEvent } from 'react';

type AbsencePeriodListProps = {
  absencePeriods: Array<
    AbsencePeriod & {
      Student: Student & { Class: Class | null };
      AcademicYear: AcademicYear;
      FirstAbsence: Presence;
      LastAbsence: Presence;
      NextPresence: Presence | null;
    }
  >;
};

const AbsencePeriodsList: FC<AbsencePeriodListProps> = ({ absencePeriods }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 10;

  const filteredAbsencePeriods = absencePeriods.filter(absencePeriod =>
    `${absencePeriod.Student.firstName} ${absencePeriod.Student.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedAbsencePeriods = filteredAbsencePeriods.sort((a, b) => {
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
      <div className="relative mb-4 w-1/3">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
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
      <table>
        <thead>
          <th
            className="cursor-pointer"
            onClick={() => handleSort('studentName')}
          >
            Student{' '}
            {sortBy === 'studentName' &&
              (sortOrder === 'asc' ? (
                <ArrowUp className="size-4" />
              ) : (
                <ArrowDown className="size-4" />
              ))}
          </th>
          <th
            className="cursor-pointer px-4 py-2"
            onClick={() => handleSort('firstAbsence')}
          >
            First Absence{' '}
            {sortBy === 'firstAbsence' &&
              (sortOrder === 'asc' ? (
                <ArrowUp className="size-4" />
              ) : (
                <ArrowDown className="size-4" />
              ))}
          </th>
          <th
            className="cursor-pointer"
            onClick={() => handleSort('lastAbsence')}
          >
            Last Absence{' '}
            {sortBy === 'lastAbsence' &&
              (sortOrder === 'asc' ? (
                <ArrowUp className="ml-1 size-4" />
              ) : (
                <ArrowDown className="ml-1 size-4" />
              ))}
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
          <th className="px-4 py-2">Actions</th>
        </thead>
        <tbody>
          {currentAbsencePeriods.map(absencePeriod => (
            <tr key={absencePeriod.id}>
              <td className="items-baseline px-4 py-2">
                {absencePeriod.Student.firstName}{' '}
                {absencePeriod.Student.lastName}
                <small className="text-gray-500">
                  {' '}
                  {absencePeriod.Student.Class?.name}
                </small>
              </td>
              <td className="px-4 py-2">
                {absencePeriod.FirstAbsence.date.toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {absencePeriod.LastAbsence.date.toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{absencePeriod.AcademicYear.name}</td>
              <td className="px-4 py-2">{absencePeriod.status}</td>
              <td className="flex items-center px-4 py-2">
                <button className="mr-2 flex items-center text-blue-500">
                  <Eye className="mr-1 size-4" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={`mx-1 rounded px-3 py-1 ${
              page === currentPage ? 'bg-violet-500 text-white' : 'bg-gray-300'
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  );
};

export default AbsencePeriodsList;
