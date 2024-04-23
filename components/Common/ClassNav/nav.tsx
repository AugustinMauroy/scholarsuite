'use client';
import classNames from 'classnames';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import type { FC } from 'react';

type NavItem = {
  id: number;
  name: string;
  classes: {
    id: number;
    name: string;
  }[];
};

type NavProps = {
  items: NavItem[];
};

const Nav: FC<NavProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AnimatePresence>
      <motion.nav
        className="h-full bg-white shadow-lg dark:border-r dark:border-gray-700 dark:bg-gray-800 dark:shadow-none"
        initial={{ width: 240 }}
        animate={{ width: isOpen ? 240 : 'auto' }}
        exit={{ width: 240 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <button
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={toggleMenu}
          >
            <XMarkIcon
              className={
                isOpen ? 'size-6 text-gray-600 dark:text-gray-400' : 'hidden'
              }
            />
            <Bars3Icon
              className={
                isOpen ? 'hidden' : 'size-6 text-gray-600 dark:text-gray-400'
              }
            />
          </button>
        </div>
        <ul className={classNames('py-4', isOpen ? 'block' : 'hidden')}>
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
      <span className="block px-4 py-2 text-sm">{item.name}</span>
      <ul className="pl-4">
        {item.classes.map(cls => (
          <li key={cls.id}>
            <Link
              href={`/class/${cls.id}`}
              className={classNames(
                'block px-4 py-2 text-sm',
                pathname.includes(`/class/${cls.id}`)
                  ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-gray-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              {cls.name}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Nav;
