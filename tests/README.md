# E2E Testing Documentation

This directory contains comprehensive End-to-End (E2E) tests for the RrishMusic website using Playwright.

## Overview

The E2E test suite covers:
- **Homepage functionality** - Content loading, navigation, interactions
- **Navigation flows** - Menu navigation, smooth scrolling, deep linking
- **Mobile experience** - Responsive design, touch interactions
- **Contact forms** - Form validation, submission flows
- **Lesson packages** - Package display, pricing information
- **Performance** - Core Web Vitals, loading times, optimization
- **Accessibility** - WCAG compliance, keyboard navigation, screen readers

## Test Structure

```
tests/e2e/
├── setup.ts                 # Test fixtures and configuration
├── page-objects/
│   └── HomePage.ts          # Page Object Model for homepage
├── homepage.spec.ts         # Homepage functionality tests
├── navigation.spec.ts       # Navigation and scrolling tests
├── mobile.spec.ts          # Mobile-specific tests
├── contact.spec.ts         # Contact form and inquiry tests
├── lessons.spec.ts         # Lesson packages and pricing tests
└── performance.spec.ts     # Performance and optimization tests
```

## Running Tests

### Prerequisites
```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:e2e:install
```

### Basic Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run tests with browser UI visible
npm run test:e2e:headed

# Show test report
npm run test:e2e:report

# Run all tests (unit + E2E)
npm run test:all
```

### Specific Test Categories

```bash
# Run only homepage tests
npx playwright test homepage.spec.ts

# Run only mobile tests
npx playwright test mobile.spec.ts

# Run performance tests
npx playwright test performance.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Environment-Specific Testing

```bash
# Test against local development server
BASE_URL=http://localhost:5173 npm run test:e2e

# Test against staging
BASE_URL=https://staging.rrishmusic.com npm run test:e2e

# Test against production
BASE_URL=https://www.rrishmusic.com npm run test:e2e
```

## Test Categories

### 1. Homepage Tests (`homepage.spec.ts`)
- ✅ Page loading and basic structure
- ✅ Hero section content and functionality
- ✅ Content sections (About, Teaching, Testimonials)
- ✅ Contact section and social links
- ✅ Image loading and optimization
- ✅ Footer content and links
- ✅ Content quality validation
- ✅ Error handling

### 2. Navigation Tests (`navigation.spec.ts`)
- ✅ Navigation menu functionality
- ✅ Smooth scrolling between sections
- ✅ Deep linking and URL fragments
- ✅ Mobile navigation (hamburger menu)
- ✅ Browser back/forward navigation
- ✅ Keyboard accessibility
- ✅ ARIA landmarks and labels

### 3. Mobile Tests (`mobile.spec.ts`)
- ✅ Mobile layout optimization (375px)
- ✅ Tablet layout (768px)
- ✅ Touch-friendly interactions
- ✅ Mobile navigation patterns
- ✅ Performance on mobile
- ✅ Accessibility on mobile devices
- ✅ Cross-device consistency

### 4. Contact Tests (`contact.spec.ts`)
- ✅ Contact information display
- ✅ Social media links functionality
- ✅ Contact form validation
- ✅ Form submission flow
- ✅ Inquiry user journeys
- ✅ Accessibility compliance
- ✅ Mobile contact experience

### 5. Lessons Tests (`lessons.spec.ts`)
- ✅ Teaching approach presentation
- ✅ Lesson package display
- ✅ Pricing information
- ✅ Package comparison features
- ✅ Call-to-action buttons
- ✅ Different skill level content
- ✅ Mobile package experience

### 6. Performance Tests (`performance.spec.ts`)
- ✅ Core Web Vitals (FCP, LCP, CLS)
- ✅ Resource loading optimization
- ✅ Image optimization and lazy loading
- ✅ Runtime performance
- ✅ Network failure handling
- ✅ Performance budgets

## Page Object Model

The tests use the Page Object Model (POM) pattern for better maintainability:

### HomePage Class
```typescript
const homePage = new HomePage(page);
await homePage.goto();
await homePage.verifyHeroContent();
await homePage.clickNavLink('about');
await homePage.fillContactForm(testData.user);
```

### Key Methods
- `goto()` - Navigate to homepage
- `verifyHeroContent()` - Validate hero section
- `clickNavLink(section)` - Navigate via menu
- `scrollToSection(id)` - Smooth scroll to section
- `fillContactForm(data)` - Fill contact form
- `checkImagesLoaded()` - Verify image loading

## Test Configuration

