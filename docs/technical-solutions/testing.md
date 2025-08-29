# Testing Strategy & Implementation Guide

This guide covers comprehensive testing approaches for the RrishMusic project, including component testing, integration testing, and the testing workflow integrated with the 11-step development process.

## Testing Architecture Overview

The RrishMusic project requires a robust testing strategy to support:
- Multi-service platform functionality (Performance, Teaching, Collaboration)
- Form validation and service routing
- Theme system and responsive design
- Performance monitoring and optimization
- Accessibility compliance

## Testing Stack Recommendations

### Core Testing Dependencies

```json
// package.json devDependencies additions
{
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.1.0",
  "@testing-library/user-event": "^14.4.3",
  "vitest": "^1.0.0",
  "@vitest/ui": "^1.0.0",
  "jsdom": "^23.0.0",
  "msw": "^2.0.0"
}
```

### Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { server } from './mocks/server'

// Start MSW server
beforeAll(() => server.listen())

// Clean up after each test
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

// Clean up after all tests
afterAll(() => server.close())

// Mock window.matchMedia for theme testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
```

## Component Testing Patterns

### Basic Component Testing Template

```typescript
// src/components/__tests__/Navigation.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Navigation from '../layout/Navigation'

// Test wrapper with required providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe('Navigation', () => {
  test('renders all navigation items', () => {
    renderWithProviders(<Navigation />)
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /performance/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /teaching/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /collaboration/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })

  test('applies active state to current page', () => {
    // Mock useLocation to simulate being on performance page
    vi.mock('react-router-dom', async () => ({
      ...await vi.importActual('react-router-dom'),
      useLocation: () => ({ pathname: '/performance' })
    }))

    renderWithProviders(<Navigation />)
    
    const performanceLink = screen.getByRole('link', { name: /performance/i })
    expect(performanceLink).toHaveClass('nav-link-active')
  })

  test('mobile menu toggles correctly', async () => {
    renderWithProviders(<Navigation />)
    
    const menuButton = screen.getByRole('button', { name: /toggle.*menu/i })
    const mobileMenu = screen.getByRole('navigation', { name: /mobile menu/i })
    
    // Menu should be hidden initially
    expect(mobileMenu).toHaveAttribute('aria-hidden', 'true')
    
    // Click to open
    await fireEvent.click(menuButton)
    expect(mobileMenu).toHaveAttribute('aria-hidden', 'false')
    
    // Click to close
    await fireEvent.click(menuButton)
    expect(mobileMenu).toHaveAttribute('aria-hidden', 'true')
  })

  test('handles navigation errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock navigate to throw error
    const mockNavigate = vi.fn().mockImplementation(() => {
      throw new Error('Navigation error')
    })
    
    vi.mock('react-router-dom', async () => ({
      ...await vi.importActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }))

    renderWithProviders(<Navigation />)
    
    const performanceLink = screen.getByRole('link', { name: /performance/i })
    await fireEvent.click(performanceLink)
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Navigation] Error navigating to:'),
      expect.any(Object),
      expect.any(Error)
    )
    
    consoleSpy.mockRestore()
  })
})
```

### Form Component Testing

```typescript
// src/components/__tests__/ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../forms/ContactForm'
import { ServiceType } from '@/types/content'

describe('ContactForm', () => {
  const defaultProps = {
    serviceType: 'teaching' as ServiceType,
    onSubmit: vi.fn(),
    isSubmitting: false
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders all required fields for teaching service', () => {
    render(<ContactForm {...defaultProps} />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/experience level/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  test('shows service-specific fields for performance service', () => {
    render(<ContactForm {...defaultProps} serviceType="performance" />)
    
    expect(screen.getByLabelText(/event type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/event date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/venue/i)).toBeInTheDocument()
  })

  test('validates required fields before submission', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.fn()
    
    render(<ContactForm {...defaultProps} onSubmit={mockSubmit} />)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
    
    // Should show validation errors
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    
    // Should not call onSubmit
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  test('validates email format', async () => {
    const user = userEvent.setup()
    
    render(<ContactForm {...defaultProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    await user.tab() // Trigger blur event
    
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
  })

  test('submits form with valid data', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.fn()
    
    render(<ContactForm {...defaultProps} onSubmit={mockSubmit} />)
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.selectOptions(screen.getByLabelText(/experience level/i), 'beginner')
    await user.type(screen.getByLabelText(/message/i), 'I want to learn guitar')
    
    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        experienceLevel: 'beginner',
        message: 'I want to learn guitar',
        serviceType: 'teaching'
      })
    })
  })

  test('disables submit button during submission', () => {
    render(<ContactForm {...defaultProps} isSubmitting={true} />)
    
    const submitButton = screen.getByRole('button', { name: /submitting/i })
    expect(submitButton).toBeDisabled()
  })

  test('shows loading state during submission', () => {
    render(<ContactForm {...defaultProps} isSubmitting={true} />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByText(/submitting/i)).toBeInTheDocument()
  })
})
```

### Theme System Testing

```typescript
// src/contexts/__tests__/ThemeContext.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext'

