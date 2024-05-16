import colors from 'tailwindcss/colors';
import type { Config } from 'tailwindcss';

if (process.env.CUSTOM_COLOR && typeof process.env.CUSTOM_COLOR !== 'string') {
  throw new Error('CUSTOM_COLOR must be a string');
}

export default {
  content: ['./**/*.tsx'],
  theme: {
    extend: {
      colors: {
        brand: process.env.CUSTOM_COLOR
          ? // @ts-ignore
            colors[process.env.CUSTOM_COLOR]
          : colors.teal,
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/4': '3 / 4',
      },
    },
  },
  darkMode:
    process.env.BUILD_ENV === 'storybook'
      ? ['class', '[data-theme="dark"]']
      : 'media',
} as Config;
