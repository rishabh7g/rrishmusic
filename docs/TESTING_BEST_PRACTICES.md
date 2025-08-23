# Testing Best Practices Guide

## Overview

This guide establishes testing standards, conventions, and best practices for the RrishMusic project. Following these practices ensures consistent, maintainable, and reliable tests that serve as both validation and documentation.

## Testing Philosophy

### Core Principles

1. **Tests as Documentation** - Tests should clearly express intent and behavior
2. **Confidence Over Coverage** - Focus on meaningful tests that build confidence
3. **User-Centric Testing** - Test behavior users care about, not implementation details
4. **Fast Feedback Loops** - Tests should run quickly and provide immediate feedback
5. **Maintainable Test Suite** - Tests should be easy to update when code changes

### Testing Pyramid Strategy

```
        E2E Tests (Few)
      ├─ User workflows
      ├─ Cross-browser validation  
      ├─ Performance monitoring
      └─ Accessibility compliance

    Integration Tests (More)
    ├─ Component + Content integration
    ├─ Hook interactions
    ├─ User interaction flows
    └─ Responsive behavior

  Unit Tests (Most)
  ├─ Business logic validation
  ├─ Utility function testing
  ├─ Content system validation
  └─ Type safety verification
```

## Test Organization Standards

### File Structure Conventions

```
src/
├── components/
│   └── sections/
│       ├── Hero.tsx
│       └── __tests__/
│           └── Hero.test.tsx          # Component tests
├── content/
│   ├── hooks/
│   │   └── useContent.ts
│   └── __tests__/
│       ├── content-system.test.ts     # System tests
│       ├── hooks.test.tsx             # Hook tests
│       ├── types.test.ts              # Type tests
│       └── validation.test.ts         # Validation tests
├── utils/
│   ├── helpers.ts
│   └── __tests__/
│       └── helpers.test.ts            # Utility tests
└── test/
    ├── setup.ts                       # Global test setup
    └── utils/
        └── spyUtils.ts                # Test utilities

tests/
├── e2e/
│   ├── setup.ts                       # E2E test setup
│   ├── page-objects/
│   │   └── HomePage.ts                # Page object models
│   ├── homepage.spec.ts               # Feature tests
│   └── performance.spec.ts            # Performance tests
└── performance/
    ├── content-hooks.perf.test.ts     # Hook performance
    └── bundle-analysis.test.ts        # Bundle analysis
```

### Naming Conventions

**Test Files:**
```
ComponentName.test.tsx        # Component tests
feature-name.test.ts         # Feature/utility tests  
feature-name.spec.ts         # E2E tests
feature-name.perf.test.ts    # Performance tests
```

**Test Descriptions:**
```typescript
// ✅ Good - Describes behavior from user perspective
test('should display hero content when data is loaded', () => {})

// ❌ Avoid - Describes implementation details
test('should call useContent hook', () => {})
```

**Test Groups:**
```typescript
describe('Hero Component', () => {
  describe('Content Rendering', () => {
    test('displays main heading and subtitle', () => {})
    test('shows call-to-action button', () => {})
  })
  
  describe('User Interactions', () => {
    test('navigates to contact section on button click', () => {})
  })
  
  describe('Responsive Behavior', () => {
    test('adapts layout for mobile devices', () => {})
  })
})
```

## Unit Testing Best Practices

### Test Structure (AAA Pattern)

```typescript
test('should validate lesson package structure', () => {
  // Arrange - Set up test data and conditions
  const lessonData = {
    title: 'Blues Guitar Fundamentals',
    duration: '60 minutes',
    price: 80
  }

  // Act - Execute the code being tested
  const result = validateLessonPackage(lessonData)

  // Assert - Verify the expected outcome
  expect(result.isValid).toBe(true)
  expect(result.errors).toHaveLength(0)
})
```

### Testing React Components

**Basic Component Rendering:**
```typescript
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import Hero from '../Hero'

describe('Hero Component', () => {
  test('renders hero content correctly', () => {
    render(<Hero />)
    
    // Test for meaningful user-visible content
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
  })
})
```

**Testing Props and State Changes:**
```typescript
test('displays different content based on props', () => {
  const customContent = {
    title: 'Custom Title',
    subtitle: 'Custom Subtitle'
  }

  render(<Hero content={customContent} />)
  
  expect(screen.getByText('Custom Title')).toBeInTheDocument()
  expect(screen.getByText('Custom Subtitle')).toBeInTheDocument()
})
```

