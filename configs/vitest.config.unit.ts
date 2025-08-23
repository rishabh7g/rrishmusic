import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest configuration for Unit Tests
 * 
 * Focus: Component logic, utilities, hooks, and pure functions
 * Coverage: High coverage requirements (95%+)
 * Speed: Fast execution for developer feedback
 */
export default defineConfig({
  plugins: [react()],
  test: {
    name: "unit",
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    
    // Test file patterns for unit tests
    include: [
      "src/**/*.{test,spec}.{js,ts,jsx,tsx}",
      "src/**/__tests__/**/*.{js,ts,jsx,tsx}"
    ],
    
    // Exclude integration and performance tests
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.integration.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.perf.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.e2e.{test,spec}.{js,ts,jsx,tsx}",
      "tests/**/*",
      "src/**/*.integration.test.{ts,tsx}",
      "src/**/*.perf.test.{ts,tsx}",
      "src/test/utils/test-data-factory.ts"
    ],
    
    // Coverage configuration for unit tests
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "lcov"],
      reportsDirectory: "./test-results/coverage/unit",
      include: [
        "src/**/*.{js,ts,jsx,tsx}"
      ],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.stories.{js,ts,jsx,tsx}",
        "src/test/**/*",
        "src/**/__tests__/**/*",
        "src/**/types.ts",
        "src/**/*.config.ts"
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 95,
          lines: 95,
          statements: 95
        },
        // Lower thresholds for complex components
        "src/components/**/*": {
          branches: 85,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    },
    
    // Performance settings for unit tests
    testTimeout: 5000, // 5 seconds max per test
    hookTimeout: 2000, // 2 seconds for setup/teardown
    
    // Reporter configuration
    reporter: process.env.CI 
      ? ["verbose", "junit", "json"] 
      : ["default", "html"],
    
    outputFile: {
      junit: "./test-results/junit/unit-results.xml",
      json: "./test-results/json/unit-results.json",
      html: "./test-results/html/unit-report.html"
    },
    
    // Retry configuration
    retry: process.env.CI ? 2 : 0,
    
    // Watch mode settings
    watch: !process.env.CI,
    
    // Pool settings for parallel execution
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: false,
      }
    },
    
    // Mock configuration
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
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
  },
});