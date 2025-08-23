# Testing Quick Reference Guide

## Command Cheat Sheet

### Essential Test Commands

```bash
# Unit & Integration Tests
npm test                    # Watch mode for development
npm test -- --run         # Single run (CI mode)
npm run test:ui           # Interactive test UI
npm run test:coverage     # Coverage report

# E2E Tests  
npm run test:e2e          # All E2E tests
npm run test:e2e:ui       # Interactive E2E UI
npm run test:e2e:debug    # Debug mode
npm run test:e2e:headed   # Visible browser
npm run test:e2e:report   # View test report

# Performance Tests
npm run test:performance              # All performance tests
npm run test:performance:hooks        # Content hook performance
npm run test:performance:components   # Component rendering
npm run test:performance:bundle       # Bundle size analysis
npm run test:performance:memory       # Memory usage
npm run test:performance:vitals       # Core Web Vitals
npm run test:performance:lighthouse   # Lighthouse audit

# All Tests
npm run test:all          # Complete test suite
```

### Specific Test Execution

```bash
# Run specific test file
npm test -- src/components/Hero/__tests__/Hero.test.tsx
npx playwright test tests/e2e/homepage.spec.ts

# Run tests matching pattern
npm test -- --grep "validation"
npx playwright test --grep "navigation"

# Run tests for specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run mobile tests only
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Test Environment Commands

```bash
# Install test dependencies
npm ci
npm run test:e2e:install

# Clear test cache
npm test -- --clearCache

# Update test snapshots
npm test -- --update-snapshots

# Run with different base URL
BASE_URL=http://localhost:5173 npm run test:e2e
BASE_URL=https://staging.rrishmusic.com npm run test:e2e
```

## Test File Structure Reference

### Project Test Organization

```
├── src/
│   ├── components/
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       └── __tests__/
│   │           └── Hero.test.tsx
│   ├── content/
│   │   └── __tests__/
│   │       ├── content-system.test.ts      (189 total tests)
│   │       ├── hooks.test.tsx             (34 hook tests)
│   │       ├── integration.test.tsx       (42 integration tests)
│   │       ├── performance.test.ts        (28 performance tests)
│   │       ├── types.test.ts              (25 type tests)
│   │       └── validation.test.ts         (56 validation tests)
│   ├── hooks/
│   │   └── __tests__/
│   │       └── useScrollSpy.test.ts
│   ├── utils/
│   │   └── __tests__/
│   │       ├── animations.test.ts
│   │       └── helpers.test.ts
│   └── test/
│       ├── setup.ts                       # Global test setup
│       └── utils/
│           └── spyUtils.ts                # Test utilities
├── tests/
│   ├── e2e/
│   │   ├── setup.ts                       # E2E test setup  
│   │   ├── page-objects/
│   │   │   └── HomePage.ts                # Page object models
│   │   ├── contact.spec.ts                # Contact workflow tests
│   │   ├── homepage.spec.ts               # Homepage functionality
│   │   ├── lessons.spec.ts                # Lesson package tests
│   │   ├── mobile.spec.ts                 # Mobile experience
│   │   ├── navigation.spec.ts             # Navigation tests
│   │   ├── performance.spec.ts            # Performance monitoring
│   │   └── smoke.spec.ts                  # Quick validation tests
│   └── performance/
│       ├── bundle-analysis.test.ts        # Bundle size monitoring
│       ├── component-rendering.perf.test.ts # Component performance
│       ├── content-hooks.perf.test.ts     # Hook performance
│       ├── lighthouse.test.ts             # Lighthouse auditing
│       ├── memory-usage.test.ts           # Memory monitoring
│       └── web-vitals.test.ts             # Core Web Vitals
└── docs/
    ├── TESTING.md                         # Main testing guide
    ├── TESTING_WORKFLOW.md               # Developer workflow
    ├── TESTING_CI_CD.md                  # CI/CD documentation
    ├── TESTING_BEST_PRACTICES.md         # Standards & conventions
    └── TESTING_QUICK_REFERENCE.md        # This file
