import { EllipsisVertical } from 'lucide-react';
import StudentCard from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof StudentCard>;
type Meta = MetaObj<typeof StudentCard>;

export const Default: Story = {
  args: {
    student: {
      firstName: 'John',
      lastName: 'Doe',
    },
  },
};

export const WithImage: Story = {
  args: {
    student: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    image: '/static/placeholder-4-3.jpeg',
  },
};

export const WithActions: Story = {
  args: {
    student: {
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
      {
        kind: 'outline',
        variant: 'light',
        children: <EllipsisVertical />,
      },
    ],
  },
};

export const WithImageAndActions: Story = {
  args: {
    student: {
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
      {
        kind: 'outline',
        variant: 'light',
        children: <EllipsisVertical />,
      },
    ],
  },
};

export const PresentUsage: Story = {
  args: {
    student: {
      firstName: 'Alice',
      lastName: 'Johnson',
    },
    badge: {
      kind: 'success',
      children: 'Present',
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
      {
        kind: 'outline',
        variant: 'light',
        children: <EllipsisVertical />,
      },
    ],
  },
};

export default { component: StudentCard } as Meta;
