import classNames from 'classnames';
import styles from './index.module.css';
import type { FC, PropsWithChildren } from 'react';

type BaseLayoutProps = PropsWithChildren<{
  title: string;
  description?: string;
  sectionClassName?: string;
}>;

const BaseLayout: FC<BaseLayoutProps> = ({
  children,
  title,
  description,
  sectionClassName,
}) => (
  <main className={styles.page}>
    <header>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
    <section className={classNames(styles.section, sectionClassName)}>
      {children}
    </section>
  </main>
);

export default BaseLayout;
