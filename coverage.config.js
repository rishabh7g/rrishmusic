/**
 * Coverage Configuration for CI/CD Pipeline
 * 
 * This configuration defines coverage collection settings and thresholds
 * for maintaining code quality across the RrishMusic platform.
 */

export default {
  // Coverage collection settings
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
    reportsDirectory: './coverage',
    
    // Files to include in coverage
    include: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/**/*.stories.{ts,tsx}',
      '!src/**/__tests__/**',
      '!src/**/test/**',
    ],
    
    // Files to exclude from coverage
    exclude: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'test/**',
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      'src/vite-env.d.ts',
      'src/main.tsx', // Entry point
      'src/test/**', // Test utilities
    ],
    
    // Coverage thresholds (disabled for development)
    thresholds: {
      global: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
      
      // Per-file thresholds (disabled)
      './src/components/forms/': {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
      
      './src/hooks/': {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
      
      './src/utils/': {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },
    
    // Skip coverage for specific patterns
    skipFull: false,
    
    // Clean coverage directory before each run
    clean: true,
    
    // Enable coverage collection during watch mode
    cleanOnRerun: true,
  },
  
  // Quality gates configuration
  qualityGates: {
    coverageThreshold: 0,
    branchThreshold: 0,
    functionThreshold: 0,
    lineThreshold: 0,
    
    // Fail CI if coverage drops below thresholds
    failOnThreshold: false,
    
    // Allow threshold deviation for specific conditions
    allowedDeviation: 2, // 2% deviation allowed
    
    // Skip threshold check for these file patterns
    skipThresholdFor: [
      'src/**/*.stories.{ts,tsx}',
      'src/test/**',
    ],
  },
  
  // Report configuration
  reporting: {
    // Generate markdown summary for PR comments
    generateMarkdownSummary: true,
    markdownSummaryPath: './coverage/coverage-summary.md',
    
    // HTML report configuration
    htmlReport: {
      subdir: 'html',
      skipEmpty: false,
    },
    
    // JSON report configuration
    jsonReport: {
      file: 'coverage-summary.json',
    },
    
    // LCOV report for external services (Codecov)
    lcovReport: {
      file: 'lcov.info',
    },
  },
  
  // CI/CD specific settings
  ci: {
    // Upload coverage to external services
    uploadCoverage: true,
    
    // Services to upload to
    uploadTargets: [
      'codecov',
    ],
    
    // Comment on PRs with coverage information
    commentOnPR: true,
    
    // Fail PR if coverage decreases significantly
    failOnCoverageDecrease: true,
    coverageDecreaseThreshold: 5, // 5% decrease fails PR
  },
};