import Breadcrumb from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Breadcrumb>;
type Meta = MetaObj<typeof Breadcrumb>;

export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/administration',
      },
    },
  },
};

export const LongPath: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/administration/users/add',
      },
    },
  },
};

export const Root: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
};

export const WithNumbers: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/class/1',
      },
    },
  },
};

export default { component: Breadcrumb } as Meta;
