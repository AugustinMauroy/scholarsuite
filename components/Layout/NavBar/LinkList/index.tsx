'use client';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import styles from './index.module.css';
import type { FC } from 'react';

type Item = {
  label: string;
  href: string;
};

type LinkListProps = {
  items: Item[];
};

const LinkList: FC<LinkListProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <div className={styles.panel}>
      {items.map(child => (
        <a
          key={child.href}
          href={child.href}
          className={classNames(pathname.includes(child.href) && styles.active)}
        >
          {child.label}
        </a>
      ))}
    </div>
  );
};

export default LinkList;
