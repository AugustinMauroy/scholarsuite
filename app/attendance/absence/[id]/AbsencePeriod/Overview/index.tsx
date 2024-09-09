import StudentCard from '@/components/Student/StudentCard';
import type {
  AbsencePeriodComment,
  User,
  Student,
  Class,
  Group,
  TimeSlot,
  AbsencePeriod,
} from '@prisma/client';
import type { FC } from 'react';

type AbsencePeriodWithRelations = AbsencePeriod & {
  Student: Student & { Class: Class };
  FirstAbsence: { Group: Group; TimeSlot: TimeSlot };
  LastAbsence: { Group: Group; TimeSlot: TimeSlot };
  NextPresence: { date: Date; TimeSlot: TimeSlot };
  Comments: Array<AbsencePeriodComment & { User: User }>;
};

type OverviewProps = {
  absence: AbsencePeriodWithRelations;
};

const Overview: FC<OverviewProps> = ({ absence }) => (
  <>
    <div className="flex items-center justify-between">
      <StudentCard
        withInfo
        student={{
          ...absence.Student,
          className: absence.Student.Class?.name,
        }}
      />
      {/* action for the absence will be here */}
    </div>
    <div className="mt-8">
      <h2 className="mb-2 text-lg font-medium">Absence Details</h2>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            First Absence
          </dt>
          <dd className="text-lg">At : {absence.FirstAbsence?.Group?.name}</dd>
          <dd className="text-sm text-gray-500 dark:text-gray-400">
            On : {absence.FirstAbsence.TimeSlot.name}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Last Absence
          </dt>
          <dd className="text-lg">At : {absence.LastAbsence?.Group?.name}</dd>
          <dd className="text-sm text-gray-500 dark:text-gray-400">
            On: {absence.LastAbsence.TimeSlot.name}
          </dd>
        </div>
        {absence.NextPresence && (
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Next Presence
            </dt>
            <dd className="text-sm text-gray-500 dark:text-gray-400">
              On : {absence.NextPresence.TimeSlot.name}
            </dd>
          </div>
        )}
      </dl>
    </div>
  </>
);

export default Overview;
