import { MailIcon, UsersIcon, DatabaseIcon } from 'lucide-react';
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
    items: [
      {
        title: 'Attendance',
        items: [
          { href: '/group/1', label: 'Group 1' },
          { href: '/group/2', label: 'Group 2' },
          { href: '/group/3', label: 'Group 3' },
          { href: '/group/4', label: 'Group 4' },
          { href: '/group/5', label: 'Group 5' },
          { href: '/group/6', label: 'Group 6' },
          { href: '/group/7', label: 'Group 7' },
          { href: '/group/8', label: 'Group 8' },
          { href: '/group/9', label: 'Group 9' },
        ],
      },
      {
        href: '/disciplinary-reports',
        label: 'Disciplinary Report',
        icon: <MailIcon />,
      },
      { href: '/attendance', label: 'Attendance Review', icon: <UsersIcon /> },
      { href: '/administration', label: 'Admin', icon: <DatabaseIcon /> },
    ],
    bottomElements: [{ href: '/about', label: 'About' }],
  },
};

export default { component: ContainerNav } as Meta;
