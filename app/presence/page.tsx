import BaseLayout from '@/components/Layout/Base/index.tsx';
import Component from '@/components/Presence/AbsencePeriodsList/index.tsx';
import type { FC } from 'react';

const AbsencePeriodPage: FC = () => (
  <BaseLayout title="Absence Periods">
    <Component />
  </BaseLayout>
);

export default AbsencePeriodPage;
