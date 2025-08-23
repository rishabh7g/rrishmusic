# Testing Infrastructure Guide

This document provides a comprehensive overview of the testing infrastructure for the RrishMusic project.

## 🧪 Test Categories

### 1. Unit Tests
**Purpose**: Test individual components, functions, and utilities in isolation
**Configuration**: `configs/vitest.config.unit.ts`
**Location**: `src/**/*.{test,spec}.{js,ts,tsx}`

```bash
# Run unit tests
npm run test:unit

# With coverage
npm run test:unit:coverage

# Watch mode
npm run test:unit:watch

# UI mode
npm run test:unit:ui
```

**Coverage Targets**:
- Statements: 95%
- Branches: 90%
- Functions: 95%
- Lines: 95%

### 2. Integration Tests
**Purpose**: Test component integration with content system and APIs
**Configuration**: `configs/vitest.config.integration.ts`
**Location**: `src/**/*.integration.{test,spec}.{js,ts,tsx}`

```bash
# Run integration tests
npm run test:integration

# With coverage
npm run test:integration:coverage

# Watch mode
npm run test:integration:watch
```

**Coverage Targets**:
- Statements: 85%
- Branches: 80%
- Functions: 85%
- Lines: 85%

### 3. End-to-End (E2E) Tests
**Purpose**: Test complete user workflows across browsers
**Configuration**: `configs/playwright.config.ts`
**Location**: `tests/e2e/**/*.spec.ts`

```bash
# Run E2E tests (all browsers)
npm run test:e2e

# Specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Mobile tests
npm run test:e2e:mobile

# Debug mode
npm run test:e2e:debug
npm run test:e2e:headed
npm run test:e2e:ui
```

### 4. Performance Tests
**Purpose**: Performance benchmarks, memory usage, bundle analysis
**Configuration**: `configs/vitest.config.performance.ts`
**Location**: `tests/performance/**/*.test.ts`, `src/**/*.perf.test.ts`

```bash
# Run all performance tests
npm run test:performance

# Specific performance tests
npm run test:performance:hooks
npm run test:performance:components
npm run test:performance:bundle
npm run test:performance:memory
npm run test:performance:vitals
npm run test:performance:lighthouse
```

### 5. Accessibility Tests
**Purpose**: WCAG compliance, screen reader support, keyboard navigation
**Configuration**: `configs/vitest.config.accessibility.ts`
**Location**: `tests/accessibility/**/*.test.ts`, `src/**/*.a11y.test.ts`

```bash
# Run accessibility tests
npm run test:a11y

# Full accessibility audit
npm run test:a11y:audit

# Watch mode
npm run test:a11y:watch

# With coverage
npm run test:a11y:coverage
```

### 6. Visual Regression Tests
**Purpose**: Visual consistency and UI regression detection
**Configuration**: `configs/playwright.config.visual.ts`
**Location**: `tests/visual/**/*.spec.ts`

```bash
# Run visual tests
npm run test:visual

# Update baseline screenshots
npm run test:visual:update

# Specific browser
npm run test:visual:chromium

# UI mode
npm run test:visual:ui
```

## 🚀 Quick Start Commands

### Run All Tests
```bash
# Complete test suite
npm run test:all

# CI-optimized test run
npm run test:ci

# Quick smoke tests
npm run test:quick

# Parallel execution (unit, integration, performance)
npm run test:parallel
```

### Watch Modes
```bash
npm run test:unit:watch          # Unit tests
npm run test:integration:watch   # Integration tests
npm run test:a11y:watch         # Accessibility tests
npm run test:performance:watch   # Performance tests
```

### Coverage Reports
```bash
npm run test:unit:coverage       # Unit test coverage
npm run test:integration:coverage # Integration test coverage
npm run test:a11y:coverage       # Accessibility test coverage
```

## 📁 Project Structure

