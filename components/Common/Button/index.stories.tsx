import { InformationCircleIcon } from '@heroicons/react/24/solid';
import Button from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Button>;
type Meta = MetaObj<typeof Button>;

export const PrimarySolid: Story = {
  args: { children: 'Primary Solid', kind: 'solid', variant: 'primary' },
};

export const PrimarySolidWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Primary Solid With Icon
      </>
    ),
    kind: 'solid',
    variant: 'primary',
  },
};

export const PrimarySolidDisabled: Story = {
  args: {
    children: 'Primary Solid Disabled',
    kind: 'solid',
    variant: 'primary',
    disabled: true,
  },
};

export const PrimaryOutline: Story = {
  args: { children: 'Primary Outline', kind: 'outline', variant: 'primary' },
};

export const PrimaryOutlineWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Primary Outline With Icon
      </>
    ),
    kind: 'outline',
    variant: 'primary',
  },
};

export const PrimaryOutlineDisabled: Story = {
  args: {
    children: 'Primary Outline Disabled',
    kind: 'outline',
    variant: 'primary',
    disabled: true,
  },
};

export const InfoSolid: Story = {
  args: { children: 'Info Solid', kind: 'solid', variant: 'info' },
};

export const InfoSolidWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Info Solid With Icon
      </>
    ),
    kind: 'solid',
    variant: 'info',
  },
};

export const InfoSolidDisabled: Story = {
  args: {
    children: 'Info Solid Disabled',
    kind: 'solid',
    variant: 'info',
    disabled: true,
  },
};

export const InfoOutline: Story = {
  args: { children: 'Info Outline', kind: 'outline', variant: 'info' },
};

export const InfoOutlineWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Info Outline With Icon
      </>
    ),
    kind: 'outline',
    variant: 'info',
  },
};

export const InfoOutlineDisabled: Story = {
  args: {
    children: 'Info Outline Disabled',
    kind: 'outline',
    variant: 'info',
    disabled: true,
  },
};

export const SuccessSolid: Story = {
  args: { children: 'Success Solid', kind: 'solid', variant: 'success' },
};

export const SuccessSolidWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Success Solid With Icon
      </>
    ),
    kind: 'solid',
    variant: 'success',
  },
};

export const SuccessSolidDisabled: Story = {
  args: {
    children: 'Success Solid Disabled',
    kind: 'solid',
    variant: 'success',
    disabled: true,
  },
};

export const SuccessOutline: Story = {
  args: { children: 'Success Outline', kind: 'outline', variant: 'success' },
};

export const SuccessOutlineWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Success Outline With Icon
      </>
    ),
    kind: 'outline',
    variant: 'success',
  },
};

export const SuccessOutlineDisabled: Story = {
  args: {
    children: 'Success Outline Disabled',
    kind: 'outline',
    variant: 'success',
    disabled: true,
  },
};

export const WarningSolid: Story = {
  args: { children: 'Warning Solid', kind: 'solid', variant: 'warning' },
};

export const WarningSolidWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Warning Solid With Icon
      </>
    ),
    kind: 'solid',
    variant: 'warning',
  },
};

export const WarningSolidDisabled: Story = {
  args: {
    children: 'Warning Solid Disabled',
    kind: 'solid',
    variant: 'warning',
    disabled: true,
  },
};

export const WarningOutline: Story = {
  args: { children: 'Warning Outline', kind: 'outline', variant: 'warning' },
};

export const WarningOutlineWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Warning Outline With Icon
      </>
    ),
    kind: 'outline',
    variant: 'warning',
  },
};

export const WarningOutlineDisabled: Story = {
  args: {
    children: 'Warning Outline Disabled',
    kind: 'outline',
    variant: 'warning',
    disabled: true,
  },
};

export const DangerSolid: Story = {
  args: { children: 'Danger Solid', kind: 'solid', variant: 'danger' },
};

export const DangerSolidWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Danger Solid With Icon
      </>
    ),
    kind: 'solid',
    variant: 'danger',
  },
};

export const DangerSolidDisabled: Story = {
  args: {
    children: 'Danger Solid Disabled',
    kind: 'solid',
    variant: 'danger',
    disabled: true,
  },
};

export const DangerOutline: Story = {
  args: { children: 'Danger Outline', kind: 'outline', variant: 'danger' },
};

export const DangerOutlineWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Danger Outline With Icon
      </>
    ),
    kind: 'outline',
    variant: 'danger',
  },
};

export const DangerOutlineDisabled: Story = {
  args: {
    children: 'Danger Outline Disabled',
    kind: 'outline',
    variant: 'danger',
    disabled: true,
  },
};

export const LightSolid: Story = {
  args: { children: 'Light Solid', kind: 'solid', variant: 'light' },
};

export const LightSolidWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Light Solid With Icon
      </>
    ),
    kind: 'solid',
    variant: 'light',
  },
};

export const LightSolidDisabled: Story = {
  args: {
    children: 'Light Solid Disabled',
    kind: 'solid',
    variant: 'light',
    disabled: true,
  },
};

export const LightOutline: Story = {
  args: { children: 'Light Outline', kind: 'outline', variant: 'light' },
};

export const LightOutlineWithIcon: Story = {
  args: {
    children: (
      <>
        <InformationCircleIcon />
        Light Outline With Icon
      </>
    ),
    kind: 'outline',
    variant: 'light',
  },
};

export const LightOutlineDisabled: Story = {
  args: {
    children: 'Light Outline Disabled',
    kind: 'outline',
    variant: 'light',
    disabled: true,
  },
};

export default { component: Button } as Meta;
