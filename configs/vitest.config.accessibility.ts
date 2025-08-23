import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest configuration for Accessibility Tests
 * 
 * Focus: WCAG compliance, screen reader compatibility, keyboard navigation
 * Coverage: Component accessibility coverage
 * Speed: Moderate execution time for thorough a11y checks
 */
export default defineConfig({
  plugins: [react()],
  test: {
    name: "accessibility",
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts", "./src/test/setup-accessibility.ts"],
    
    // Test file patterns for accessibility tests
    include: [
      "tests/accessibility/**/*.{test,spec}.{js,ts,tsx}",
      "src/**/*.a11y.{test,spec}.{js,ts,jsx,tsx}",
      "src/**/__tests__/**/accessibility.{test,spec}.{js,ts,jsx,tsx}",
      "src/components/**/__tests__/**/*.a11y.{test,spec}.{js,ts,jsx,tsx}"
    ],
    
    // Exclude other test types
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.integration.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.perf.{test,spec}.{js,ts,jsx,tsx}",
      "**/*.e2e.{test,spec}.{js,ts,jsx,tsx}",
      // Keep only accessibility-specific tests
      "!src/**/*.a11y.{test,spec}.{js,ts,jsx,tsx}",
      "!src/**/__tests__/**/accessibility.{test,spec}.{js,ts,jsx,tsx}"
    ],
    
    // Coverage focusing on component accessibility
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "lcov"],
      reportsDirectory: "./test-results/coverage/accessibility",
      include: [
        "src/components/**/*.{js,ts,jsx,tsx}",
        "src/hooks/**/*.{js,ts,jsx,tsx}"
      ],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.stories.{js,ts,jsx,tsx}",
        "src/test/**/*",
        "src/**/__tests__/**/*",
        "src/**/types.ts"
      ],
      thresholds: {
        global: {
          branches: 75,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Higher requirements for interactive components
        "src/components/ui/**/*": {
          branches: 85,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    },
    
    // Performance settings for accessibility tests
    testTimeout: 20000, // 20 seconds for thorough a11y analysis
    hookTimeout: 5000,  // 5 seconds for setup/teardown
    
    // Reporter configuration
    reporter: process.env.CI 
      ? ["verbose", "junit", "json"] 
      : ["default", "html"],
    
    outputFile: {
      junit: "./test-results/junit/accessibility-results.xml",
      json: "./test-results/json/accessibility-results.json",
      html: "./test-results/html/accessibility-report.html"
    },
    
    // Retry configuration for potentially flaky a11y checks
    retry: process.env.CI ? 2 : 1,
    
    // Watch mode settings
    watch: !process.env.CI,
    
    // Pool settings
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
    
    // Environment variables for accessibility testing
    env: {
      NODE_ENV: "test",
      VITEST_A11Y: "true",
      // Enable accessibility debugging
      AXE_DEBUG: process.env.CI ? "false" : "true",
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
  
  // Define configuration for accessibility testing
  define: {
    __DEV__: false,
    __TEST__: true,
    __A11Y__: true,
  },
});