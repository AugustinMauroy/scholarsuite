import ContainerNav from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof ContainerNav>;
type Meta = MetaObj<typeof ContainerNav>;

export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/group/1',
      },
    },
  },
  args: {
    linkList: {
      title: 'Attendance',
      items: [
        { href: '/group/1', label: 'Group 1' },
        { href: '/1-2', label: 'Group 2' },
        { href: '/1-3', label: 'Group 3' },
        { href: '/group/2', label: 'Group 4' },
        { href: '/2-2', label: 'Group 5' },
        { href: '/2-3', label: 'Group 6' },
        { href: '/group/3', label: 'Group 7' },
        { href: '/3-2', label: 'Group 8' },
        { href: '/3-3', label: 'Group 9' },
      ],
    },
    links: [
      { href: '/home', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
    bottomElements: [
      { href: '/terms', label: 'Terms' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
};

export default { component: ContainerNav } as Meta;