// Test component that uses theme
const ThemeConsumer = () => {
  const { theme, toggleTheme, systemTheme } = useTheme()
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="system-theme">{systemTheme}</div>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset matchMedia mock
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  test('defaults to system theme when no preference stored', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
  })

  test('loads saved theme from localStorage', () => {
    localStorage.setItem('rrishmusic-theme', 'dark')
    
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  test('toggles between light, dark, and system themes', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )
    
    const toggleButton = screen.getByTestId('toggle-theme')
    const currentTheme = screen.getByTestId('current-theme')
    
    // Initially system
    expect(currentTheme).toHaveTextContent('system')
    
    // Toggle to light
    fireEvent.click(toggleButton)
    expect(currentTheme).toHaveTextContent('light')
    
    // Toggle to dark
    fireEvent.click(toggleButton)
    expect(currentTheme).toHaveTextContent('dark')
    
    // Toggle back to system
    fireEvent.click(toggleButton)
    expect(currentTheme).toHaveTextContent('system')
  })

  test('persists theme choice to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )
    
    const toggleButton = screen.getByTestId('toggle-theme')
    
    fireEvent.click(toggleButton) // to light
    expect(localStorage.getItem('rrishmusic-theme')).toBe('light')
    
    fireEvent.click(toggleButton) // to dark
    expect(localStorage.getItem('rrishmusic-theme')).toBe('dark')
  })

  test('applies theme to document element', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )
    
    const toggleButton = screen.getByTestId('toggle-theme')
    
    fireEvent.click(toggleButton) // to light
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    
    fireEvent.click(toggleButton) // to dark
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
```

## Integration Testing

### Service Routing Testing

```typescript
// src/utils/__tests__/contactRouting.test.tsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { getServiceContext, routeToService } from '../contactRouting'
import App from '@/App'

describe('Service Routing Integration', () => {
  test('detects correct service context from URL', () => {
    expect(getServiceContext('/performance')).toBe('performance')
    expect(getServiceContext('/collaboration')).toBe('collaboration')
    expect(getServiceContext('/teaching')).toBe('teaching')
    expect(getServiceContext('/')).toBe('teaching') // default
  })

  test('routes to correct contact form based on service', () => {
    const mockNavigate = vi.fn()
    
    vi.mock('react-router-dom', async () => ({
      ...await vi.importActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }))

    routeToService('performance', { eventType: 'concert' })
    
    expect(mockNavigate).toHaveBeenCalledWith('/contact', {
      state: {
        serviceType: 'performance',
        initialData: { eventType: 'concert' }
      }
    })
  })

  test('full user journey: performance page to contact form', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    // Start on performance page
    window.history.pushState({}, 'Performance', '/performance')
    
    // Should show performance content
    expect(screen.getByText(/performance services/i)).toBeInTheDocument()
    
    // Click contact CTA
    const contactButton = screen.getByRole('button', { name: /get in touch/i })
    fireEvent.click(contactButton)
    
    // Should navigate to contact with performance context
    expect(window.location.pathname).toBe('/contact')
    expect(screen.getByText(/performance inquiry/i)).toBeInTheDocument()
  })
})
```

### Form Validation Integration

```typescript
// src/utils/__tests__/formValidation.integration.test.ts
import { validateForm, getServiceValidationRules } from '../formValidation'
import { ServiceType } from '@/types/content'

describe('Form Validation Integration', () => {
  test('validates performance form with service-specific rules', () => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      eventType: '', // Required for performance
      eventDate: '2024-12-01',
      venue: 'Concert Hall',
      message: 'Looking for a performer'
    }

    const result = validateForm(formData, 'performance')
    
    expect(result.isValid).toBe(false)
    expect(result.errors.eventType).toContain('Event type is required')
  })

  test('validates teaching form with different requirements', () => {
    const formData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      experienceLevel: '', // Required for teaching
      instrument: 'guitar',
      message: 'Want to learn'
    }

    const result = validateForm(formData, 'teaching')
    
    expect(result.isValid).toBe(false)
    expect(result.errors.experienceLevel).toContain('Experience level is required')
  })

  test('passes validation with complete data', () => {
    const formData = {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      eventType: 'concert',
      eventDate: '2024-12-01',
      venue: 'Music Hall',
      message: 'Need a guitarist for concert'
    }

    const result = validateForm(formData, 'performance')
    
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })
})
```

## Mock Service Integration

### MSW Setup for API Testing

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Contact form submission
  http.post('/api/contact', async ({ request }) => {
    const body = await request.json()
    
    // Simulate validation
    if (!body.name || !body.email) {
      return HttpResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json(
      { message: 'Form submitted successfully', id: '123' },
      { status: 200 }
    )
  }),

  // Performance data
  http.get('/api/performance/portfolio', () => {
    return HttpResponse.json({
      performances: [
        {
          id: '1',
          title: 'Concert Hall Performance',
          date: '2024-01-15',
          venue: 'Royal Concert Hall'
        }
      ]
    })
  }),

  // Instagram integration
  http.get('https://api.instagram.com/v1/users/self/media/recent', () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          images: {
            standard_resolution: { url: 'https://example.com/image1.jpg' }
          },
          caption: { text: 'Performance at venue' }
        }
      ]
    })
  })
]
```

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