### Browser Matrix
- **Chromium** - Chrome/Edge testing
- **Firefox** - Firefox testing  
- **WebKit** - Safari testing
- **Mobile Chrome** - Pixel 5 simulation
- **Mobile Safari** - iPhone 12 simulation

### Viewport Sizes
```typescript
mobile: { width: 375, height: 812 }
tablet: { width: 768, height: 1024 }
desktop: { width: 1280, height: 720 }
desktopLarge: { width: 1920, height: 1080 }
```

### Performance Thresholds
```typescript
firstContentfulPaint: < 1800ms
largestContentfulPaint: < 2500ms
cumulativeLayoutShift: < 0.1
totalLoadTime: < 3000ms
```

## Custom Fixtures

### Test Data
```typescript
testData: {
  user: {
    name: 'Test User',
    email: 'test@example.com',
    message: 'I am interested in learning blues guitar...'
  }
}
```

### Performance Helper
```typescript
const metrics = await performanceHelper.measurePageLoad();
await performanceHelper.assertPerformanceThresholds(metrics);
```

### Accessibility Helper
```typescript
await accessibilityHelper.checkKeyboardNavigation();
await accessibilityHelper.checkAriaLabels();
await accessibilityHelper.checkHeadingHierarchy();
```

## CI/CD Integration

### GitHub Actions Workflow
The tests run automatically on:
- **Push to main/develop** - Full test suite
- **Pull requests** - All browsers + accessibility
- **Manual trigger** - On-demand testing

### Test Artifacts
- Playwright HTML reports
- Screenshots on failure
- Videos on failure
- Performance metrics
- Accessibility reports

## Best Practices

### Test Design
1. **Independent Tests** - Each test can run in isolation
2. **Descriptive Names** - Tests serve as documentation
3. **Page Objects** - Reusable, maintainable selectors
4. **Custom Fixtures** - Shared test data and helpers
5. **Error Handling** - Graceful failure scenarios

### Performance Considerations
1. **Parallel Execution** - Tests run in parallel by default
2. **Smart Waiting** - Use `waitForLoadState('networkidle')`
3. **Selective Testing** - Run specific test categories
4. **Resource Management** - Clean up test data

### Accessibility Testing
1. **Keyboard Navigation** - Tab through all interactive elements
2. **Screen Reader Support** - ARIA labels and landmarks
3. **Color Contrast** - Sufficient contrast ratios
4. **Semantic HTML** - Proper heading hierarchy

## Troubleshooting

### Common Issues

**Tests timing out:**
```bash
# Increase timeout in playwright.config.ts
timeout: 60000
```

**Flaky tests:**
```bash
# Run with retries
npx playwright test --retries=2
```

**Screenshots not captured:**
```bash
# Ensure screenshot config in playwright.config.ts
screenshot: 'only-on-failure'
```

**Network issues:**
```bash
# Test with slow network simulation
await page.route('**/*', route => {
  setTimeout(() => route.continue(), 300);
});
```

### Debug Mode
```bash
# Run specific test in debug mode
npx playwright test homepage.spec.ts --debug

# Use browser developer tools
await page.pause();
```

### Visual Debugging
```bash
# Run tests with browser UI
npm run test:e2e:headed

# Use Playwright UI mode
npm run test:e2e:ui
```

## Maintenance

### Updating Tests
1. **Selector Updates** - Update page objects when UI changes
2. **New Features** - Add tests for new functionality
3. **Performance Budgets** - Adjust thresholds as needed
4. **Browser Updates** - Keep Playwright updated

### Monitoring
1. **Test Reports** - Review HTML reports regularly
2. **Performance Trends** - Monitor Core Web Vitals
3. **Accessibility Compliance** - Regular WCAG audits
4. **Browser Compatibility** - Test across all target browsers

## Contributing

When adding new E2E tests:

1. **Follow Naming Convention** - `feature.spec.ts`
2. **Use Page Objects** - Extend existing or create new page objects
3. **Add Documentation** - Update this README
4. **Test Categories** - Group related tests in describe blocks
5. **Performance Impact** - Consider test execution time

### Example New Test
```typescript
import { test, expect } from './setup';
import { HomePage } from './page-objects/HomePage';

test.describe('New Feature', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should test new functionality', async () => {
    // Test implementation
  });
});
```

---

## Support

For questions or issues with E2E testing:

1. Check this documentation first
2. Review existing test patterns
3. Consult Playwright documentation
4. Check GitHub Actions workflow logs
5. Create an issue with test details

**Happy Testing!** 🎭🎸