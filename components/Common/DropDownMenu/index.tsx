import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import classNames from 'classnames';
import styles from './index.module.css';
import type { FC, PropsWithChildren } from 'react';

const DropDownMenu: FC<
  PropsWithChildren<{
    withPortal?: boolean;
    className?: string;
  }>
> = ({ children, className, withPortal }) =>
  withPortal ? (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={5}
        className={classNames(styles.content, className)}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  ) : (
    <DropdownMenuPrimitive.Content
      sideOffset={5}
      className={classNames(styles.content, className)}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  );

export default DropDownMenu;
