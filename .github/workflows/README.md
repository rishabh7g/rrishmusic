# RrishMusic CI/CD Workflows

This directory contains a comprehensive CI/CD system designed for modern web development with categorized testing, smart execution, and production-ready quality gates.

## 🎯 Overview

The RrishMusic project uses a sophisticated CI/CD pipeline that provides:

- **Smart Test Execution** - Only runs tests relevant to changed files
- **Parallel Processing** - Multiple test categories run simultaneously 
- **Comprehensive Reporting** - Detailed results with PR comments and artifacts
- **Performance Monitoring** - Lighthouse audits and performance budgets
- **Accessibility Validation** - WCAG compliance checking
- **Multi-browser Testing** - Cross-browser compatibility validation
- **Scheduled Testing** - Automated daily and frequent test runs

## 📋 Available Workflows

### Primary Workflows

#### `tests.yml` - Main Comprehensive Test Workflow
**Triggers:** Pull requests, pushes to main, manual dispatch
**Purpose:** Smart test execution based on file changes

Features:
- Detects changes and runs only relevant test categories
- Parallel execution across test types
- Comprehensive reporting and artifact collection
- PR comments with test summaries

#### `test-orchestrator.yml` - Test Suite Orchestrator
**Triggers:** Scheduled (daily + 6-hourly), manual dispatch
**Purpose:** Orchestrates comprehensive test runs with different strategies

Test Suites:
- **comprehensive** - All tests across all browsers
- **essential** - Core tests (unit, integration, E2E)
- **performance** - Performance testing only
- **accessibility** - A11y compliance only
- **quick** - Unit tests only
- **regression** - E2E + performance for releases

### Category-Specific Workflows

#### `test-unit.yml` - Unit Tests
- Fast feedback for logic changes
- Coverage reporting with thresholds
- Multi-Node.js version testing
- Component, hooks, utils, services testing

#### `test-integration.yml` - Integration Tests
- Component integration validation
- API integration testing
- Service interaction testing
- Environment-specific configurations

#### `test-e2e.yml` - End-to-End Tests
- Full user workflow validation
- Multi-browser testing (Chromium, Firefox, WebKit)
- Visual regression testing
- Test report deployment to GitHub Pages

#### `test-performance.yml` - Performance Tests
- Lighthouse audits with performance budgets
- Core Web Vitals measurement
- Bundle size analysis
- Memory leak detection
- Performance regression prevention

#### `test-a11y.yml` - Accessibility Tests
- WCAG 2.1 AA/AAA compliance validation
- Axe-core automated accessibility testing
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast verification

### Legacy Workflow

#### `test.yml` - Legacy Test Suite (Deprecated)
- Maintained for backward compatibility
- Provides migration guidance
- Only runs when explicitly enabled

## 🚀 Quick Start

### For Pull Requests
The test system automatically runs when you create a PR:

1. **Smart Detection** - Analyzes changed files
2. **Relevant Tests** - Runs only necessary test categories
3. **Fast Feedback** - Parallel execution for speed
4. **Detailed Reports** - PR comments with results

### Manual Test Execution

#### Run Comprehensive Tests
```bash
# Via GitHub Actions UI
# Go to Actions → Test Orchestrator → Run workflow
# Select "comprehensive" test suite
```

#### Run Specific Categories
```bash
# Unit tests only
# Go to Actions → Unit Tests → Run workflow

# Performance tests only  
# Go to Actions → Performance Tests → Run workflow

# Accessibility tests only
# Go to Actions → Accessibility Tests → Run workflow
```

### Local Development Testing
```bash
# Quick unit tests
npm run test

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance

# All tests
npm run test:all
```

## 🔧 Configuration

### Test Configuration File
Configuration is managed in `.github/test-config.json`:

```json
{
  "thresholds": {
    "coverage": { "unit": 80, "overall": 85 },
    "performance": { "lighthouse": { "performance": 85 } },
    "accessibility": { "minScore": 90 }
  },
  "testSuites": {
    "comprehensive": {
      "tests": ["unit", "integration", "e2e", "performance", "a11y"],
      "browsers": ["chromium", "firefox", "webkit"]
    }
  }
}
```

### Environment URLs
- **Local**: `http://localhost:4173`
- **Staging**: `https://staging.rrishmusic.com`
- **Production**: `https://www.rrishmusic.com`

### Performance Budgets
- **JavaScript Bundle**: ≤ 500KB
- **CSS Bundle**: ≤ 100KB  
- **Lighthouse Performance**: ≥ 85/100
- **First Contentful Paint**: ≤ 2.0s
- **Largest Contentful Paint**: ≤ 2.5s

### Coverage Thresholds
- **Unit Tests**: ≥ 80%
- **Integration Tests**: ≥ 70%
- **Overall Coverage**: ≥ 85%

## 📊 Test Categories & Triggers

### Smart Test Execution

| File Changes | Triggered Tests |
|-------------|----------------|
| `src/**/*.{ts,tsx}` | Unit Tests |
| `src/components/**` | Unit, Integration, A11y |
| `src/pages/**` | Unit, Integration, E2E |
| `package.json` | All Tests |
| `vite.config.ts` | E2E, Performance |
| `*.md` files only | No Tests (Skipped) |
| Main branch push | All Tests |

