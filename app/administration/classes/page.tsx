import prisma from '@/lib/prisma';
import Table from '@/components/Classes/Table';
import styles from './page.module.css';
import type { FC } from 'react';

const Page: FC = async () => {
  const classes = await prisma.class.findMany({
    include: {
      schoolLevel: true,
    },
  });

  return (
    <main className={styles.page}>
      <header>
        <h1>Administration</h1>
        <p>List of classes</p>
      </header>
      <section>
        <Table classes={classes} />
      </section>
    </main>
  );
};

export default Page;
