'use client';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import AccordionMenu from '../AccordionMenu';
import styles from './index.module.css';
import type { FC, ReactNode } from 'react';

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

type accordionMenuProps = {
  title: string;
  items: NavItem[];
};

type ContainerNavProps = {
  topLinks?: {
    label: ReactNode;
    href: string;
  }[];
  accordionMenu?: accordionMenuProps[];
  links?: {
    label: ReactNode;
    href: string;
  }[];
  bottomElements?: {
    label: ReactNode;
    href?: string;
  }[];
};

const ContainerNav: FC<ContainerNavProps> = ({
  topLinks,
  accordionMenu,
  links,
  bottomElements,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AnimatePresence>
      <motion.nav
        className={styles.nav}
        initial={{ width: 240 }}
        animate={{ width: isOpen ? 240 : 64 }}
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
            {topLinks && (
              <ul className={styles.links}>
                {topLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            )}
            {accordionMenu &&
              accordionMenu.map((menu, index) => (
                <div key={index} className={styles.accordionMenu}>
                  <h3>{menu.title}</h3>
                  <AccordionMenu items={menu.items} />
                </div>
              ))}
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
          {bottomElements && (
            <div className={styles.bottomElements}>
              {bottomElements.map(link =>
                link.href ? (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ) : (
                  link.label
                )
              )}
            </div>
          )}
        </section>
      </motion.nav>
    </AnimatePresence>
  );
};

export default ContainerNav;
