import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/content": path.resolve(__dirname, "./src/content"),
      "@/test": path.resolve(__dirname, "./src/test")
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    // GitHub Pages SPA optimization
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    exclude: ['**/tests/e2e/**', '**/node_modules/**', '**/dist/**', '**/cypress/**', '**/coverage/**', '**/.{idea,git,cache,output,temp}/**'],
    // Test execution configuration
    reporter: process.env.CI ? ['verbose', 'junit'] : ['verbose'],
    outputFile: process.env.CI ? {
      junit: './test-results.xml'
    } : undefined,
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'dist/',
        'build/',
        'coverage/',
        'public/',
        '*.config.js',
        '*.config.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        // Exclude debug components from coverage
        'src/components/debug/**/*',
        // Exclude type definitions and constants
        'src/types/**/*',
        'src/utils/constants.ts'
      ],
      include: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts'
      ],
      // Quality thresholds for CI/CD (disabled for development)
      thresholds: {
        global: {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0,
        },
        // Per-file thresholds for critical files (disabled)
        'src/hooks/**/*.ts': {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0,
        },
        'src/utils/formValidation.ts': {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0,
        }
      },
    },
    // Test execution settings
    testTimeout: 10000,
    hookTimeout: 10000,
    // Improved error reporting
    onConsoleLog: (log, type) => {
      if (type === 'stderr' && log.includes('Warning')) {
        return false; // Filter out React warnings in tests
      }
    },
    // Parallel execution for faster tests
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: process.env.CI ? 2 : undefined,
        minThreads: process.env.CI ? 1 : undefined,
      },
    },
    // Improved watch mode for development
    watch: !process.env.CI,
    // Retry flaky tests
    retry: process.env.CI ? 2 : 0,
  },
  // GitHub Pages preview configuration
  preview: {
    port: 4173,
    host: true,
    strictPort: true,
  },
  // Development server configuration
  server: {
    port: 5173,
    host: true,
    // Handle client-side routing in development
    historyApiFallback: true,
  },
});