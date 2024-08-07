import classNames from 'classnames';
import prisma from '@/lib/prisma';
import { getPackage } from '@/utils/getPackage';
import styles from './index.module.css';
import type { FC } from 'react';

// Expected type for environment variables
type Raw = {
  'VERSION()': string;
};

type EnvironmentProps = {
  forceDisplay?: boolean;
  kind?: 'env' | 'info' | 'deps' | 'mysql';
  deps?: string[];
};

const Environment: FC<EnvironmentProps> = async ({
  forceDisplay,
  kind = 'info',
  deps = [],
}) => {
  const env = process.env.NODE_ENV;
  const display = process.env.DISPLAY_ENV || forceDisplay;

  if (!display) return null;

  const packageJson = await getPackage();
  const mysqlVersion = await prisma.$queryRaw<Raw[]>`SELECT VERSION()`;

  return (
    <div
      className={classNames(styles.environement, {
        [styles.development]: kind == 'env' && env === 'development',
        [styles.production]:
          kind === 'info' ||
          kind === 'deps' ||
          kind === 'mysql' ||
          env === 'production',
      })}
    >
      {kind === 'env' && (env === 'development' ? 'Dev' : 'Prod')}
      {kind === 'env' && ` - ${packageJson.version}`}
      {kind === 'info' && process.version}
      {kind === 'deps' &&
        deps.length > 0 &&
        deps
          .map(dep => {
            const found = packageJson.dependencies[dep];

            return found && `${dep}@${found}`;
          })
          .join(', ')}
      {kind === 'mysql' && mysqlVersion[0]['VERSION()']}
    </div>
  );
};

export default Environment;
