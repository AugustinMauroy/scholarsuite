import { readFile } from 'fs/promises';
import { getTranslations } from 'next-intl/server';
import Environment from '@/components/Common/Environement';
import Label from '@/components/Common/Label';
import BaseLayout from '@/components/Layout/Base';
import styles from './page.module.css';
import type { FC } from 'react';

const Page: FC = async () => {
  const t = await getTranslations('app.about');
  const license = await readFile('LICENSE', 'utf-8');

  return (
    <BaseLayout sectionClassName={styles.about} title={t('title')}>
      <h2>{t('description')}</h2>
      <Label>
        ScholarSuite:
        <Environment kind="env" forceDisplay />
      </Label>
      <Label>
        Node:
        <Environment forceDisplay />
      </Label>
      <Label>
        PostgreSQL:
        <Environment kind="postgresql" forceDisplay />
      </Label>
      <Label>
        NextJS:
        <Environment kind="deps" deps={['next']} forceDisplay />
      </Label>
      <Label>
        React:
        <Environment kind="deps" deps={['react']} forceDisplay />
      </Label>
      <Label>
        React-DOM:
        <Environment kind="deps" deps={['react-dom']} forceDisplay />
      </Label>
      <Label>
        Next-Auth:
        <Environment kind="deps" deps={['next-auth']} forceDisplay />
      </Label>
      <hr />
      <h2>License</h2>
      <details>
        <summary>{license.split('\n')[0]}</summary>
        <pre>{license.split('\n').slice(1).join('\n')}</pre>
      </details>
    </BaseLayout>
  );
};

export default Page;
