import Card from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Card>;
type Meta = MetaObj<typeof Card>;

export const Default: Story = {};

export default { component: Card } as Meta;
