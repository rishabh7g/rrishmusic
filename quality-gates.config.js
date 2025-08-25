/**
 * Quality Gates Configuration for CI/CD Pipeline
 * 
 * This configuration defines quality standards and automated checks
 * to ensure code quality and prevent regressions in the RrishMusic platform.
 */

export default {
  // Code quality thresholds
  codeQuality: {
    // Coverage requirements
    coverage: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
      
      // Critical path coverage (higher standards)
      criticalPaths: {
        'src/components/forms/': 85,
        'src/hooks/': 85,
        'src/utils/': 90,
      },
    },
    
    // TypeScript strict mode compliance
    typescript: {
      strictMode: true,
      noImplicitAny: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      exactOptionalPropertyTypes: true,
    },
    
    // ESLint quality standards
    linting: {
      maxWarnings: 0,
      maxErrors: 0,
      enforceConsistency: true,
    },
    
    // Build requirements
    build: {
      mustSucceed: true,
      maxBundleSize: '500kb', // Main bundle size limit
      maxAssetSize: '100kb',  // Individual asset size limit
      
      // Performance budgets
      performanceBudgets: {
        'dist/assets/index-*.js': '400kb',
        'dist/assets/index-*.css': '100kb',
      },
    },
  },
  
  // Security requirements
  security: {
    // npm audit requirements
    auditLevel: 'moderate', // high, moderate, low, critical
    allowedVulnerabilities: 0,
    
    // Dependency scanning
    dependencyCheck: true,
    
    // License compliance
    licenseCheck: true,
    allowedLicenses: [
      'MIT',
      'ISC',
      'BSD-2-Clause',
      'BSD-3-Clause',
      'Apache-2.0',
    ],
  },
  
  // Performance requirements
  performance: {
    // Lighthouse scores (minimum thresholds)
    lighthouse: {
      performance: 80,
      accessibility: 90,
      bestPractices: 85,
      seo: 90,
      pwa: 60,
    },
    
    // Load time requirements
    loadTimes: {
      firstContentfulPaint: 2000,  // 2 seconds
      largestContentfulPaint: 3000, // 3 seconds
      cumulativeLayoutShift: 0.1,
      firstInputDelay: 100, // 100ms
    },
    
    // Bundle analysis
    bundleAnalysis: {
      checkDuplicates: true,
      maxChunks: 10,
      treeShaking: true,
    },
  },
  
  // Testing requirements
  testing: {
    // Unit test requirements
    unitTests: {
      minPassRate: 100, // All tests must pass
      coverage: 80,
      timeout: 30000, // 30 seconds max per test
    },
    
    // E2E test requirements
    e2eTests: {
      minPassRate: 95, // 95% of E2E tests must pass
      timeout: 60000, // 60 seconds max per E2E test
      retries: 2,
      
      // Critical user journeys must pass
      criticalJourneys: [
        'teaching-inquiry-flow',
        'performance-booking-flow',
        'collaboration-inquiry-flow',
      ],
    },
    
    // Test environment requirements
    testEnvironments: {
      browsers: ['chromium', 'firefox', 'webkit'],
      devices: ['desktop', 'mobile', 'tablet'],
      viewports: ['1920x1080', '1366x768', '375x667'],
    },
  },
  
  // Code style and consistency
  codeStyle: {
    // Formatting requirements
    formatting: {
      prettier: true,
      consistent: true,
      maxLineLength: 100,
    },
    
    // Naming conventions
    naming: {
      components: 'PascalCase',
      functions: 'camelCase',
      constants: 'UPPER_SNAKE_CASE',
      files: 'kebab-case',
    },
    
    // Import organization
    imports: {
      sortImports: true,
      groupImports: true,
      removeUnusedImports: true,
    },
  },
  
  // Accessibility requirements
  accessibility: {
    // WCAG compliance level
    wcagLevel: 'AA',
    
    // Automated accessibility testing
    axeCore: {
      enabled: true,
      rules: 'wcag2aa',
      tags: ['wcag2a', 'wcag2aa'],
    },
    
    // Manual testing requirements
    manualTesting: {
      keyboardNavigation: true,
      screenReader: true,
      colorContrast: true,
      focusManagement: true,
    },
  },
  
  // Git and versioning requirements
  git: {
    // Commit message standards
    commitMessages: {
      format: 'conventional-commits',
      maxLength: 72,
      enforceScope: false,
    },
    
    // Branch protection
    branchProtection: {
      requirePRReview: true,
      requireStatusChecks: true,
      requireUpToDate: true,
      dismissStaleReviews: true,
    },
    
    // Merge requirements
    merge: {
      squashCommits: true,
      deleteHeadBranch: true,
      requireLinearHistory: false,
    },
  },
  
  // Monitoring and alerting
  monitoring: {
    // CI/CD pipeline monitoring
    pipeline: {
      maxDuration: 1800, // 30 minutes max pipeline duration
      alertOnFailure: true,
      slackNotifications: true,
    },
    
    // Performance monitoring
    performanceMonitoring: {
      realUserMonitoring: true,
      syntheticTesting: true,
      alertThresholds: {
        loadTime: 5000, // 5 seconds
        errorRate: 1,   // 1%
      },
    },
    
    // Quality trend monitoring
    qualityTrends: {
      trackCoverage: true,
      trackPerformance: true,
      trackSecurity: true,
      generateReports: true,
    },
  },
  
  // Exception handling
  exceptions: {
    // Files/paths that can skip certain quality gates
    skipCoverage: [
      'src/**/*.stories.{ts,tsx}',
      'src/test/**',
    ],
    
    skipLinting: [
      // Legacy files can be exempted temporarily
    ],
    
    skipPerformance: [
      // Development-only routes
    ],
    
    // Emergency bypass (requires approval)
    emergencyBypass: {
      enabled: false,
      requiresApproval: true,
      timeLimit: '24h',
    },
  },
  
  // Reporting and notifications
  reporting: {
    // Quality dashboards
    dashboard: {
      enabled: true,
      url: 'https://dashboard.example.com',
      updateFrequency: 'daily',
    },
    
    // Notifications
    notifications: {
      email: {
        enabled: true,
        recipients: ['team@example.com'],
        triggers: ['failure', 'success_after_failure'],
      },
      
      slack: {
        enabled: true,
        webhook: process.env.SLACK_WEBHOOK_URL,
        channel: '#dev-alerts',
        triggers: ['failure', 'quality_regression'],
      },
      
      github: {
        prComments: true,
        prLabels: true,
        issueCreation: true,
      },
    },
  },
};