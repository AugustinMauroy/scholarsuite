'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import styles from './index.module.css';
import type { FC, ReactNode } from 'react';

export type NavItem = {
  href: string;
  icon: ReactNode;
  label: ReactNode;
  // will not add active class to the link
  notActive?: boolean;
};

type NavGroup = {
  title: string;
  items: Array<Omit<NavItem, 'icon'>>;
};

type ContainerNavProps = {
  logo: ReactNode;
  items: Array<NavItem | NavGroup>;
  bottomElements?: Array<{
    label: ReactNode;
    href?: string;
  }>;
};

const ContainerNav: FC<ContainerNavProps> = ({
  logo,
  items,
  bottomElements,
}) => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.topLinks}>
        <Link href="/" className={styles.logo}>
          {logo}
        </Link>
        <div className={styles.links}>
          {items.map(item =>
            'title' in item ? (
              <div key={item.title} className={styles.subLinks}>
                <h3>{item.title}</h3>
                {item.items.map(subItem => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={classNames(styles.subLink, {
                      [styles.active]:
                        !subItem.notActive && pathname.includes(subItem.href),
                    })}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(styles.link, {
                  [styles.active]:
                    !item.notActive && pathname.includes(item.href),
                })}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
      {bottomElements && (
        <div className={styles.bottomElements}>
          {bottomElements.map(link =>
            link.href ? (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ) : (
              link.label
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default ContainerNav;
