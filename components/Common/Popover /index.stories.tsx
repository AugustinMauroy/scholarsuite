import Button from '@/components/Common/Button';
import Popover from './';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Popover>;
type Meta = MetaObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: <Button kind="outline">Trigger</Button>,
    children: 'Content',
  },
};

export default { component: Popover } as Meta;
