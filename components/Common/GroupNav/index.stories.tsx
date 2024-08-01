import Nav from './nav';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Nav>;
type Meta = MetaObj<typeof Nav>;

export const Default: Story = {
  args: {
    items: [
      {
        id: 1,
        name: 'Item 1',
        group: [
          {
            id: 1,
            name: 'Class 1',
          },
          {
            id: 2,
            name: 'Class 2',
          },
        ],
      },
      {
        id: 2,
        name: 'Item 2',
        group: [
          {
            id: 3,
            name: 'Class 3',
          },
          {
            id: 4,
            name: 'Class 4',
          },
        ],
      },
    ],
  },
};

export default { component: Nav } as Meta;