```

## Test Categories Overview

### Unit Tests (189 tests total)
- **Content System**: Validation, types, hooks, performance
- **Components**: Individual component functionality
- **Utilities**: Helper functions and animations
- **Hooks**: Custom React hooks

### Integration Tests 
- **Component Integration**: Components + content system
- **Hook Integration**: Multiple hooks working together
- **User Interactions**: Click, navigation, form submissions
- **Responsive Behavior**: Mobile/desktop adaptations

### E2E Tests (24 tests across 3 browsers = 72 test runs)
- **Smoke Tests**: Quick validation (4 tests)
- **Homepage**: Core functionality (6 tests)
- **Navigation**: Menu and scrolling (4 tests)
- **Mobile**: Mobile-specific experience (3 tests)
- **Contact**: Contact workflows (3 tests)
- **Lessons**: Lesson packages (2 tests)  
- **Performance**: Core Web Vitals (2 tests)

### Performance Tests
- **Content Hooks**: Hook execution performance
- **Component Rendering**: Mount and render times
- **Bundle Analysis**: Size optimization monitoring
- **Memory Usage**: Memory leak detection
- **Web Vitals**: FCP, LCP, CLS measurements
- **Lighthouse**: Overall performance auditing

## Configuration Files Reference

### Key Configuration Files

```
├── vitest.config.ts              # Unit/integration test config
├── playwright.config.ts          # E2E test configuration
├── src/test/setup.ts             # Test environment setup
├── tests/e2e/setup.ts            # E2E test fixtures
├── .github/workflows/test.yml    # CI unit test workflow
├── .github/workflows/e2e-tests.yml      # CI E2E workflow
├── .github/workflows/performance-testing.yml # Performance workflow
└── package.json                  # Test script definitions
```

### Test Environment Variables

```bash
# E2E Testing
BASE_URL=http://localhost:5173              # Development
BASE_URL=https://staging.rrishmusic.com     # Staging  
BASE_URL=https://www.rrishmusic.com         # Production

# Performance Testing
PERFORMANCE_BUDGET_KB=500                   # Bundle size limit
LIGHTHOUSE_THRESHOLD_SCORE=90              # Minimum score
MEMORY_LIMIT_MB=100                        # Memory usage limit

# CI Environment
CI=true                                    # CI mode flag
NODE_ENV=test                             # Test environment
VITE_APP_ENV=test                         # App test mode
```

## Common Troubleshooting Solutions

### Unit Test Issues

**Test cache issues:**
```bash
npm test -- --clearCache
rm -rf node_modules/.vite
npm ci
```

**TypeScript errors in tests:**
```bash
npm run type-check
# Fix TypeScript errors, then:
npm test
```

**Coverage issues:**
```bash
npm run test:coverage
# Open coverage/index.html to review
```

### E2E Test Issues

**Browser installation problems:**
```bash
npm run test:e2e:install
npx playwright install --with-deps
npx playwright install-deps
```

**Flaky test debugging:**
```bash
npx playwright test --retries=2 failing-test.spec.ts
npx playwright test --debug failing-test.spec.ts
npx playwright test --trace on failing-test.spec.ts
```

**Timeout issues:**
```bash
# Increase timeout in specific test
test('slow test', { timeout: 60000 }, async ({ page }) => {
  // test code
})

# Or globally in playwright.config.ts
timeout: 60000
```

**Screenshots and videos:**
```bash
# Enable for debugging
# In playwright.config.ts:
screenshot: 'on'
video: 'on'

# View artifacts
npm run test:e2e:report
ls test-results/
```

### Performance Test Issues

**Bundle size exceeded:**
```bash
npm run test:performance:bundle
npm run build -- --analyze
# Review webpack-bundle-analyzer output
```

**Performance regression:**
```bash
npm run test:performance:vitals
node scripts/performance-benchmark.js
# Compare with previous results
```

**Memory leaks:**
```bash
npm run test:performance:memory
# Check for excessive memory growth
# Review component cleanup in tests
```

### CI/CD Issues

**GitHub Actions failures:**
```bash
# Check specific workflow step
gh run view <run-id>

