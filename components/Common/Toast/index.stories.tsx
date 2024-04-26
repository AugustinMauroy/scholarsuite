import { CodeBracketIcon } from '@heroicons/react/24/solid';
import Toast from './';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Toast>;
type Meta = MetaObj<typeof Toast>;

export const Default: Story = {
  args: {
    open: true,
    duration: 5000,
    children: 'Copied to clipboard!',
  },
};

export const Success: Story = {
  args: {
    open: true,
    duration: 5000,
    children: 'Profile picture updated successfully',
    kind: 'success',
  },
};

export const Error: Story = {
  args: {
    open: true,
    duration: 5000,
    children: 'An error occurred',
    kind: 'error',
  },
};

export const Warning: Story = {
  args: {
    open: true,
    duration: 5000,
    children: 'Please fill out all fields',
    kind: 'warning',
  },
};

export const TimedToast: Story = {
  args: {
    duration: 5000,
    children: 'Copied to clipboard!',
  },
};

export const WithJSX: Story = {
  args: {
    open: true,
    children: (
      <>
        <CodeBracketIcon />
        Copied to clipboard!
      </>
    ),
  },
};

export default { component: Toast } as Meta;
