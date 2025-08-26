# End-to-End Testing with Playwright

This directory contains comprehensive end-to-end tests for the RrishMusic multi-service platform using Playwright.

## 🎯 Test Coverage

### Service-Specific Tests
- **Teaching Service** (`teachingService.spec.ts`): Guitar lesson inquiries, form submissions, package selection
- **Performance Service** (`performanceService.spec.ts`): Booking workflows, portfolio browsing, Instagram integration  
- **Collaboration Service** (`collaborationService.spec.ts`): Creative project inquiries, portfolio showcase, process flows

### Cross-Service Tests
- **Navigation** (`crossServiceNavigation.spec.ts`): Inter-service navigation, consistency, mobile UX

## 🚀 Running Tests

### Prerequisites
```bash
# Install Playwright browsers (first time only)
npm run test:e2e:install
```

### Run All E2E Tests
```bash
# Run all tests headlessly
npm run test:e2e

# Run with UI (visual test runner)
npm run test:e2e:ui

# Run specific test file
npx playwright test teachingService

# Run specific browser
npx playwright test --project=chromium
```

### Debug Mode
```bash
# Run in debug mode (opens browser)
npx playwright test --debug

# Run specific test with debug
npx playwright test teachingService --debug
```

## 🌐 Browser Support

Tests run across multiple browsers and devices:

- **Desktop**: Chromium, Firefox, WebKit (Safari)
- **Mobile**: Chrome Mobile (Pixel 7), Safari Mobile (iPhone 14)  
- **Tablet**: iPad Pro

## 📱 Mobile Testing

Mobile-specific tests include:
- Touch interactions
- Responsive layout verification
- Mobile navigation patterns
- Touch-friendly button sizing
- Mobile-optimized forms

## 🎨 Test Categories

### 1. Page Load and Rendering
- ✅ Page loads successfully
- ✅ All required sections display  
- ✅ Mobile responsiveness
- ✅ SEO meta tags

### 2. User Interactions
- ✅ Form submissions
- ✅ Navigation flows
- ✅ Button/link interactions
- ✅ Keyboard navigation

### 3. Service-Specific Workflows
- ✅ Teaching: Lesson inquiries and package selection
- ✅ Performance: Booking requests and portfolio browsing
- ✅ Collaboration: Project inquiries and process understanding

### 4. Cross-Service Features  
- ✅ Navigation between services
- ✅ Brand consistency
- ✅ Cross-service suggestions
- ✅ URL structure

### 5. Performance & Accessibility
- ✅ Load time optimization
- ✅ Accessibility standards (WCAG)
- ✅ Screen reader compatibility  
- ✅ Keyboard navigation

### 6. Error Handling
- ✅ Network failures
- ✅ Form validation
- ✅ 404 error pages
- ✅ JavaScript disabled scenarios

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)
- **Base URL**: http://localhost:4173 (Vite preview server)
- **Timeout**: 30s for tests, 5s for assertions
- **Retry**: 2 retries on CI, 0 locally
- **Artifacts**: Screenshots/videos on failure
- **Trace**: Enabled on retry for debugging

### Environment Variables
- `CI=true`: Enables CI-specific settings
- Custom base URL: `BASE_URL=https://staging.example.com`

## 📊 Test Reports

### HTML Report
```bash
# Generate and open HTML report
npx playwright show-report
```

### CI/CD Integration
Tests automatically run on:
- Push to `main` or `develop` branches
- Pull requests to `main`
- Generate artifacts for failed tests
- Support for parallel execution

## 🐛 Debugging Failed Tests

### 1. Visual Debugging
```bash
# Open failed test with browser
npx playwright test --debug --grep "failing test name"
```

### 2. Screenshots and Videos
Failed tests automatically generate:
- Screenshots at failure point
- Video recordings of test execution
- Browser console logs
- Network request logs

### 3. Trace Viewer
```bash
# View detailed trace
npx playwright show-trace test-results/path-to-trace.zip
```

## 📝 Writing New Tests

### Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page');
    await page.waitForLoadState('networkidle');
  });

  test('should perform specific action', async ({ page }) => {
    // Test implementation
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
```

### Best Practices
1. **Wait for page loads**: Use `waitForLoadState('networkidle')`
2. **Use semantic selectors**: Prefer `getByRole()`, `getByLabel()` over CSS selectors
3. **Handle async operations**: Proper awaiting of page interactions
4. **Mobile considerations**: Test both desktop and mobile viewports
5. **Cross-browser compatibility**: Avoid browser-specific features

### Selector Priority
1. `page.getByRole()` - Semantic roles (button, heading, etc.)
2. `page.getByLabel()` - Form labels  
3. `page.getByTestId()` - Test-specific attributes
4. `page.locator()` - CSS/XPath selectors (last resort)

## 🚨 Common Issues

### 1. Timing Issues
```typescript
// ❌ Don't do this
await page.click('button');
await expect(element).toBeVisible(); // May fail due to timing

// ✅ Do this  
await page.click('button');
await page.waitForTimeout(1000); // Or better: wait for specific condition
await expect(element).toBeVisible();
```

### 2. Mobile Testing
```typescript
// Check if running on mobile
test('mobile-specific behavior', async ({ page, isMobile }) => {
  if (isMobile) {
    // Mobile-specific assertions
  }
});
```

### 3. Dynamic Content
```typescript
// Wait for dynamic content
const dynamicElement = page.locator('.dynamic-content');
await dynamicElement.waitFor({ state: 'visible' });
```

## 📈 Performance Monitoring

Tests include performance assertions:
- Page load time < 3 seconds
- Navigation time < 2 seconds  
- Form submission responsiveness
- Image loading optimization

## 🔒 Security Testing

E2E tests verify:
- HTTPS redirects
- Secure form submissions
- XSS prevention
- Content Security Policy compliance

---

For more information about Playwright, visit: https://playwright.dev/