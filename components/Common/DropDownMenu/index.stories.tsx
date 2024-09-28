import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import Button from '../Button';
import DropDownMenu from './';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof DropDownMenu>;
type Meta = MetaObj<typeof DropDownMenu>;

export const Default: Story = {
  args: {
    children: (
      <>
        <DropdownMenuPrimitive.Item>Item 1</DropdownMenuPrimitive.Item>
        <DropdownMenuPrimitive.Item>Item 2</DropdownMenuPrimitive.Item>
        <DropdownMenuPrimitive.Item>Item 3</DropdownMenuPrimitive.Item>
      </>
    ),
  },
};

export const WithPortal: Story = {
  args: {
    withPortal: true,
    children: (
      <>
        <DropdownMenuPrimitive.Item>Item 1</DropdownMenuPrimitive.Item>
        <DropdownMenuPrimitive.Item>Item 2</DropdownMenuPrimitive.Item>
        <DropdownMenuPrimitive.Item>Item 3</DropdownMenuPrimitive.Item>
      </>
    ),
  },
};

export default {
  component: DropDownMenu,
  decorators: [
    Story => (
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <Button>Open menu</Button>
        </DropdownMenuPrimitive.Trigger>
        <Story />
      </DropdownMenuPrimitive.Root>
    ),
  ],
} as Meta;
