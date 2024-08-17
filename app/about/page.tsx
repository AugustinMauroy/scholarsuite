import { readFile } from 'fs/promises';
import Environment from '@/components/Common/Environement';
import Label from '@/components/Common/Label';
import BaseLayout from '@/components/Layout/Base';
import styles from './index.module.css';
import type { FC } from 'react';

const Page: FC = async () => {
  const license = await readFile('LICENSE', 'utf-8');

  return (
    <BaseLayout
      sectionClassName={styles.about}
      title="About"
      description={'Get an overview of ScholarSuite "backend" information.'}
    >
      <h2>Environment:</h2>
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
      <hr />
      <h2>License:</h2>
      <details>
        <summary>{license.split('\n')[0]}</summary>
        <pre className="">{license.split('\n').slice(1).join('\n')}</pre>
      </details>
    </BaseLayout>
  );
};

export default Page;