## Accessibility Testing

### Screen Reader and Keyboard Navigation Tests

```typescript
// src/components/__tests__/AccessibilityTests.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navigation from '../layout/Navigation'

describe('Accessibility', () => {
  test('navigation is keyboard accessible', async () => {
    const user = userEvent.setup()
    render(<Navigation />)
    
    const firstLink = screen.getByRole('link', { name: /home/i })
    
    // Tab through navigation
    firstLink.focus()
    expect(firstLink).toHaveFocus()
    
    await user.keyboard('{Tab}')
    expect(screen.getByRole('link', { name: /performance/i })).toHaveFocus()
    
    await user.keyboard('{Tab}')
    expect(screen.getByRole('link', { name: /teaching/i })).toHaveFocus()
  })

  test('form has proper ARIA labels and descriptions', () => {
    render(<ContactForm serviceType="teaching" />)
    
    const nameInput = screen.getByLabelText(/name/i)
    expect(nameInput).toHaveAttribute('aria-required', 'true')
    
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('aria-describedby')
    
    // Check for error associations
    const errorId = emailInput.getAttribute('aria-describedby')
    if (errorId) {
      expect(document.getElementById(errorId)).toBeInTheDocument()
    }
  })

  test('error messages are announced to screen readers', async () => {
    const user = userEvent.setup()
    render(<ContactForm serviceType="teaching" />)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
    
    const errorMessage = screen.getByText(/name is required/i)
    expect(errorMessage).toHaveAttribute('role', 'alert')
    expect(errorMessage).toHaveAttribute('aria-live', 'polite')
  })
})
```

## Testing in the 11-Step Workflow

### Integration with Development Process

The testing strategy integrates with the systematic 11-step workflow:

**Step 5: Run All Quality Gates**
```bash
# Test suite is part of mandatory quality gates
npm run test              # Run all tests
npm run test:coverage     # Generate coverage report
npm run test:watch        # Run tests in watch mode during development
```

### Test Failure Analysis Protocol (Step 4.1)

When tests fail after implementation, follow this analysis:

```typescript
// Example test failure analysis
describe('Navigation Component - Implementation Change Analysis', () => {
  test('navigation order includes performance service (Category A - Intentional)', () => {
    render(<Navigation />)
    
    // OLD EXPECTATION: Home → About → Contact
    // NEW EXPECTATION: Performance → Home → About → Contact
    const navItems = screen.getAllByRole('link')
    expect(navItems[0]).toHaveTextContent('Performance')
    expect(navItems[1]).toHaveTextContent('Home')
    expect(navItems[2]).toHaveTextContent('About')
    expect(navItems[3]).toHaveTextContent('Contact')
  })

  test('accessibility attributes preserved (Category B - Regression)', () => {
    render(<Navigation />)
    
    // This should NOT break - if it fails, fix implementation
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label')
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    expect(menuButton).toHaveAttribute('aria-expanded')
    expect(menuButton).toHaveAttribute('aria-controls')
  })
})
```

### Automated Testing Commands

```json
// package.json scripts
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage",
  "test:integration": "vitest run tests/integration",
  "test:e2e": "cypress run",
  "test:accessibility": "axe-cli http://localhost:5173"
}
```

## Performance Testing

### Component Performance Tests

```typescript
// src/components/__tests__/PerformanceTests.test.tsx
import { render, act } from '@testing-library/react'
import { performance } from 'perf_hooks'
import LazyLoadedComponent from '../LazyLoadedComponent'

describe('Performance Tests', () => {
  test('component renders within performance budget', async () => {
    const startTime = performance.now()
    
    render(<LazyLoadedComponent />)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // Should render within 16ms (60fps budget)
    expect(renderTime).toBeLessThan(16)
  })

  test('lazy loaded components load efficiently', async () => {
    const { findByTestId } = render(<LazyLoadedComponent />)
    
    // Component should load within 2 seconds
    const component = await findByTestId('lazy-content', { timeout: 2000 })
    expect(component).toBeInTheDocument()
  })
})
```

## Testing Best Practices

### Do's and Don'ts

**✅ Do:**
- Test behavior, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Test error states and edge cases
- Include accessibility in all component tests
- Mock external dependencies consistently
- Test user journeys, not just isolated components

**❌ Don't:**
- Test internal component state directly
- Use implementation-specific selectors (CSS classes)
- Write tests that depend on specific timing
- Mock too much (makes tests less valuable)
- Ignore console warnings/errors in tests
- Skip testing error boundaries and fallbacks

### Coverage Goals

- **Components**: 90%+ coverage for critical user flows
- **Utilities**: 95%+ coverage for validation and routing logic
- **Integration**: 80%+ coverage for service interactions
- **E2E**: Cover all primary user journeys

Remember: Tests are documentation for your code. They should clearly communicate what the code does and protect against regressions during the multi-service platform transformation.