import { cyan } from 'tailwindcss/colors';
import { generateColorVariations } from './utils/styles';
import type { Config } from 'tailwindcss';

export default {
  content: ['./**/*.tsx'],
  theme: {
    extend: {
      colors: {
        brand: process.env.CUSTOM_COLOR
          ? generateColorVariations(process.env.CUSTOM_COLOR)
          : cyan,
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
