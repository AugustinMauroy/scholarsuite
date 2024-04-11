'use client';
import { IntlProvider } from 'next-intl';
import type { FC, ComponentProps } from 'react';

type LocalProviderProps = ComponentProps<typeof IntlProvider>;

const LocaleProvider: FC<LocalProviderProps> = ({ children, ...props }) => (
  <IntlProvider {...props}>{children}</IntlProvider>
);

export default LocaleProvider;
