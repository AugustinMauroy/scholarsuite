import TagList from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof TagList>;
type Meta = MetaObj<typeof TagList>;

export const Default: Story = {
  args: {
    tags: [
      { id: 1, name: 'tag1' },
      { id: 2, name: 'tag2' },
      { id: 3, name: 'tag3' },
      { id: 4, name: 'tag4' },
      { id: 5, name: 'tag5' },
      { id: 6, name: 'tag6' },
      { id: 7, name: 'tag7' },
      { id: 8, name: 'tag8' },
      { id: 9, name: 'tag9' },
      { id: 10, name: 'tag10' },
    ],
    onClick: id => console.log(id),
  },
};

export const OnBox: Story = {
  args: {
    tags: [
      { id: 1, name: 'tag1' },
      { id: 2, name: 'tag2' },
      { id: 3, name: 'tag3' },
      { id: 4, name: 'tag4' },
      { id: 5, name: 'tag5' },
      { id: 6, name: 'tag6' },
      { id: 7, name: 'tag7' },
      { id: 8, name: 'tag8' },
      { id: 9, name: 'tag9' },
      { id: 10, name: 'tag10' },
    ],
    onClick: id => console.log(id),
  },
  decorators: [
    Story => (
      <div style={{ width: '300px', height: '5Opx' }}>
        <Story />
      </div>
    ),
  ],
};

export default {
  component: TagList,
} as Meta;
