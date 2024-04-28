import StudentCardProps from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof StudentCardProps>;
type Meta = MetaObj<typeof StudentCardProps>;

export const Default: Story = {
  args: {
    firstName: 'John',
    lastName: 'Doe',
    image: '/static/placeholder-portrait-9-16.jpg',
  },
};

export const Present: Story = {
  args: {
    firstName: 'John',
    lastName: 'Doe',
    image: '/static/placeholder-portrait-9-16.jpg',
    state: 'present',
  },
};

export const Absent: Story = {
  args: {
    firstName: 'John',
    lastName: 'Doe',
    image: '/static/placeholder-portrait-9-16.jpg',
    state: 'absent',
  },
};

export const Late: Story = {
  args: {
    firstName: 'John',
    lastName: 'Doe',
    image: '/static/placeholder-portrait-9-16.jpg',
    state: 'late',
  },
};

export const Excused: Story = {
  args: {
    firstName: 'John',
    lastName: 'Doe',
    image: '/static/placeholder-portrait-9-16.jpg',
    state: 'excused',
  },
};

export const NoImage: Story = {
  args: {
    firstName: 'John',
    lastName: 'Doe',
  },
};

export default { component: StudentCardProps } as Meta;
