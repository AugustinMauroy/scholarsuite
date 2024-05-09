import type { PresenceState } from '@prisma/client';

export type PatchBody = {
  data: {
    id?: number;
    studentId: number;
    state: PresenceState;
  }[];
  timeSlotId: number;
  userId: number;
  date: Date;
};