# Download artifacts for investigation  
gh run download <run-id>

# Reproduce locally
npm ci
npm run type-check
npm run lint  
npm test -- --run
npm run build
npm run test:e2e
```

**Branch protection issues:**
```bash
# Ensure all required checks pass
npm run test:all
git push origin feature-branch
# Check GitHub Actions status
```

## Test Data Reference

### Mock Content Data Structure

```typescript
// Test content follows actual JSON structure
const mockContent = {
  hero: {
    title: 'Learn Blues Guitar',
    subtitle: 'Master improvisation with Rrish',
    callToAction: 'Start Learning'
  },
  about: {
    title: 'About Rrish',
    content: 'Experienced blues guitar instructor...',
    image: '/images/rrish-teaching.jpg'
  },
  lessons: [
    {
      id: 'blues-fundamentals',
      title: 'Blues Guitar Fundamentals', 
      duration: '60 minutes',
      price: 80,
      features: [
        'Basic chord progressions',
        'Scale patterns', 
        'Rhythm techniques'
      ]
    }
  ]
}
```

### Test User Data

```typescript
const testUsers = {
  valid: {
    name: 'John Doe',
    email: 'john@example.com', 
    phone: '+61 400 000 000',
    message: 'I am interested in learning blues guitar.'
  },
  invalid: {
    email: 'invalid-email-format',
    phone: '123',
    message: ''
  }
}
```

### E2E Test Fixtures

```typescript
// tests/e2e/setup.ts
export const testData = {
  user: {
    name: 'Test User',
    email: 'test@example.com',
    message: 'I am interested in learning blues guitar improvisation techniques and would like to schedule a lesson.'
  },
  
  navigation: [
    { section: 'hero', id: 'hero', title: 'Hero Section' },
    { section: 'about', id: 'about', title: 'About Rrish' },
    { section: 'approach', id: 'approach', title: 'Teaching Approach' },
    { section: 'lessons', id: 'lessons', title: 'Lesson Packages' },
    { section: 'community', id: 'community', title: 'Community' },
    { section: 'contact', id: 'contact', title: 'Contact' }
  ]
}
```

## Performance Thresholds Reference

### Core Web Vitals Targets

```typescript
const performanceThresholds = {
  // Core Web Vitals
  firstContentfulPaint: 1800,      // ms (Good: <1.8s)
  largestContentfulPaint: 2500,    // ms (Good: <2.5s) 
  cumulativeLayoutShift: 0.1,      // score (Good: <0.1)
  totalBlockingTime: 300,          // ms (Good: <300ms)
  speedIndex: 3000,                // ms (Good: <3.0s)
  
  // Bundle Size Budgets  
  totalBundleSize: 500,            // KB
  javascriptSize: 300,             // KB
  cssSize: 50,                     // KB
  
  // Runtime Performance
  componentMountTime: 100,         // ms
  hookExecutionTime: 50,           // ms
  memoryUsageGrowth: 10,          // MB
  
  // Lighthouse Scores
  performanceScore: 90,            // (0-100)
  accessibilityScore: 95,          // (0-100)
  bestPracticesScore: 90,          // (0-100)
  seoScore: 95                     // (0-100)
}
```

### Test Execution Time Targets

```typescript
const executionTargets = {
  unitTests: {
    total: 30000,           // ms (30 seconds)
    individual: 5000,       // ms (5 seconds per test)
    coverage: 15000         // ms (15 seconds for coverage)
  },
  
  integrationTests: {
    total: 60000,           // ms (1 minute)
    individual: 10000       // ms (10 seconds per test)
  },
  
  e2eTests: {
    total: 300000,          // ms (5 minutes)
    individual: 30000,      // ms (30 seconds per test)
    suite: 600000           // ms (10 minutes full suite)
  },
  
  performanceTests: {
    total: 120000,          // ms (2 minutes)
    individual: 15000       // ms (15 seconds per test)
  }
}
```

## Browser and Device Matrix

### Supported Browsers (E2E Testing)

```typescript
const browserMatrix = {
  desktop: {
    chromium: 'Latest Chrome/Edge',
    firefox: 'Latest Firefox', 
    webkit: 'Latest Safari'
  },
  
  mobile: {
    'Mobile Chrome': 'Pixel 5 simulation',
    'Mobile Safari': 'iPhone 12 simulation'
  },
  
  viewports: {
    mobile: { width: 375, height: 812 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 },
    desktopLarge: { width: 1920, height: 1080 }
  }
}
```

## Accessibility Testing Checklist

### WCAG 2.1 AA Compliance

```typescript
const accessibilityChecks = {
  colorContrast: {
    normal: 4.5,        // Minimum ratio for normal text
    large: 3.0          // Minimum ratio for large text  
  },
  
  keyboardNavigation: [
    'Tab through all interactive elements',
    'Enter/Space activate buttons',
    'Arrow keys navigate menus',
    'Escape closes modals/dropdowns'
  ],
  
  screenReader: [
    'Meaningful heading hierarchy (h1-h6)',
    'Alt text for all images',
    'ARIA labels for complex elements',
    'Skip-to-content links',
    'Landmark regions (nav, main, aside)'
  ],
  
  focus: [
    'Visible focus indicators', 
    'Logical focus order',
    'Focus trapping in modals',
    'Focus restoration after interactions'
  ]
}
```

## Git Workflow with Testing

### Pre-Commit Testing

```bash
# Essential pre-commit checks
npm run type-check      # TypeScript compilation
npm run lint           # Code style validation
npm test -- --run     # Unit/integration tests  
npm run build         # Build validation

