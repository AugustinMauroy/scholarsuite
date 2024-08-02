import ReviewPresenceCard from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof ReviewPresenceCard>;
type Meta = MetaObj<typeof ReviewPresenceCard>;

const defaultPresence = {
  state: 'LATE',
  date: '2024-08-02T11:52:43.858Z',
  student: {
    firstName: 'Grace',
    lastName: 'Jones',
    class: {
      name: '1A',
    },
  },
  timeSlot: {
    name: '13:40 - 14:30',
  },
  user: {
    firstName: 'Admin',
    lastName: 'Admin',
  },
};

export const Processed: Story = {
  args: {
    // @ts-expect-error we don't need to pass all the props to the story because props is complete reflection of db model
    presence: { ...defaultPresence, processed: true },
    onClick: () => alert('Card clicked!'),
  },
};

export const NotProcessed: Story = {
  args: {
    // @ts-expect-error we don't need to pass all the props to the story because props is complete reflection of db model
    presence: { ...defaultPresence, processed: false },
    onClick: () => alert('Card clicked!'),
  },
};

export const WithNotification: Story = {
  args: {
    presence: {
      ...defaultPresence,
      // @ts-expect-error we don't need to pass all the props to the story because props is complete reflection of db model
      student: {
        ...defaultPresence.student,
        contactEmail: 'john.doe@mail.com',
      },
    },
    onClick: () => alert('Card clicked!'),
  },
};

export default { component: ReviewPresenceCard } as Meta;