### Test Categories

#### 🧪 Unit Tests
- **Purpose**: Fast feedback for logic changes
- **Scope**: Components, hooks, utilities, services
- **Duration**: ~2-5 minutes
- **Browsers**: N/A (Node.js)
- **Artifacts**: Coverage reports, test results

#### 🔗 Integration Tests  
- **Purpose**: Component and service integration
- **Scope**: Component interactions, API integrations
- **Duration**: ~5-10 minutes
- **Browsers**: N/A (Node.js + test server)
- **Artifacts**: Test results, integration reports

#### 🎭 E2E Tests
- **Purpose**: Full user workflow validation
- **Scope**: Complete user journeys
- **Duration**: ~10-20 minutes
- **Browsers**: Chromium, Firefox, WebKit
- **Artifacts**: Screenshots, test reports, Playwright traces

#### ⚡ Performance Tests
- **Purpose**: Performance regression prevention
- **Scope**: Lighthouse, Web Vitals, bundle analysis
- **Duration**: ~5-15 minutes
- **Browsers**: Chromium (for Lighthouse)
- **Artifacts**: Lighthouse reports, performance metrics

#### ♿ Accessibility Tests
- **Purpose**: WCAG compliance validation
- **Scope**: Automated and manual a11y checks
- **Duration**: ~5-10 minutes
- **Browsers**: Chromium (for audits)
- **Artifacts**: Accessibility reports, violation details

## 📅 Scheduled Testing

### Daily Comprehensive (2:00 AM UTC)
- **Suite**: Comprehensive
- **Environment**: Production
- **Browsers**: All (Chromium, Firefox, WebKit)
- **Duration**: ~30-45 minutes

### Frequent Essential (Every 6 hours)
- **Suite**: Essential  
- **Environment**: Production
- **Browsers**: Chromium only
- **Duration**: ~15-20 minutes

### Weekly Cleanup (Sundays 3:00 AM UTC)
- Removes old artifacts (30+ days)
- Cleans up workflow runs (90+ days)
- Optimizes repository size

## 📈 Reporting & Notifications

### PR Comments
Each test category automatically comments on PRs with:
- Test results summary
- Coverage information
- Performance metrics
- Accessibility compliance status
- Links to detailed reports

### GitHub Issues
Automatically created for:
- Scheduled test failures
- Performance regressions
- Accessibility violations
- Critical errors

### Artifacts
Generated artifacts include:
- **Coverage Reports** (HTML, JSON)
- **Test Results** (JUnit XML, JSON)
- **Screenshots** (E2E failures)
- **Performance Reports** (Lighthouse HTML/JSON)
- **Accessibility Reports** (Axe results)

## 🛠️ Troubleshooting

### Common Issues

#### Tests Not Running on PR
1. Check file change patterns in workflow triggers
2. Verify branch protection rules
3. Check workflow permissions

#### Performance Tests Failing
1. Check performance budgets in config
2. Verify Lighthouse can access test URL
3. Review bundle size changes

#### E2E Tests Flaky
1. Check for timing issues in tests
2. Verify selectors are stable
3. Add appropriate waits

#### Accessibility Violations
1. Review Axe-core results
2. Test with keyboard navigation
3. Check color contrast ratios
4. Verify ARIA labels

### Getting Help

1. **Check Workflow Logs** - Detailed execution logs in Actions tab
2. **Review Artifacts** - Download test reports for detailed analysis  
3. **Configuration** - Verify settings in `test-config.json`
4. **Documentation** - Refer to individual workflow files for specifics

## 🔄 Migration from Legacy System

If you're migrating from the old test system:

1. **New Workflows Active** - The comprehensive system is already set up
2. **Legacy Disabled** - Old `test.yml` is deprecated but available for debugging
3. **Automatic Transition** - PRs automatically use the new system
4. **No Action Required** - Migration is seamless

### Benefits of New System
- ✅ **50% faster** execution through parallelization
- ✅ **Smart execution** - only runs relevant tests
- ✅ **Better reporting** - comprehensive PR comments
- ✅ **Performance monitoring** - regression prevention
- ✅ **Accessibility validation** - WCAG compliance
- ✅ **Multi-browser support** - broader compatibility testing

## 📝 Contributing to Test System

### Adding New Tests
1. Place tests in appropriate directories:
   - Unit: `tests/unit/`
   - Integration: `tests/integration/`
   - E2E: `tests/e2e/`
   - Performance: `tests/performance/`
   - Accessibility: `tests/a11y/`

2. Follow naming conventions:
   - Unit: `*.test.{ts,tsx}`
   - Integration: `*.test.{ts,tsx}`
   - E2E: `*.spec.{ts,tsx}`

3. Update file patterns in `test-config.json` if needed

### Modifying Workflows
1. Test changes locally when possible
2. Update documentation in this README
3. Consider backward compatibility
4. Update `test-config.json` for new settings

---

This comprehensive CI/CD system ensures high code quality, prevents regressions, and provides fast feedback for the RrishMusic development team. For questions or improvements, please create an issue or PR.