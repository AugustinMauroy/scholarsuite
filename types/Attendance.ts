import type { AttendanceState } from '@prisma/client';

export type PatchBody = {
  data: {
    id?: number;
    studentId: number;
    state: AttendanceState;
  }[];
  timeSlotId: number;
  userId: number;
  groupId: number;
  date: Date;
};
