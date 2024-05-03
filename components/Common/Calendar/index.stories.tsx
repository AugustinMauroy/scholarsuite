import Calendar from './';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Calendar>;
type Meta = MetaObj<typeof Calendar>;

export const Default: Story = {};

export default { component: Calendar } as Meta;
