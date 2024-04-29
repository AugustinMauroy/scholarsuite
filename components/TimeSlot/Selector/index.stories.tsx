import Selector from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Selector>;
type Meta = MetaObj<typeof Selector>;

export const Default: Story = {
  args: {
    name: '8:25 - 9:25',
    onChange: (kind: 'prev' | 'next') => console.log(kind),
  },
};

export const DisabledPrev: Story = {
  args: {
    name: '8:25 - 9:25',
    onChange: (kind: 'prev' | 'next') => console.log(kind),
    disabledPrev: true,
  },
};

export const DisabledNext: Story = {
  args: {
    name: '8:25 - 9:25',
    onChange: (kind: 'prev' | 'next') => console.log(kind),
    disabledNext: true,
  },
};

export const DisabledBoth: Story = {
  args: {
    name: '8:25 - 9:25',
    onChange: (kind: 'prev' | 'next') => console.log(kind),
    disabledPrev: true,
    disabledNext: true,
  },
};

export default { component: Selector } as Meta;
