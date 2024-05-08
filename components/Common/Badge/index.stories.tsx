import Badge from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Badge>;
type Meta = MetaObj<typeof Badge>;

export const Primary: Story = {
  args: {
    children: 'Primary',
    kind: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    kind: 'secondary',
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    kind: 'success',
  },
};

export const Error: Story = {
  args: {
    children: 'Error',
    kind: 'error',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    kind: 'warning',
  },
};

export const WithClickEvent: Story = {
  args: {
    children: 'Clickable',
    kind: 'primary',
    onClick: () => alert('Badge clicked!'),
  },
};

export default { component: Badge } as Meta;
