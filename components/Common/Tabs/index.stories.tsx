import * as TabsPrimitive from '@radix-ui/react-tabs';
import Tabs from '@/components/Common/Tabs';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';

type Story = StoryObj<typeof Tabs>;
type Meta = MetaObj<typeof Tabs>;

const defaultArgs: ComponentProps<typeof Tabs> = {
  defaultValue: 'prebuilt',
  tabs: [
    {
      key: 'package',
      label: 'Package Manager',
    },
    {
      key: 'prebuilt',
      label: 'Prebuilt Installer',
    },
    {
      key: 'source',
      label: 'Source Code',
    },
  ],
  children: (
    <>
      <TabsPrimitive.Content value="package">
        Package Manager
      </TabsPrimitive.Content>
      <TabsPrimitive.Content value="prebuilt">
        Prebuilt Installer
      </TabsPrimitive.Content>
      <TabsPrimitive.Content value="source">Source Code</TabsPrimitive.Content>
    </>
  ),
};

export const Default: Story = {
  args: defaultArgs,
};

export const WithAddon: Story = {
  args: {
    ...defaultArgs,
  },
};

export default { component: Tabs } as Meta;
