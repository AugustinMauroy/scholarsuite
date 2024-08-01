'use client';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './nav.module.css';
import type { Group } from '@prisma/client';
import type { FC } from 'react';

type NavItem = {
  group: Partial<Group>[];
} & {
  id: number;
  name: string;
};

type NavProps = {
  items: NavItem[];
};

const Nav: FC<NavProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(items.length !== 0);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AnimatePresence>
      <motion.nav
        className={styles.nav}
        initial={{ width: 240 }}
        animate={{ width: isOpen ? 240 : 'auto' }}
        exit={{ width: 240 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <button className={styles.toggle} onClick={toggleMenu}>
            <XMarkIcon
              aria-hidden={!isOpen}
              className={classNames(styles.toggleIcon, !isOpen && 'hidden')}
            />
            <Bars3Icon
              aria-hidden={isOpen}
              className={classNames(styles.toggleIcon, isOpen && 'hidden')}
            />
          </button>
        </div>
        <ul
          className={classNames(
            styles.list,
            isOpen ? styles.listOpen : styles.listClose
          )}
        >
          {items.map(item => (
            <NavItemComponent key={item.id} item={item} pathname={pathname} />
          ))}
        </ul>
      </motion.nav>
    </AnimatePresence>
  );
};

type NavItemComponentProps = {
  item: NavItem;
  pathname: string;
};

const NavItemComponent: FC<NavItemComponentProps> = ({ item, pathname }) => {
  return (
    <li>
      <span className={styles.item}>{item.name}</span>
      <ul className={styles.item}>
        {item.group.map(grp => (
          <li key={grp.id}>
            <Link
              href={`/group/${grp.id}`}
              className={classNames(
                styles.link,
                pathname.includes(`/group/${grp.id}`)
                  ? styles.active
                  : styles.inactive
              )}
            >
              {grp.name}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Nav;