**Testing User Interactions:**
```typescript
import userEvent from '@testing-library/user-event'

test('handles button click interaction', async () => {
  const user = userEvent.setup()
  const mockNavigate = vi.fn()
  
  render(<Hero onNavigate={mockNavigate} />)
  
  const ctaButton = screen.getByRole('button', { name: /get started/i })
  await user.click(ctaButton)
  
  expect(mockNavigate).toHaveBeenCalledWith('#contact')
})
```

### Testing Custom Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { useContent } from '../hooks/useContent'

describe('useContent Hook', () => {
  test('loads content successfully', async () => {
    const { result } = renderHook(() => useContent())
    
    // Test initial loading state
    expect(result.current.loading).toBe(true)
    expect(result.current.content).toBeNull()
    
    // Wait for content to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    // Verify loaded content
    expect(result.current.content).toBeDefined()
    expect(result.current.content.hero).toHaveProperty('title')
  })

  test('handles loading errors gracefully', async () => {
    // Mock fetch to simulate error
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))
    
    const { result } = renderHook(() => useContent())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.error).toBeDefined()
    expect(result.current.content).toBeNull()
  })
})
```

### Testing Utility Functions

```typescript
describe('Content Validation Utilities', () => {
  describe('validateEmail', () => {
    test.each([
      ['valid@email.com', true],
      ['user+tag@domain.co.uk', true],
      ['invalid-email', false],
      ['@domain.com', false],
      ['user@', false]
    ])('validates email "%s" as %s', (email, expected) => {
      expect(validateEmail(email)).toBe(expected)
    })
  })

  describe('formatPrice', () => {
    test('formats Australian dollar prices correctly', () => {
      expect(formatPrice(80)).toBe('$80 AUD')
      expect(formatPrice(120)).toBe('$120 AUD')
    })

    test('handles edge cases', () => {
      expect(formatPrice(0)).toBe('Free')
      expect(formatPrice(-10)).toBe('Invalid price')
    })
  })
})
```

## Integration Testing Best Practices

### Testing Component Integration with Content System

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { useContent } from '../../../content/hooks/useContent'
import Hero from '../Hero'

// Mock the content hook
vi.mock('../../../content/hooks/useContent')

describe('Hero Component Integration', () => {
  test('integrates correctly with content system', async () => {
    // Mock content data
    const mockContent = {
      hero: {
        title: 'Learn Blues Guitar',
        subtitle: 'Master improvisation with Rrish',
        callToAction: 'Start Learning'
      }
    }

    vi.mocked(useContent).mockReturnValue({
      content: mockContent,
      loading: false,
      error: null
    })

    render(<Hero />)

    // Verify content integration
    expect(screen.getByText('Learn Blues Guitar')).toBeInTheDocument()
    expect(screen.getByText('Master improvisation with Rrish')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start learning/i })).toBeInTheDocument()
  })

  test('handles loading state appropriately', () => {
    vi.mocked(useContent).mockReturnValue({
      content: null,
      loading: true,
      error: null
    })

    render(<Hero />)

    // Should show loading indicator or skeleton
    expect(screen.getByTestId('hero-loading')).toBeInTheDocument()
  })

  test('handles error state gracefully', () => {
    vi.mocked(useContent).mockReturnValue({
      content: null,
      loading: false,
      error: new Error('Failed to load content')
    })

    render(<Hero />)

    // Should show fallback content
    expect(screen.getByText(/welcome to rrish music/i)).toBeInTheDocument()
  })
})
```

### Testing Responsive Behavior

```typescript
describe('Responsive Component Integration', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    })
  })

  test('adapts to mobile viewport', () => {
    // Mock mobile viewport
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    render(<ResponsiveComponent />)

    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
    expect(screen.queryByTestId('desktop-layout')).not.toBeInTheDocument()
  })
})
```

## End-to-End Testing Best Practices

### Page Object Model Pattern

```typescript
// tests/e2e/page-objects/HomePage.ts
export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')
  }

  async getHeroTitle() {
    return this.page.locator('[data-testid="hero-title"]').textContent()
  }

  async clickCtaButton() {
    await this.page.click('[data-testid="hero-cta"]')
  }

  async navigateToSection(sectionId: string) {
    await this.page.click(`nav a[href="#${sectionId}"]`)
    await this.page.waitForFunction(
      (id) => document.getElementById(id)?.getBoundingClientRect().top! < 100,
      sectionId
    )
  }

  async fillContactForm(data: { name: string; email: string; message: string }) {
    await this.page.fill('[data-testid="contact-name"]', data.name)
    await this.page.fill('[data-testid="contact-email"]', data.email)
    await this.page.fill('[data-testid="contact-message"]', data.message)
  }
}
```

