import classNames from 'classnames';
import prisma from '@/lib/prisma';
import { getPackage } from '@/utils/getPackage';
import styles from './index.module.css';
import type { FC } from 'react';

// Expected type for environment variables
type Raw = {
  version: string;
};

type EnvironmentProps = {
  forceDisplay?: boolean;
  kind?: 'env' | 'info' | 'deps' | 'postgresql';
  deps?: string[];
};

// PostgreSQL 15.4 on aarch64-apple-darwin21.6.0, compiled by Apple clang version 14.0.0 (clang-1400.0.29.102), 64-bit
// to
// 15.4
const postgresqlRegex = /PostgreSQL (\d+\.\d+)/;

const Environment: FC<EnvironmentProps> = async ({
  forceDisplay,
  kind = 'info',
  deps = [],
}) => {
  const env = process.env.NODE_ENV;
  const display = process.env.DISPLAY_ENV || forceDisplay;

  if (!display) return null;

  const packageJson = await getPackage();
  const postgresqlVersion = await prisma.$queryRaw<Raw[]>`SELECT VERSION()`;

  return (
    <div
      className={classNames(styles.environement, {
        [styles.development]: kind == 'env' && env === 'development',
        [styles.production]:
          kind === 'info' ||
          kind === 'deps' ||
          kind === 'postgresql' ||
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

      {kind === 'postgresql' &&
        postgresqlVersion[0]?.version.match(postgresqlRegex)?.[1]}
    </div>
  );
};

export default Environment;