# Quick E2E validation
npx playwright test tests/e2e/smoke.spec.ts

# Performance check
npm run test:performance:bundle
```

### Pull Request Testing

```bash
# Complete validation before PR
npm run test:all              # All test categories
npm run test:performance     # Performance validation
npm run build               # Build verification

# Manual checks
# - Review test coverage
# - Check for new test requirements
# - Validate accessibility compliance
```

## Monitoring and Metrics

### Test Health Metrics

```typescript
const testHealthMetrics = {
  coverage: {
    target: 85,           // Overall coverage target
    unit: 90,            // Unit test coverage
    integration: 80      // Integration test coverage
  },
  
  reliability: {
    flakyTestRate: 5,    // Max % of flaky tests
    passRate: 95,        // Min % tests passing
    executionTime: 300   // Max seconds for full suite
  },
  
  maintenance: {
    outdatedTests: 0,    // Tests failing due to outdated code
    testDebt: 5,         // Max % technical debt in tests
    documentation: 90    // % tests with good descriptions
  }
}
```

---

## Emergency Debugging

### Quick Debug Commands

```bash
# Unit test debugging
npm test -- --reporter=verbose src/failing-test.test.ts

# E2E debug with UI
npx playwright test --ui failing-test.spec.ts

# Performance profiling
node --inspect-brk ./node_modules/.bin/vitest run performance-test

# CI failure reproduction
CI=true NODE_ENV=test npm test -- --run

# Memory leak detection
node --trace-warnings --max-old-space-size=4096 npm test
```

### Test Result Interpretation

```bash
# Test output symbols
✓ - Test passed
✗ - Test failed  
⚠ - Test skipped/pending
~ - Test running
⏱ - Test timeout
📸 - Screenshot taken
🎥 - Video recorded
🔍 - Debug info available
```

---

This quick reference provides immediate access to the most common testing commands, configurations, and troubleshooting solutions for the RrishMusic project. Keep this handy for daily development and debugging.

**Happy Testing!** 🧪⚡