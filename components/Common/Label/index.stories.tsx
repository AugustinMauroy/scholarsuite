import Label from '@/components/Common/Label';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Label>;
type Meta = MetaObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export default { component: Label } as Meta;
