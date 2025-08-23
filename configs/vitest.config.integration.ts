import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest configuration for Integration Tests
 * 
 * Focus: Component integration with content system, API integration
 * Coverage: Moderate coverage requirements (80%+)
 * Speed: Moderate execution time allowed for realistic scenarios
 */
export default defineConfig({
  plugins: [react()],
  test: {
    name: "integration",
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts", "./src/test/setup-integration.ts"],
    
    // Test file patterns for integration tests
    include: [
      "src/**/*.integration.{test,spec}.{js,ts,jsx,tsx}",
      "src/**/__tests__/**/integration.{test,spec}.{js,ts,jsx,tsx}",
      "src/content/__tests__/integration.test.tsx"
    ],
    
    // Exclude other test types
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.perf.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.e2e.{test,spec}.{js,ts,jsx,tsx}",
      "tests/**/*",
      "src/**/*.perf.test.{ts,tsx}"
    ],
    
    // Coverage configuration for integration tests
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "lcov"],
      reportsDirectory: "./test-results/coverage/integration",
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
          branches: 80,
          functions: 85,
          lines: 85,
          statements: 85
        },
        // Focus on content system integration
        "src/content/**/*": {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    },
    
    // Performance settings for integration tests
    testTimeout: 15000, // 15 seconds max per test (more time for integration)
    hookTimeout: 5000,  // 5 seconds for setup/teardown
    
    // Reporter configuration
    reporter: process.env.CI 
      ? ["verbose", "junit", "json"] 
      : ["default", "html"],
    
    outputFile: {
      junit: "./test-results/junit/integration-results.xml",
      json: "./test-results/json/integration-results.json",
      html: "./test-results/html/integration-report.html"
    },
    
    // Retry configuration
    retry: process.env.CI ? 3 : 1, // More retries for flaky integration tests
    
    // Watch mode settings
    watch: !process.env.CI,
    
    // Pool settings - use fewer workers for integration tests
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true, // Sequential execution for integration tests
      }
    },
    
    // Mock configuration - less aggressive mocking for integration
    mockReset: false,
    clearMocks: false,
    restoreMocks: false,
    
    // Test sequence settings
    sequence: {
      concurrent: false, // Run integration tests sequentially
      shuffle: false,    // Deterministic order
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
  
  esbuild: {
    target: "es2020",
  },
});