### E2E Test Structure

```typescript
import { test, expect } from '../setup'
import { HomePage } from '../page-objects/HomePage'

test.describe('Homepage User Workflows', () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.goto()
  })

  test('allows user to navigate through sections smoothly', async () => {
    // Test navigation workflow
    await homePage.navigateToSection('about')
    await expect(page.locator('#about')).toBeInViewport()

    await homePage.navigateToSection('lessons')
    await expect(page.locator('#lessons')).toBeInViewport()

    await homePage.navigateToSection('contact')
    await expect(page.locator('#contact')).toBeInViewport()
  })

  test('enables user to submit contact inquiry', async ({ testData }) => {
    await homePage.navigateToSection('contact')
    await homePage.fillContactForm(testData.user)

    const submitButton = page.locator('[data-testid="contact-submit"]')
    await submitButton.click()

    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })
})
```

### Proper Wait Conditions

```typescript
// ❌ Avoid - Fixed delays
await page.waitForTimeout(3000)

// ✅ Use - Wait for specific conditions
await page.waitForLoadState('networkidle')
await expect(page.locator('.content')).toBeVisible()
await page.waitForFunction(() => document.readyState === 'complete')
```

### Cross-Browser Testing

```typescript
test.describe('Cross-Browser Compatibility', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`works correctly in ${browserName}`, async ({ browser }) => {
      const context = await browser.newContext()
      const page = await context.newPage()
      
      await page.goto('/')
      
      // Test core functionality across browsers
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('nav')).toBeVisible()
      
      await context.close()
    })
  })
})
```

## Performance Testing Best Practices

### Content System Performance Testing

```typescript
import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { performance } from 'perf_hooks'

describe('Content Hook Performance', () => {
  let startTime: number
  let endTime: number

  beforeEach(() => {
    startTime = performance.now()
  })

  afterEach(() => {
    endTime = performance.now()
    const duration = endTime - startTime
    
    // Performance assertion
    expect(duration).toBeLessThan(50) // 50ms threshold
  })

  test('useContent hook performs efficiently', async () => {
    const { result } = renderHook(() => useContent())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.content).toBeDefined()
  })
})
```

### Bundle Size Testing

```typescript
import { describe, test, expect } from 'vitest'
import { analyzeBundleSize } from '../utils/bundleAnalyzer'

describe('Bundle Size Analysis', () => {
  test('maintains bundle size within budget', async () => {
    const analysis = await analyzeBundleSize()
    
    expect(analysis.totalSize).toBeLessThan(500 * 1024) // 500KB
    expect(analysis.jsSize).toBeLessThan(300 * 1024)    // 300KB
    expect(analysis.cssSize).toBeLessThan(50 * 1024)    // 50KB
  })

  test('has effective tree shaking', async () => {
    const analysis = await analyzeBundleSize()
    
    expect(analysis.treeShakingEfficiency).toBeGreaterThan(0.8) // 80%
  })
})
```

### Core Web Vitals Testing

```typescript
test('meets Core Web Vitals thresholds', async ({ page }) => {
  await page.goto('/')
  
  // Measure performance metrics
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const vitals = {
          FCP: 0,
          LCP: 0,
          CLS: 0
        }
        
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            vitals.FCP = entry.startTime
          }
          if (entry.entryType === 'largest-contentful-paint') {
            vitals.LCP = entry.startTime
          }
          if (entry.entryType === 'layout-shift') {
            vitals.CLS += entry.value
          }
        })
        
        resolve(vitals)
      }).observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] })
    })
  })

  expect(metrics.FCP).toBeLessThan(1800)  // 1.8s
  expect(metrics.LCP).toBeLessThan(2500)  // 2.5s  
  expect(metrics.CLS).toBeLessThan(0.1)   // 0.1 score
})
```

## Accessibility Testing Best Practices

### Automated Accessibility Testing

```typescript
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright'

test.describe('Accessibility Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await injectAxe(page)
  })

  test('meets WCAG 2.1 AA standards', async ({ page }) => {
    await configureAxe(page, {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'aria-labels': { enabled: true }
      }
    })

    await checkA11y(page)
  })

  test('supports keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()
    
    // Test navigation through all interactive elements
    const interactiveElements = await page.locator('button, a, input, textarea').count()
    
    for (let i = 0; i < interactiveElements; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    }
  })
})
```

### Manual Accessibility Testing Guidelines

