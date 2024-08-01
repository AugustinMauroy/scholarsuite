import { useState } from 'react';
import DropZone from '@/components/Common/DropZone';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';
import type { ComponentProps, FC } from 'react';

type StoryProps = ComponentProps<typeof DropZone>;

type Story = StoryObj<typeof DropZone>;
type Meta = MetaObj<typeof DropZone>;

const Template: FC<StoryProps> = args => {
  const [file, setFile] = useState<File | null>(null);

  return <DropZone {...args} file={file} setFile={setFile} />;
};

export const Default: Story = {
  ...Template,
  args: {
    title: 'Drop your file here',
  },
};

export default { component: DropZone } as Meta;