```
├── configs/                          # Test configurations
│   ├── vitest.config.unit.ts        # Unit test config
│   ├── vitest.config.integration.ts # Integration test config
│   ├── vitest.config.performance.ts # Performance test config
│   ├── vitest.config.accessibility.ts # Accessibility test config
│   ├── playwright.config.ts         # E2E test config
│   └── playwright.config.visual.ts  # Visual test config
├── tests/
│   ├── e2e/                         # End-to-end tests
│   ├── visual/                      # Visual regression tests
│   ├── accessibility/               # Accessibility tests
│   └── performance/                 # Performance tests
├── src/
│   ├── **/__tests__/               # Unit tests
│   ├── **/*.test.{ts,tsx}          # Unit tests
│   ├── **/*.integration.test.{ts,tsx} # Integration tests
│   ├── **/*.a11y.test.{ts,tsx}     # Accessibility tests
│   └── **/*.perf.test.{ts,tsx}     # Performance tests
├── test-results/                    # Test outputs
│   ├── coverage/                    # Coverage reports
│   ├── junit/                       # JUnit XML reports
│   ├── json/                        # JSON test results
│   ├── html/                        # HTML reports
│   └── reports/                     # Custom reports
└── .github/workflows/               # CI/CD workflows
    ├── test-unit.yml
    ├── test-integration.yml
    ├── test-e2e.yml
    ├── test-performance.yml
    ├── test-accessibility.yml
    └── test-all.yml
```

## ⚙️ Configuration Details

### Unit Tests (`vitest.config.unit.ts`)
- **Environment**: jsdom
- **Coverage**: v8 provider
- **Timeout**: 5 seconds per test
- **Parallel**: Yes (forks)
- **Mocking**: Aggressive (mockReset: true)

### Integration Tests (`vitest.config.integration.ts`)
- **Environment**: jsdom with additional setup
- **Coverage**: v8 provider (lower thresholds)
- **Timeout**: 15 seconds per test
- **Parallel**: Sequential (singleFork: true)
- **Mocking**: Conservative (mockReset: false)

### E2E Tests (`playwright.config.ts`)
- **Browsers**: Chromium, Firefox, WebKit
- **Devices**: Desktop + Mobile (iPhone 12, Pixel 5)
- **Timeout**: 30 seconds per test
- **Retries**: 2 on CI
- **Artifacts**: Screenshots, videos, traces

### Performance Tests (`vitest.config.performance.ts`)
- **Environment**: jsdom with performance monitoring
- **Timeout**: 60 seconds per test
- **Parallel**: Sequential for accurate measurements
- **Mocking**: Minimal for realistic performance

### Accessibility Tests (`vitest.config.accessibility.ts`)
- **Environment**: jsdom with axe-core
- **Coverage**: Component-focused
- **Timeout**: 20 seconds per test
- **Standards**: WCAG 2.1 AA

### Visual Tests (`playwright.config.visual.ts`)
- **Browsers**: Chromium (primary), Firefox (optional)
- **Devices**: Desktop, Mobile, Tablet
- **Screenshots**: Baseline comparison
- **Threshold**: 0.15 (15% pixel difference allowed)

## 🔄 CI/CD Integration

### GitHub Actions Workflows

1. **Unit Tests** (`test-unit.yml`)
   - Runs on: Push, PR to main/develop
   - Matrix: Node 18, 20
   - Artifacts: Coverage reports, test results

2. **Integration Tests** (`test-integration.yml`)
   - Runs on: Push, PR to main/develop
   - Single job
   - Artifacts: Coverage reports, test results

3. **E2E Tests** (`test-e2e.yml`)
   - Runs on: Push, PR to main/develop, daily schedule
   - Matrix: Chromium, Firefox, WebKit
   - Artifacts: Screenshots, videos, HTML reports

4. **Performance Tests** (`test-performance.yml`)
   - Runs on: Push to main, weekly schedule
   - Jobs: Performance tests, Lighthouse, Bundle analysis
   - Artifacts: Performance reports, Lighthouse results

5. **Accessibility Tests** (`test-accessibility.yml`)
   - Runs on: Push to main, weekly schedule
   - Jobs: Unit a11y, E2E a11y, Lighthouse audit
   - Artifacts: WCAG compliance reports

