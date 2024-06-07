import classNames from 'classnames';
import { getPackage } from '@/utils/getPackage';
import styles from './index.module.css';
import type { FC } from 'react';

const Environment: FC = async () => {
  const env = process.env.NODE_ENV;
  const display = process.env.DISPLAY_ENV;

  if (!display) return null;

  const packageJson = await getPackage();

  return (
    <div
      className={classNames(styles.environement, {
        [styles.development]: env === 'development',
        [styles.production]: env === 'production',
      })}
    >
      {env === 'development' && 'Dev'}
      {env === 'production' && 'Prod'}
      {` - ${packageJson.version}`}
    </div>
  );
};

export default Environment;