```typescript
describe('Screen Reader Compatibility', () => {
  test('has proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    
    // Should start with h1
    expect(await headings[0].getAttribute('tagName')).toBe('H1')
    
    // Check for proper hierarchy (no skipped levels)
    for (let i = 1; i < headings.length; i++) {
      const currentLevel = parseInt(await headings[i].getAttribute('tagName').slice(1))
      const previousLevel = parseInt(await headings[i-1].getAttribute('tagName').slice(1))
      
      expect(currentLevel - previousLevel).toBeLessThanOrEqual(1)
    }
  })

  test('has meaningful alt text for images', async ({ page }) => {
    await page.goto('/')
    
    const images = await page.locator('img').all()
    
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeDefined()
      expect(alt).not.toBe('')
      expect(alt.length).toBeGreaterThan(5) // Meaningful description
    }
  })
})
```

## Test Data Management

### Test Data Organization

```typescript
// src/test/data/testData.ts
export const testData = {
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+61 400 000 000',
    message: 'I am interested in learning blues guitar improvisation.'
  },
  
  content: {
    hero: {
      title: 'Test Hero Title',
      subtitle: 'Test Hero Subtitle',
      callToAction: 'Test CTA'
    },
    
    lessons: [
      {
        id: 'test-lesson-1',
        title: 'Blues Fundamentals',
        duration: '60 minutes',
        price: 80,
        description: 'Learn the basics of blues guitar'
      }
    ]
  },
  
  invalid: {
    email: 'invalid-email-format',
    phone: '123',
    emptyContent: {}
  }
}
```

### Mock Data Patterns

```typescript
// Realistic mock data that matches actual content structure
const mockLessonPackages = [
  {
    id: 'blues-fundamentals',
    title: 'Blues Guitar Fundamentals',
    duration: '60 minutes',
    price: 80,
    features: [
      'Basic chord progressions',
      'Scale patterns',
      'Rhythm techniques'
    ],
    skillLevel: 'beginner'
  }
]

// Factory functions for generating test data
const createTestUser = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  message: 'Test inquiry message',
  ...overrides
})

// Use in tests
test('validates user input correctly', () => {
  const validUser = createTestUser()
  const invalidUser = createTestUser({ email: 'invalid-email' })
  
  expect(validateUser(validUser)).toBe(true)
  expect(validateUser(invalidUser)).toBe(false)
})
```

## Mocking Best Practices

### External API Mocking

```typescript
import { vi } from 'vitest'

// Mock external dependencies
vi.mock('../api/contentService', () => ({
  fetchContent: vi.fn(() => Promise.resolve(mockContentData)),
  submitContactForm: vi.fn(() => Promise.resolve({ success: true }))
}))

// Mock with realistic delays
vi.mock('../api/contentService', () => ({
  fetchContent: vi.fn(async () => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockContentData
  })
}))
```

### Browser API Mocking

```typescript
describe('Component with Browser APIs', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    // Mock intersection observer
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))

    // Mock local storage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
  })
})
```

## Error Testing Patterns

### Testing Error Boundaries

```typescript
import { ErrorBoundary } from 'react-error-boundary'

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

test('handles component errors gracefully', () => {
  const ErrorFallback = ({ error }: { error: Error }) => (
    <div role="alert">Something went wrong: {error.message}</div>
  )

  render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  )

  expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong: Test error')
})
```

### Testing Network Errors

```typescript
test('handles network failures gracefully', async () => {
  // Mock fetch to simulate network error
  vi.spyOn(global, 'fetch').mockRejectedValueOnce(
    new Error('Network request failed')
  )

  render(<ContentComponent />)

  await waitFor(() => {
    expect(screen.getByText(/unable to load content/i)).toBeInTheDocument()
  })

  expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
})
```

## Test Maintenance Guidelines

### Keeping Tests Updated

**When updating components:**
1. Update component tests first
2. Ensure integration tests still pass
3. Update E2E tests if user workflows changed
4. Verify performance impacts

**When updating content:**
1. Update content validation tests
2. Check component integration tests
3. Verify E2E tests with new content
4. Update test data if needed

### Test Refactoring

```typescript
// ❌ Duplicate setup in every test
test('test 1', () => {
  const component = render(<Component prop1="value1" prop2="value2" />)
  // test logic
})

test('test 2', () => {
  const component = render(<Component prop1="value1" prop2="value2" />)
  // test logic  
})

// ✅ Extracted setup function
const renderComponent = (overrides = {}) => {
  const defaultProps = { prop1: 'value1', prop2: 'value2' }
  return render(<Component {...defaultProps} {...overrides} />)
}

test('test 1', () => {
  renderComponent()
  // test logic
})

test('test 2', () => {
  renderComponent({ prop1: 'different value' })
  // test logic
})
```