6. **All Tests** (`test-all.yml`)
   - Orchestrates all test workflows
   - Smart matrix based on trigger event
   - Comprehensive reporting

### Test Results

- **Reports**: Available as GitHub Actions artifacts
- **Coverage**: Uploaded to Codecov (if configured)
- **PR Comments**: Automated test result summaries
- **Pages**: Test reports deployed to GitHub Pages

## 📊 Quality Gates

### Critical Tests (Fail Build)
- Unit Tests: Must pass with 95% coverage
- Integration Tests: Must pass with 85% coverage

### Warning Tests (Don't Fail Build)
- E2E Tests: Failures on PRs are warnings
- Performance Tests: Degradation warnings
- Accessibility Tests: WCAG violation warnings

### Test Execution Strategy

**Pull Requests**:
- Unit Tests (required)
- Integration Tests (required)
- E2E Tests (limited matrix)

**Main Branch**:
- All test categories
- Full browser matrix
- Complete performance suite

**Scheduled Runs**:
- Daily: Complete E2E suite
- Weekly: Performance and accessibility audits

## 🛠️ Development Workflow

### Writing Tests

1. **Unit Tests**: Test individual functions/components
   ```typescript
   // src/utils/__tests__/helpers.test.ts
   describe('formatDate', () => {
     it('should format date correctly', () => {
       expect(formatDate('2023-01-01')).toBe('January 1, 2023');
     });
   });
   ```

2. **Integration Tests**: Test component integration
   ```typescript
   // src/content/__tests__/integration.test.tsx
   describe('Content System Integration', () => {
     it('should render content with proper data flow', async () => {
       render(<ContentComponent />);
       await waitFor(() => {
         expect(screen.getByText('Expected Content')).toBeInTheDocument();
       });
     });
   });
   ```

3. **E2E Tests**: Test user workflows
   ```typescript
   // tests/e2e/user-journey.spec.ts
   test('user can navigate and contact', async ({ page }) => {
     await page.goto('/');
     await page.click('[data-testid="contact-link"]');
     await expect(page).toHaveURL('/contact');
   });
   ```

### Test Data Management

- **Unit Tests**: Mock data and functions
- **Integration Tests**: Test data factories
- **E2E Tests**: Realistic test data, cleanup after tests
- **Performance Tests**: Consistent data sets for benchmarking

### Debugging Tests

```bash
# Debug specific test
npm run test:unit -- --reporter=verbose MyComponent.test.tsx

# Debug E2E test
npm run test:e2e:debug

# Debug with UI
npm run test:unit:ui
npm run test:e2e:ui
```

## 📈 Metrics and Reporting

### Coverage Reports
- **Unit Tests**: Detailed component and function coverage
- **Integration Tests**: System integration coverage
- **Accessibility Tests**: Component accessibility coverage

### Performance Metrics
- **Bundle Size**: Tracked and reported
- **Core Web Vitals**: LCP, FID, CLS measurements
- **Memory Usage**: Component memory profiling
- **Render Performance**: Component render time benchmarks

### Test Execution Metrics
- **Execution Time**: Per category and overall
- **Flakiness Rate**: Test reliability tracking
- **Pass Rate**: Success rate monitoring

## 🔧 Maintenance and Best Practices

### Test Maintenance
- **Regular Review**: Monthly test health checks
- **Flaky Test Management**: Automated detection and alerts
- **Performance Monitoring**: Execution time tracking
- **Coverage Analysis**: Meaningful coverage over percentage targets

### Writing Guidelines
- **Test Naming**: Descriptive names that explain behavior
- **Test Structure**: AAA pattern (Arrange, Act, Assert)
- **Test Independence**: Each test should run independently
- **Mock Strategy**: Mock external dependencies, not internal logic

### Troubleshooting Common Issues

1. **Flaky Tests**: Check timing, animations, network dependencies
2. **Coverage Issues**: Ensure all code paths are tested
3. **Performance Tests**: Check for consistent environment
4. **Visual Tests**: Handle dynamic content and animations

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/)
- [Axe Accessibility Testing](https://www.deque.com/axe/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated**: August 2025  
**Next Review**: Before major feature releases