import type { Config } from 'tailwindcss';

export default {
  content: [
    './.storybook/**/*.stories.tsx',
    './app/**/*.tsx',
    './components/**/*.tsx',
  ],
  theme: {
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
        '3/4': '3 / 4',
      },
      maxHeight: {
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '3/4': '75%',
        '4/5': '80%',
        '9/10': '90%',
      },
    },
  },
  darkMode:
    process.env.BUILD_ENV === 'storybook'
      ? ['class', '[data-theme="dark"]']
      : 'media',
} as Config;
