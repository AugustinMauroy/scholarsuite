import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { FC, PropsWithChildren, ReactNode } from 'react';

type PopoverProps = PropsWithChildren<{
  trigger: ReactNode;
}>;

const Popover: FC<PopoverProps> = ({ children, trigger }) => (
  <PopoverPrimitive.Root>
    <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={5}
        align="center"
        className="m-2 rounded border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  </PopoverPrimitive.Root>
);

export default Popover;
