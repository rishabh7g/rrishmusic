import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest configuration for Smoke Tests
 * 
 * Critical path functionality only - fastest possible execution
 * Target: <1 minute for all smoke tests
 * Focus: Core functionality verification
 */
export default defineConfig({
  plugins: [react()],
  test: {
    name: "smoke",
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup-ci.ts"],
    
    // Only smoke tests - critical functionality
    include: [
      "src/**/*.smoke.test.{js,ts,jsx,tsx}",
      "tests/smoke/**/*.{test,spec}.{js,ts,jsx,tsx}"
    ],
    
    // Exclude everything else
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.integration.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.perf.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.e2e.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.visual.{test,spec}.{js,ts,jsx,tsx}"
    ],
    
    // No coverage for maximum speed
    coverage: {
      enabled: false
    },
    
    // Ultra-fast timeouts
    testTimeout: 2000,     // 2 seconds max per test
    hookTimeout: 500,      // 500ms for setup/teardown
    teardownTimeout: 500,
    
    // Minimal reporter
    reporter: ["basic"],
    
    // No retries - fail fast
    retry: 0,
    watch: false,
    
    // Maximum parallelization
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: false,
        isolate: false
      }
    },
    
    // Optimize for speed
    maxConcurrency: 8,
    minWorkers: 1,
    maxWorkers: 8,
    
    // Skip all mocks setup for speed
    mockReset: false,
    clearMocks: false,
    restoreMocks: false,
    
    // Maximum speed optimizations
    isolate: false,
    passWithNoTests: true,
    typecheck: { enabled: false }
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "@/components": path.resolve(__dirname, "../src/components"),
      "@/hooks": path.resolve(__dirname, "../src/hooks"),
      "@/utils": path.resolve(__dirname, "../src/utils"),
      "@/types": path.resolve(__dirname, "../src/types"),
      "@/content": path.resolve(__dirname, "../src/content"),
    },
  },
  
  esbuild: {
    target: "es2020",
    minify: false,
    sourcemap: false
  }
});