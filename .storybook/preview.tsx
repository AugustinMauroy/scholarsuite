import * as React from 'react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { ToastProvider } from '../providers/toastProvider';
import LocaleProvider from '../providers/locale';
import messages from '../i18n/locales/en.json';
import type { Preview, ReactRenderer } from '@storybook/react';
import '../styles/globals.css';

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    actions: { argTypesRegex: '^on[A-Z].*' },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
    Story => (
      <LocaleProvider locale="en" messages={messages} timeZone="UTC">
        <ToastProvider viewportClassName="absolute top-0 left-0 list-none">
          <Story />
        </ToastProvider>
      </LocaleProvider>
    ),
  ],
};

export default preview;
