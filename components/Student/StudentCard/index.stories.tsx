import { ThumbsUpIcon, UserXIcon, HourglassIcon } from 'lucide-react';
import StudentCard from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof StudentCard>;
type Meta = MetaObj<typeof StudentCard>;

export const Default: Story = {
  args: {
    student: {
      id: 5,
      firstName: 'Jean Christophe',
      lastName: 'Van Damme',
      dateOfBirth: new Date('1999-12-31'),
      // @ts-expect-error - we don't need all the fields
      Class: {
        name: '6th A',
      },
    },
    actions: [
      {
        kind: 'solid',
        variant: 'success',
        children: (
          <>
            <ThumbsUpIcon />
            Aanwezig
          </>
        ),
      },
      {
        kind: 'outline',
        variant: 'danger',
        children: (
          <>
            <UserXIcon />
            Afwezig
          </>
        ),
      },
      {
        kind: 'outline',
        variant: 'warning',
        children: (
          <>
            <HourglassIcon />
            Vertraging
          </>
        ),
      },
    ],
  },
};

export default { component: StudentCard } as Meta;
