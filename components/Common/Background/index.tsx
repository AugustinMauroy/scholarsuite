import TriangleGrid from '@/components/Common/Pattern';
import styles from './index.module.css';
import type { FC } from 'react';

const GlowingBackdrop: FC = () => (
  <div className={styles.glowingBackdrop}>
    <TriangleGrid />
  </div>
);

export default GlowingBackdrop;
