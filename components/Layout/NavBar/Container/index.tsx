'use client';
import { useEffect, useState } from 'react';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import useMediaQuery from '@/hooks/useMediaQuery';
import UserAvatar from '@/components/Common/UserAvatar';
import LogoText from '@/components/Common/LogoText';
import Logo from '@/components/Common/Logo';
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
  items: Array<NavItem | NavGroup>;
  bottomElements?: Array<{
    label: ReactNode;
    href?: string;
  }>;
};

const ContainerNav: FC<ContainerNavProps> = ({ items, bottomElements }) => {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  return (
    <nav
      className={classNames(styles.nav, {
        [styles.open]: open,
        [styles.closed]: !open,
      })}
    >
      <button
        className={styles.toggle}
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <XIcon /> : <MenuIcon />}
      </button>
      <section className={styles.navBody}>
        <div className={styles.topLinks}>
          <Link href="/" className={styles.logo}>
            {open ? <LogoText /> : <Logo />}
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
                  <span>{item.label}</span>
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
            <UserAvatar withName={open ?? false} />
          </div>
        )}
      </section>
    </nav>
  );
};

export default ContainerNav;
