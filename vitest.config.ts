/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    testTimeout: 10000,
    passWithNoTests: true,
    allowOnly: true,
    dangerouslyIgnoreUnhandledErrors: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});