import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest configuration for Performance Tests
 * 
 * Focus: Performance benchmarks, memory usage, bundle analysis
 * Coverage: Not applicable for performance tests
 * Speed: Longer execution times allowed for accurate measurements
 */
export default defineConfig({
  plugins: [react()],
  test: {
    name: "performance",
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts", "./src/test/setup-performance.ts"],
    
    // Test file patterns for performance tests
    include: [
      "tests/performance/**/*.{test,spec}.{js,ts}",
      "src/**/*.perf.{test,spec}.{js,ts,jsx,tsx}",
      "src/**/__tests__/**/performance.{test,spec}.{js,ts,jsx,tsx}",
      "src/content/__tests__/performance.test.ts"
    ],
    
    // Exclude other test types
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.integration.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.e2e.{test,spec}.{js,ts,jsx,tsx}",
      "src/**/__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}",
      // Keep only performance-specific tests
      "!src/**/*.perf.{test,spec}.{js,ts,jsx,tsx}",
      "!src/**/__tests__/**/performance.{test,spec}.{js,ts,jsx,tsx}"
    ],
    
    // No coverage for performance tests
    coverage: {
      enabled: false,
    },
    
    // Performance settings - longer timeouts for benchmarks
    testTimeout: 60000, // 60 seconds max per performance test
    hookTimeout: 10000, // 10 seconds for setup/teardown
    
    // Reporter configuration - detailed output for performance
    reporter: process.env.CI 
      ? ["verbose", "json", "junit"] 
      : ["verbose", "html"],
    
    outputFile: {
      junit: "./test-results/junit/performance-results.xml",
      json: "./test-results/json/performance-results.json",
      html: "./test-results/html/performance-report.html"
    },
    
    // No retries for performance tests - they should be deterministic
    retry: 0,
    
    // Watch mode disabled for performance tests
    watch: false,
    
    // Single-threaded execution for consistent performance measurements
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      }
    },
    
    // Mock configuration - minimal mocking for realistic performance
    mockReset: false,
    clearMocks: false,
    restoreMocks: false,
    
    // Sequential execution for accurate benchmarks
    sequence: {
      concurrent: false,
      shuffle: false,
    },
    
    // Performance-specific environment variables
    env: {
      NODE_ENV: "test",
      VITEST_PERFORMANCE: "true",
      // Disable animations for consistent timing
      REACT_DISABLE_ANIMATION: "true",
    },
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "@/components": path.resolve(__dirname, "../src/components"),
      "@/hooks": path.resolve(__dirname, "../src/hooks"),
      "@/utils": path.resolve(__dirname, "../src/utils"),
      "@/types": path.resolve(__dirname, "../src/types"),
      "@/content": path.resolve(__dirname, "../src/content"),
      "@/test": path.resolve(__dirname, "../src/test"),
    },
  },
  
  // Optimized build for performance testing
  esbuild: {
    target: "es2020",
    minify: false, // Keep unminified for better performance analysis
    sourcemap: true,
  },
  
  // Define configuration for performance benchmarks
  define: {
    __DEV__: false,
    __TEST__: true,
    __PERFORMANCE__: true,
  },
});