import * as RadixAvatar from '@radix-ui/react-avatar';
import classNames from 'classnames';
import styles from './index.module.css';
import type { FC } from 'react';

type AvatarProps = {
  src: string;
  alt: string;
  className?: string;
};

const Avatar: FC<AvatarProps> = ({ src, alt, className }) => (
  <RadixAvatar.Root className={styles.avatarRoot}>
    <RadixAvatar.Image
      loading="lazy"
      src={src}
      alt={alt}
      className={classNames(className, styles.avatar)}
    />
    <RadixAvatar.Fallback
      delayMs={500}
      className={classNames(className, styles.avatar)}
    >
      {alt}
    </RadixAvatar.Fallback>
  </RadixAvatar.Root>
);

export default Avatar;
