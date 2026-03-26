import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shjeon0730/mask-hook': path.resolve(__dirname, '../mask-hook/src/index.ts'),
    },
  },
});