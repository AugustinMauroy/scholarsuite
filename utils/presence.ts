export type PresenceState = 'present' | 'absent' | 'late' | 'excused';

export type PatchBody = {
  data: {
    id?: number;
    studentId: number;
    state: number;
  }[];
  timeSlotId: number;
  userId: number;
  date: Date;
};

export const presenceState: Record<number, PresenceState> = {
  0: 'present',
  1: 'absent',
  2: 'late',
  3: 'excused',
};
