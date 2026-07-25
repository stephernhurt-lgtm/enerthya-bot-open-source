import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'src/core'),
      '@config': resolve(__dirname, 'src/config'),
      '@commands': resolve(__dirname, 'src/commands'),
      '@events': resolve(__dirname, 'src/events'),
      '@db': resolve(__dirname, 'src/db'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
});
