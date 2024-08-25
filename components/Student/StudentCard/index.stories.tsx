import { ThumbsUpIcon, UserXIcon, HourglassIcon } from 'lucide-react';
import StudentCard from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof StudentCard>;
type Meta = MetaObj<typeof StudentCard>;

export const Default: Story = {
  args: {
    student: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
    },
  },
};

export const WithImage: Story = {
  args: {
    student: {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
    },
    image: '/static/placeholder-4-3.jpeg',
  },
};

export const WithActions: Story = {
  args: {
    student: {
      id: 3,
      firstName: 'Bob',
      lastName: 'Smith',
    },
    actions: [
      {
        kind: 'outline',
        variant: 'success',
        children: 'Present',
      },
      {
        kind: 'outline',
        variant: 'danger',
        children: 'Absent',
      },
      {
        kind: 'outline',
        variant: 'warning',
        children: 'Late',
      },
    ],
  },
};

export const WithImageAndActions: Story = {
  args: {
    student: {
      id: 4,
      firstName: 'Alice',
      lastName: 'Johnson',
    },
    image: '/static/placeholder-4-3.jpeg',
    actions: [
      {
        kind: 'outline',
        variant: 'success',
        children: 'Present',
      },
      {
        kind: 'outline',
        variant: 'danger',
        children: 'Absent',
      },
      {
        kind: 'outline',
        variant: 'warning',
        children: 'Late',
      },
    ],
  },
};

export const PresentUsage: Story = {
  args: {
    student: {
      id: 5,
      firstName: 'Alice',
      lastName: 'Johnson',
      className: '6th A',
    },
    image: '/static/placeholder-4-3.jpeg',
    actions: [
      {
        kind: 'solid',
        variant: 'success',
        children: 'Present',
      },
      {
        kind: 'outline',
        variant: 'danger',
        children: 'Absent',
      },
      {
        kind: 'outline',
        variant: 'warning',
        children: 'Late',
      },
    ],
  },
};

export const FrenchPresentUsage: Story = {
  args: {
    student: {
      id: 6,
      firstName: 'Alice',
      lastName: 'Johnson',
      className: '6th A',
    },
    image: '/static/placeholder-4-3.jpeg',
    actions: [
      {
        kind: 'solid',
        variant: 'success',
        children: 'Présent',
      },
      {
        kind: 'outline',
        variant: 'danger',
        children: 'Absent',
      },
      {
        kind: 'outline',
        variant: 'warning',
        children: 'Retard',
      },
    ],
  },
};

export const PresentUsageIcon: Story = {
  args: {
    student: {
      id: 5,
      firstName: 'Alice',
      lastName: 'Johnson',
      className: '6th A',
    },
    image: '/static/placeholder-4-3.jpeg',
    actions: [
      {
        kind: 'solid',
        variant: 'success',
        children: <ThumbsUpIcon />,
      },
      {
        kind: 'outline',
        variant: 'danger',
        children: <UserXIcon />,
      },
      {
        kind: 'outline',
        variant: 'warning',
        children: <HourglassIcon />,
      },
    ],
  },
};

export const PresentUsageIconWithText: Story = {
  args: {
    student: {
      id: 5,
      firstName: 'Alice',
      lastName: 'Johnson',
      className: '6th A',
    },
    image: '/static/placeholder-4-3.jpeg',
    actions: [
      {
        kind: 'solid',
        variant: 'success',
        children: (
          <>
            <ThumbsUpIcon />
            Present
          </>
        ),
      },
      {
        kind: 'outline',
        variant: 'danger',
        children: (
          <>
            <UserXIcon />
            Absent
          </>
        ),
      },
      {
        kind: 'outline',
        variant: 'warning',
        children: (
          <>
            <HourglassIcon />
            Late
          </>
        ),
      },
    ],
  },
};

export const PresentUsageIconWithTextDutch: Story = {
  args: {
    student: {
      id: 5,
      firstName: 'Jean Christophe',
      lastName: 'Van Damme',
      className: '6th A',
    },
    image: '/static/placeholder-4-3.jpeg',
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
