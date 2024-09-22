import Link from 'next/link';
import LinkList from '../LinkList';
import styles from './index.module.css';
import type { FC, ReactNode, ComponentProps } from 'react';

type ContainerNavProps = {
  logo: ReactNode;
  linkList: {
    title: ReactNode;
    items: ComponentProps<typeof LinkList>['items'];
  };
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
  logo,
  linkList,
  links,
  bottomElements,
}) => (
  <nav className={styles.nav}>
    <div className={styles.topLinks}>
      <div className={styles.logo}>
        <Link href="/">{logo}</Link>
      </div>
      {linkList && (
        <div className={styles.linkList}>
          <h3>{linkList.title}</h3>
          <LinkList items={linkList.items} />
        </div>
      )}
      {links && (
        <ul className={styles.links}>
          {links.map(link => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      )}
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

export default ContainerNav;
