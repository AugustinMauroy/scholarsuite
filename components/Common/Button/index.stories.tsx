import Button from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Button>;
type Meta = MetaObj<typeof Button>;

export const Solid: Story = {
  args: { children: 'Solid' },
};

export const Outline: Story = {
  args: { children: 'Outline', kind: 'outline' },
};

export const Danger: Story = {
  args: { children: 'Danger', kind: 'danger' },
};

export default { component: Button } as Meta;
