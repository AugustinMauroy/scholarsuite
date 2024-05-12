import ReviewPresenceCard from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof ReviewPresenceCard>;
type Meta = MetaObj<typeof ReviewPresenceCard>;

const defaultPresence = {
  id: 1,
  date: '2022-10-10T10:00:00.000Z',
  state: 'Present',
  processed: false,
  student: {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    class: {
      id: 1,
      name: 'Class 1',
    },
  },
  timeSlot: {
    id: 1,
    name: '8:25 - 9h15',
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
