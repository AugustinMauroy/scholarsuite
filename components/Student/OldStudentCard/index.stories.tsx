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
    state: 'PRESENT',
  },
};

export const Absent: Story = {
  args: {
    firstName: 'John',
    lastName: 'Doe',
    image: '/static/placeholder-portrait-9-16.jpg',
    state: 'ABSENT',
  },
};

export const Late: Story = {
  args: {
    firstName: 'John',
    lastName: 'Doe',
    image: '/static/placeholder-portrait-9-16.jpg',
    state: 'LATE',
  },
};

export const Excused: Story = {
  args: {
    firstName: 'John',
    lastName: 'Doe',
    image: '/static/placeholder-portrait-9-16.jpg',
    state: 'EXCUSED',
  },
};

export const NoImage: Story = {
  args: {
    firstName: 'John',
    lastName: 'Doe',
  },
};

export default { component: StudentCardProps } as Meta;
