import * as DialogPrimitive from '@radix-ui/react-dialog';
import Select from '../Select';
import EditModal from '.';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof EditModal>;
type Meta = MetaObj<typeof EditModal>;

export const Default: Story = {
  decorators: [
    Story => (
      <DialogPrimitive.Root open={true}>
        <Story />
      </DialogPrimitive.Root>
    ),
  ],
  args: {
    title: 'Edit Modal',
    description: 'Update the information',
    children: (
      <>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id eveniet
          consequatur ex nulla porro odio non dolores laborum, ipsa, sequi unde
          repudiandae nihil! Eius ipsum quis error ab officia numquam.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id eveniet
          consequatur ex nulla porro odio non dolores laborum, ipsa, sequi unde
          repudiandae nihil! Eius ipsum quis error ab officia numquam.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id eveniet
          consequatur ex nulla porro odio non dolores laborum, ipsa, sequi unde
          repudiandae nihil! Eius ipsum quis error ab officia numquam.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id eveniet
          consequatur ex nulla porro odio non dolores laborum, ipsa, sequi unde
          repudiandae nihil! Eius ipsum quis error ab officia numquam.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id eveniet
          consequatur ex nulla porro odio non dolores laborum, ipsa, sequi unde
          repudiandae nihil! Eius ipsum quis error ab officia numquam.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id eveniet
          consequatur ex nulla porro odio non dolores laborum, ipsa, sequi unde
          repudiandae nihil! Eius ipsum quis error ab officia numquam.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id eveniet
          consequatur ex nulla porro odio non dolores laborum, ipsa, sequi unde
          repudiandae nihil! Eius ipsum quis error ab officia numquam.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id eveniet
          consequatur ex nulla porro odio non dolores laborum, ipsa, sequi unde
          repudiandae nihil! Eius ipsum quis error ab officia numquam.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id eveniet
          consequatur ex nulla porro odio non dolores laborum, ipsa, sequi unde
          repudiandae nihil! Eius ipsum quis error ab officia numquam.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id eveniet
          consequatur ex nulla porro odio non dolores laborum, ipsa, sequi unde
          repudiandae nihil! Eius ipsum quis error ab officia numquam.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id eveniet
          consequatur ex nulla porro odio non dolores laborum, ipsa, sequi unde
          repudiandae nihil! Eius ipsum quis error ab officia numquam.
        </p>
      </>
    ),
  },
};

export const WithSelect: Story = {
  decorators: [
    Story => (
      <DialogPrimitive.Root open={true}>
        <Story />
      </DialogPrimitive.Root>
    ),
  ],
  args: {
    title: 'Edit Modal',
    description: 'Update the information',
    children: (
      <>
        <Select
          label="Select"
          values={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ]}
        />
      </>
    ),
  },
};

export const WithSelectLongValues: Story = {
  decorators: [
    Story => (
      <DialogPrimitive.Root open={true}>
        <Story />
      </DialogPrimitive.Root>
    ),
  ],
  args: {
    title: 'Edit Modal',
    description: 'Update the information',
    children: (
      <>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
          consequatur alias pariatur totam, aspernatur eaque rem ratione hic
          quibusdam illo impedit, deleniti, deserunt magni repellendus odit!
          Velit inventore eos illum.
        </p>
        <Select
          label="Select"
          values={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
            { label: 'Option 4', value: 'option4' },
            { label: 'Option 5', value: 'option5' },
            { label: 'Option 6', value: 'option6' },
            { label: 'Option 7', value: 'option7' },
            { label: 'Option 8', value: 'option8' },
            { label: 'Option 9', value: 'option9' },
            { label: 'Option 10', value: 'option10' },
            { label: 'Option 11', value: 'option11' },
            { label: 'Option 12', value: 'option12' },
            { label: 'Option 13', value: 'option13' },
            { label: 'Option 14', value: 'option14' },
            { label: 'Option 15', value: 'option15' },
            { label: 'Option 16', value: 'option16' },
            { label: 'Option 17', value: 'option17' },
            { label: 'Option 18', value: 'option18' },
            { label: 'Option 19', value: 'option19' },
            { label: 'Option 20', value: 'option20' },
          ]}
        />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates
          expedita, quis tenetur dolor totam nihil dolore ea harum velit
          officia! Minima fugiat aspernatur rem mollitia facere ut temporibus
          doloremque. Blanditiis.
        </p>
      </>
    ),
  },
};

export default { component: EditModal } as Meta;
