import classNames from 'classnames';
import styles from './index.module.css';
import type { FC, PropsWithChildren, ReactNode } from 'react';

type BaseLayoutProps = PropsWithChildren<{
  title?: string;
  description?: string;
  sectionClassName?: string;
  actions?: ReactNode;
}>;

const BaseLayout: FC<BaseLayoutProps> = ({
  children,
  title,
  description,
  sectionClassName,
  actions,
}) => (
  <main className={styles.page}>
    {(title || description || actions) && (
      <header>
        <div>
          {title && <h1>{title}</h1>}
          {description && <p>{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </header>
    )}
    <section className={classNames(styles.section, sectionClassName)}>
      {children}
    </section>
  </main>
);

export default BaseLayout;
