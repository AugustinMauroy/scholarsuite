'use client';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import AccordionMenu from '../AccordionMenu';
import styles from './index.module.css';
import type { FC } from 'react';

export type NavItem = {
  label: string;
  // why not using NavItem[]?
  // because we don't want to render nested items
  // we only want to render the first level of items
  children: {
    label: string;
    href: string;
  }[];
};

type ContainerNavProps = {
  items?: NavItem[];
  links?: {
    label: string;
    href: string;
  }[];
  bottomLinks?: {
    label: string;
    href: string;
  }[];
};

const ContainerNav: FC<ContainerNavProps> = ({ items, links, bottomLinks }) => {
  const [isOpen, setIsOpen] = useState(items?.length !== 0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AnimatePresence>
      <motion.nav
        className={styles.nav}
        initial={{ width: 240 }}
        animate={{ width: isOpen ? 240 : 'fit-content' }}
        exit={{ width: 240 }}
        transition={{ duration: 0.15 }}
      >
        <div className={styles.header}>
          <button className={styles.button} onClick={toggleMenu}>
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
        <section
          className={classNames(styles.section, !isOpen && styles.sectionClose)}
        >
          <div className={styles.topLinks}>
            {items && <AccordionMenu items={items} />}
            {links && (
              <ul className={styles.links}>
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {bottomLinks && (
            <div className={styles.bottomLinks}>
              {bottomLinks.map(link => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </section>
      </motion.nav>
    </AnimatePresence>
  );
};

export default ContainerNav;
