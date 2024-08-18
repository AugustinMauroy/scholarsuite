import ReviewPresenceCard from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof ReviewPresenceCard>;
type Meta = MetaObj<typeof ReviewPresenceCard>;

const defaultPresence = {
  id: 1,
  state: 'LATE',
  date: '2024-08-02T11:52:43.858Z',
  student: {
    id: 1,
    firstName: 'Grace',
    lastName: 'Jones',
    class: {
      id: 1,
      name: '1A',
    },
  },
  timeSlot: {
    id: 1,
    name: '13:40 - 14:30',
  },
  user: {
    id: 1,
    firstName: 'Admin',
    lastName: 'Admin',
  },
  academicYearId: 1,
  timeSlotId: 1,
  groupId: 1,
  processed: false,
  notified: false,
  PresenceAudit: [
    {
      id: 1,
      state: 'PRESENT',
      date: '2024-08-01T11:52:43.858Z',
      user: {
        id: 2,
        firstName: 'Manager',
        lastName: 'Manager',
      },
    },
    {
      id: 2,
      state: 'LATE',
      date: '2024-08-02T11:52:43.858Z',
      user: {
        id: 1,
        firstName: 'Admin',
        lastName: 'Admin',
      },
    },
    {
      id: 3,
      state: 'ABSENT',
      date: '2024-08-03T11:52:43.858Z',
      user: {
        id: 2,
        firstName: 'Manager',
        lastName: 'Manager',
      },
    },
  ],
};

export const Processed: Story = {
  args: {
    // @ts-ignore
    presence: { ...defaultPresence, processed: true },
    processPresence: () => alert('Process Presence clicked!'),
    notifyStudent: () => alert('Notify Student clicked!'),
  },
};

export const NotProcessed: Story = {
  args: {
    // @ts-ignore
    presence: { ...defaultPresence, processed: false },
    processPresence: () => alert('Process Presence clicked!'),
    notifyStudent: () => alert('Notify Student clicked!'),
  },
};

export const WithNotification: Story = {
  args: {
    presence: {
      ...defaultPresence,
      // @ts-ignore
      student: {
        ...defaultPresence.student,
        contactEmail: 'john.doe@mail.com',
      },
    },
    processPresence: () => alert('Process Presence clicked!'),
    notifyStudent: () => alert('Notify Student clicked!'),
  },
};

export default { component: ReviewPresenceCard } as Meta;
