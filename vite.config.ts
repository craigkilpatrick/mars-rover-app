/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        '**/*.config.{js,ts,cjs}',
        '**/.eslintrc.{js,cjs}',
        '**/eslint.config.js',
        'dist/**',
        'src/test/**',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/types/**',
        'src/main.tsx',
      ],
    },
  },
})