## CI/CD Integration Standards

### Test Categorization for CI

```json
{
  "scripts": {
    "test:unit": "vitest run src/**/*.test.{ts,tsx}",
    "test:integration": "vitest run src/components/**/__tests__/",
    "test:content": "vitest run src/content/__tests__/",
    "test:e2e:smoke": "playwright test tests/e2e/smoke.spec.ts",
    "test:e2e:critical": "playwright test tests/e2e/{homepage,navigation}.spec.ts",
    "test:performance:critical": "vitest run tests/performance/{web-vitals,bundle-analysis}.test.ts"
  }
}
```

### Performance Budgets in CI

```typescript
// tests/performance/budgets.test.ts
describe('Performance Budgets', () => {
  test('bundle size stays within budget', async () => {
    const bundleSize = await getBundleSize()
    
    expect(bundleSize.total).toBeLessThan(500 * 1024) // 500KB
    expect(bundleSize.js).toBeLessThan(300 * 1024)    // 300KB
    expect(bundleSize.css).toBeLessThan(50 * 1024)    // 50KB
  })

  test('performance metrics meet thresholds', async () => {
    const metrics = await getPerformanceMetrics()
    
    expect(metrics.fcp).toBeLessThan(1800)  // First Contentful Paint
    expect(metrics.lcp).toBeLessThan(2500)  // Largest Contentful Paint
    expect(metrics.cls).toBeLessThan(0.1)   // Cumulative Layout Shift
  })
})
```

## Code Coverage Standards

### Coverage Goals
- **Unit Tests**: >90% line coverage
- **Integration Tests**: >80% component coverage
- **E2E Tests**: 100% critical user workflow coverage
- **Overall**: >85% combined coverage

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      thresholds: {
        lines: 85,
        functions: 80,
        branches: 75,
        statements: 85
      },
      exclude: [
        'src/test/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'src/types/**'
      ]
    }
  }
})
```

### Meaningful Coverage

```typescript
// ❌ Testing implementation details for coverage
test('calls useState hook', () => {
  const spy = vi.spyOn(React, 'useState')
  render(<Component />)
  expect(spy).toHaveBeenCalled()
})

// ✅ Testing meaningful behavior
test('updates display when user interacts', async () => {
  const user = userEvent.setup()
  render(<Component />)
  
  await user.click(screen.getByRole('button'))
  
  expect(screen.getByText('Updated content')).toBeInTheDocument()
})
```

## Common Anti-Patterns to Avoid

### Testing Anti-Patterns

```typescript
// ❌ Testing implementation details
test('component uses specific state variable', () => {
  const component = render(<Component />)
  expect(component.state.isVisible).toBe(true)
})

// ✅ Testing behavior
test('component displays content when visible', () => {
  render(<Component />)
  expect(screen.getByText('Expected content')).toBeInTheDocument()
})

// ❌ Testing library internals  
test('uses React Testing Library correctly', () => {
  const { container } = render(<Component />)
  expect(container.querySelector('.class-name')).toBeInTheDocument()
})

// ✅ Testing user-visible behavior
test('displays expected content', () => {
  render(<Component />)
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
})
```

### E2E Anti-Patterns

```typescript
// ❌ Testing too many things in one test
test('complete user journey', async ({ page }) => {
  // 50+ lines testing everything
})

// ✅ Focused, single-purpose tests
test('user can navigate to contact section', async ({ page }) => {
  await page.goto('/')
  await page.click('nav a[href="#contact"]')
  await expect(page.locator('#contact')).toBeInViewport()
})

// ❌ Hard-coded selectors throughout tests
await page.click('#hero > div > button.btn-primary')

// ✅ Data-testid or semantic selectors
await page.click('[data-testid="hero-cta"]')
await page.click('button:has-text("Get Started")')
```

---

## Quality Checklist

### Before Committing Tests

- [ ] Tests have descriptive names
- [ ] Tests focus on behavior, not implementation
- [ ] Proper setup and teardown
- [ ] No hard-coded values or magic numbers
- [ ] Appropriate use of mocks and stubs
- [ ] Tests are isolated and independent
- [ ] Good error messages for test failures

### Code Review Checklist

- [ ] Test quality matches code quality standards
- [ ] Tests provide good documentation
- [ ] Coverage is meaningful, not just numerical
- [ ] No flaky or unreliable tests
- [ ] Performance impact is reasonable
- [ ] Accessibility considerations included

---

Following these best practices ensures that the RrishMusic project maintains high-quality, reliable tests that serve as both validation and documentation while supporting confident development and deployment.

**Happy Testing!** 🧪✨