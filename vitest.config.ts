import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // keep this in sync with the `inputs` field in the `.turbo.js` file
      include: [
        'components/**/*',
        'hooks/**/*',
        'providers/**/*',
        'utils/**/*',
      ],
      exclude: ['node_modules', '**/*.stories.tsx'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});
