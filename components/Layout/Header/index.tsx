import Breadcrumb from '@/components/Common/Breadcrumb';
import Environment from '@/components/Common/Environement';
import HeaderAvatar from '@/components/Common/HeaderAvatar';
import styles from './index.module.css';
import type { FC } from 'react';

const Header: FC = () => (
  <header className={styles.header}>
    <span className={styles.headerLeft}>
      <Environment />
      <Breadcrumb />
    </span>
    <HeaderAvatar />
  </header>
);

export default Header;
