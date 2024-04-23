import Avatar from '@/components/Common/Avatar';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Avatar>;
type Meta = MetaObj<typeof Avatar>;

export const Default: Story = {
  args: {
    src: 'https://avatars.githubusercontent.com/AugustinMauroy',
    alt: 'Augustin Mauroy',
  },
};

export default { component: Avatar } as Meta;
