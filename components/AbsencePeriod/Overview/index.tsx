import { AbsencePeriodStatus } from '@prisma/client';
import Select from '@/components/Common/Select';
import StudentCard from '@/components/Student/StudentCard';
import styles from './index.module.css';
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
  onStatusChange: (status: string) => void;
};

const Overview: FC<OverviewProps> = ({ absence, onStatusChange }) => (
  <>
    <div className={styles.header}>
      <StudentCard
        withInfo
        student={{
          ...absence.Student,
          className: absence.Student.Class?.name,
        }}
      />
      <Select
        onChange={onStatusChange}
        label="Status"
        defaultValue={absence.status}
        values={[
          AbsencePeriodStatus.JUSTIFIED,
          AbsencePeriodStatus.PENDING,
          AbsencePeriodStatus.UNJUSTIFIED,
        ]}
      />
    </div>
    <div className={styles.details}>
      <h2>Absence Details</h2>
      <dl>
        <div>
          <dt>First Absence</dt>
          <dd className={styles.at}>
            At : {absence.FirstAbsence?.Group?.name}
          </dd>
          <dd className={styles.on}>
            On : {absence.FirstAbsence.TimeSlot.name}
          </dd>
        </div>
        <div>
          <dt>Last Absence</dt>
          <dd className={styles.at}>At : {absence.LastAbsence?.Group?.name}</dd>
          <dd className={styles.on}>On: {absence.LastAbsence.TimeSlot.name}</dd>
        </div>
        {absence.NextPresence && (
          <div>
            <dt>Next Presence</dt>
            <dd className={styles.on}>
              On : {absence.NextPresence.TimeSlot.name}
            </dd>
          </div>
        )}
      </dl>
    </div>
  </>
);

export default Overview;
