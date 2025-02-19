import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: './build',
    rollupOptions: {
      onwarn: (warning, handler) => {
        if (warning.code === 'EVAL') return;

        handler(warning);
      },
    },
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
  define: {
    'process.env': process.env,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    include: ['./src/**/*.test.jsx', './src/**/*.test.js'],
    reporters: ['default'],
  },
  experimental: {
    renderBuiltUrl(filename, { hostType, type }) {
      const basePath = process.env.PR_NUMBER ? '/pr-' + process.env.PR_NUMBER : '';

      if (hostType === 'html' && type === 'asset') {
        return `${basePath}/${filename}`;
      }

      return { relative: true };
    },
  },
});
