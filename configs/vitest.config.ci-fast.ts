import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest configuration for CI Fast Tests
 * 
 * Optimized for maximum speed in CI/CD pipelines
 * Target: <2 minutes for all unit tests
 * Focus: Essential testing with minimal overhead
 */
export default defineConfig({
  plugins: [react()],
  test: {
    name: "ci-fast",
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup-ci.ts"],
    
    // Fast test patterns - prioritize critical functionality
    include: [
      "src/**/*.{test,spec}.{js,ts,jsx,tsx}",
      "src/**/*.smoke.test.{js,ts,jsx,tsx}",
      "src/**/*.ci.test.{js,ts,jsx,tsx}",
      "src/**/__tests__/**/*.{js,ts,jsx,tsx}"
    ],
    
    // Aggressive exclusions for speed
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.integration.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.perf.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.e2e.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.visual.{test,spec}.{js,ts,jsx,tsx}",
      "tests/**/*",
      "src/**/*.integration.test.{ts,tsx}",
      "src/**/*.perf.test.{ts,tsx}",
      "src/test/utils/test-data-factory.ts",
      // Skip complex setup tests in CI fast mode
      "src/**/*complex*.test.{ts,tsx}",
      "src/**/*slow*.test.{ts,tsx}"
    ],
    
    // Minimal coverage for speed - focus on critical paths only
    coverage: {
      enabled: false, // Disabled for maximum speed
      provider: "v8",
      reporter: ["text-summary"],
      reportsDirectory: "./test-results/coverage/ci-fast",
      include: ["src/**/*.{js,ts,jsx,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.stories.{js,ts,jsx,tsx}",
        "src/test/**/*",
        "src/**/__tests__/**/*",
        "src/**/types.ts",
        "src/**/*.config.ts"
      ]
    },
    
    // Aggressive timeouts for speed
    testTimeout: 3000,     // 3 seconds max per test
    hookTimeout: 1000,     // 1 second for setup/teardown
    teardownTimeout: 1000, // Fast teardown
    
    // Optimized reporter for CI
    reporter: ["basic"],  // Minimal output for speed
    
    outputFile: {
      json: "./test-results/json/ci-fast-results.json"
    },
    
    // No retries in fast mode - fail fast
    retry: 0,
    
    // No watch mode in CI
    watch: false,
    
    // Maximum parallelization
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: false,
        isolate: false, // Faster but less isolated
      }
    },
    
    // Use all available CPU cores
    maxConcurrency: process.env.CI ? 8 : 4,
    minWorkers: 1,
    maxWorkers: process.env.CI ? 8 : 4,
    
    // Mock configuration - minimal setup
    mockReset: false,    // Skip for speed
    clearMocks: true,
    restoreMocks: false, // Skip for speed
    
    // Memory optimization
    isolate: false,      // Faster test execution
    passWithNoTests: true,
    
    // Skip slow operations
    typecheck: {
      enabled: false     // Skip TypeScript checking in fast mode
    }
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
  
  // Optimized build settings for speed
  esbuild: {
    target: "es2020",
    minify: false,        // Skip minification for speed
    sourcemap: false      // Skip source maps in CI
  },
  
  // Optimized dependencies handling
  optimizeDeps: {
    include: ["react", "react-dom", "@testing-library/react"],
    exclude: []
  }
});