import Component from '@/components/AbsencePeriod/List';
import BaseLayout from '@/components/Layout/Base/index.tsx';
import type { FC } from 'react';

const AbsencePeriodPage: FC = () => (
  <BaseLayout title="Absence Periods">
    <Component />
  </BaseLayout>
);

export default AbsencePeriodPage;
