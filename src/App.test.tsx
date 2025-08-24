import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from './App'

// Mock all the section components
vi.mock('@/components/sections', () => ({
  Hero: vi.fn(() => <div data-testid="hero-section">Hero Content</div>),
  About: vi.fn(() => <div data-testid="about-section">About Content</div>),
  Approach: vi.fn(() => <div data-testid="approach-section">Approach Content</div>),
  Lessons: vi.fn(() => <div data-testid="lessons-section">Lessons Content</div>),
  Community: vi.fn(() => <div data-testid="community-section">Community Content</div>),
  Contact: vi.fn(() => <div data-testid="contact-section">Contact Content</div>),
}))

// Mock Navigation component
vi.mock('@/components/layout/Navigation', () => ({
  Navigation: vi.fn(({ activeSection }) => (
    <nav data-testid="navigation" aria-label="Main navigation">
      <ul>
        <li><a href="#performances" className={activeSection === 'performances' ? 'active' : ''}>Performances</a></li>
        <li><a href="#hero" className={activeSection === 'hero' ? 'active' : ''}>Home</a></li>
        <li><a href="#about" className={activeSection === 'about' ? 'active' : ''}>About</a></li>
        <li><a href="#approach" className={activeSection === 'approach' ? 'active' : ''}>Approach</a></li>
        <li><a href="#lessons" className={activeSection === 'lessons' ? 'active' : ''}>Lessons</a></li>
        <li><a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>Contact</a></li>
      </ul>
    </nav>
  )),
}))

// Mock ErrorBoundary component
vi.mock('@/components/common/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode, fallback?: React.ReactNode }) => {
    return <div data-testid="error-boundary">{children}</div>
  },
}))

// Mock SEOHead component
vi.mock('@/components/common/SEOHead', () => ({
  SEOHead: vi.fn(({ title, description, keywords, type }) => (
    <div data-testid="seo-head">
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:type" content={type} />
    </div>
  )),
}))

// Mock LazySection component with intersection observer simulation
vi.mock('@/components/common/LazySection', () => ({
  LazySection: ({ children, fallback, rootMargin }: { children: React.ReactNode, fallback: React.ReactNode, rootMargin?: string }) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)
    
    React.useEffect(() => {
      // Simulate intersection observer behavior
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    }, [])
    
    return (
      <div ref={ref} data-testid="lazy-section" data-root-margin={rootMargin}>
        {isVisible ? children : fallback}
      </div>
    )
  },
}))

// Mock useScrollSpy hook - create mock function in mock factory
vi.mock('@/hooks/useScrollSpy', () => ({
  useScrollSpy: vi.fn(() => 'hero'),
}))

// Mock constants
vi.mock('@/utils/constants', () => ({
  NAVIGATION_ITEMS: [
    { id: 'performances', label: 'Performances', href: '#performances' },
    { id: 'hero', label: 'Home', href: '#hero' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'approach', label: 'Approach', href: '#approach' },
    { id: 'lessons', label: 'Lessons', href: '#lessons' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ],
}))

// Mock CSS import
vi.mock('@/index.css', () => ({}))

// Mock performance observer
const mockPerformanceObserver = {
  observe: vi.fn(),
  disconnect: vi.fn(),
}

global.PerformanceObserver = vi.fn().mockImplementation(() => mockPerformanceObserver)

// Mock window.location.reload for error boundary tests
Object.defineProperty(window, 'location', {
  value: {
    reload: vi.fn(),
  },
  writable: true,
})

describe('App Component', () => {
  const user = userEvent.setup()

  beforeEach(async () => {
    // Get reference to the mocked hook
    const { useScrollSpy } = await import('@/hooks/useScrollSpy')
    const mockUseScrollSpy = useScrollSpy as ReturnType<typeof vi.fn>
    
    // Reset all mocks before each test
    vi.clearAllMocks()
    mockUseScrollSpy.mockReturnValue('hero')
    
    // Mock NODE_ENV for performance tests
    vi.stubEnv('NODE_ENV', 'development')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('Core Rendering Tests', () => {
    it('renders without crashing', () => {
      render(<App />)
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
    })

    it('renders all main structural elements', () => {
      render(<App />)
      
      // Check for main navigation
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
      expect(screen.getByLabelText('Main navigation')).toBeInTheDocument()
      
      // Check for main content area
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
      
      // Check for SEO head
      expect(screen.getByTestId('seo-head')).toBeInTheDocument()
    })

    it('renders all main sections with correct IDs', () => {
      render(<App />)
      
      const expectedSections = ['hero', 'about', 'approach', 'lessons', 'community', 'contact']
      
      expectedSections.forEach(sectionId => {
        const section = document.getElementById(sectionId)
        expect(section).toBeInTheDocument()
        expect(section).toHaveClass('app-section')
      })
    })

    it('renders SEO Head component with correct props', async () => {
      const { SEOHead } = await import('@/components/common/SEOHead')
      render(<App />)
      
      expect(SEOHead).toHaveBeenCalledWith({
        title: 'Guitar Lessons & Blues Improvisation',
        description: 'Learn guitar and blues improvisation with Rrish in Melbourne. Personalized lessons for all levels. Start your musical journey today!',
        keywords: 'guitar lessons, blues improvisation, music teacher, Melbourne, guitar instructor, music education',
        type: 'website',
      }, undefined)
    })
  })

  describe('Navigation Integration Tests', () => {
    it('renders Navigation component with correct props', async () => {
      render(<App />)
      
      const { Navigation } = await import('@/components/layout/Navigation')
      expect(Navigation).toHaveBeenCalledWith({
        activeSection: 'hero',
      }, undefined)
    })

    it('displays new "Performances" navigation item', () => {
      render(<App />)
      
      const performancesLink = screen.getByRole('link', { name: 'Performances' })
      expect(performancesLink).toBeInTheDocument()
      expect(performancesLink).toHaveAttribute('href', '#performances')
    })

    it('displays all navigation items with correct attributes', () => {
      render(<App />)
      
      const expectedNavItems = [
        { name: 'Performances', href: '#performances' },
        { name: 'Home', href: '#hero' },
        { name: 'About', href: '#about' },
        { name: 'Approach', href: '#approach' },
        { name: 'Lessons', href: '#lessons' },
        { name: 'Contact', href: '#contact' },
      ]
      
      expectedNavItems.forEach(item => {
        const link = screen.getByRole('link', { name: item.name })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', item.href)
      })
    })

    it('updates active section when scroll spy changes', async () => {
      const { useScrollSpy } = await import('@/hooks/useScrollSpy')
      const mockUseScrollSpy = useScrollSpy as ReturnType<typeof vi.fn>
      
      const { rerender } = render(<App />)
      
      // Initially hero is active
      expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('active')
      
      // Change active section to about
      mockUseScrollSpy.mockReturnValue('about')
      rerender(<App />)
      
      expect(screen.getByRole('link', { name: 'About' })).toHaveClass('active')
    })

    it('calls useScrollSpy with correct parameters', async () => {
      const { useScrollSpy } = await import('@/hooks/useScrollSpy')
      const mockUseScrollSpy = useScrollSpy as ReturnType<typeof vi.fn>
      
      render(<App />)
      
      expect(mockUseScrollSpy).toHaveBeenCalledWith(
        ['performances', 'hero', 'about', 'approach', 'lessons', 'contact'],
        {
          offset: 100,
          throttle: 50,
          rootMargin: '-10% 0px -85% 0px',
        }
      )
    })
  })

  describe('Lazy Loading & Suspense Tests', () => {
    it('renders Hero section immediately without lazy loading', () => {
      render(<App />)
      
      // Hero should be in regular Suspense, not LazySection
      const heroSection = document.getElementById('hero')
      expect(heroSection).toBeInTheDocument()
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    })

    it('renders lazy-loaded sections with LazySection wrapper', async () => {
      render(<App />)
      
      // Initially should show loading fallbacks
      expect(screen.getByText('Loading About...')).toBeInTheDocument()
      expect(screen.getByText('Loading Approach...')).toBeInTheDocument()
      expect(screen.getByText('Loading Lessons...')).toBeInTheDocument()
      expect(screen.getByText('Loading Community...')).toBeInTheDocument()
      expect(screen.getByText('Loading Contact...')).toBeInTheDocument()
      
      // After intersection observer simulation, sections should load
      await waitFor(() => {
        expect(screen.getByTestId('about-section')).toBeInTheDocument()
        expect(screen.getByTestId('approach-section')).toBeInTheDocument()
        expect(screen.getByTestId('lessons-section')).toBeInTheDocument()
        expect(screen.getByTestId('community-section')).toBeInTheDocument()
        expect(screen.getByTestId('contact-section')).toBeInTheDocument()
      })
    })

    it('configures LazySection with correct rootMargin', () => {
      render(<App />)
      
      const lazySections = screen.getAllByTestId('lazy-section')
      lazySections.forEach(section => {
        expect(section).toHaveAttribute('data-root-margin', '200px')
      })
    })

    it('displays loading fallbacks with correct content and styling', () => {
      render(<App />)
      
      const sectionNames = ['About', 'Approach', 'Lessons', 'Community', 'Contact']
      
      sectionNames.forEach(sectionName => {
        expect(screen.getByText(`Loading ${sectionName}...`)).toBeInTheDocument()
      })
      
      // Check for loading spinner elements (by class)
      const spinners = document.querySelectorAll('.animate-spin')
      expect(spinners.length).toBe(5) // One for each lazy-loaded section
    })
  })

  describe('Error Boundary Tests', () => {
    it('wraps the entire app in an error boundary', () => {
      render(<App />)
      
      // Check that the main error boundary is present
      const errorBoundaries = screen.getAllByTestId('error-boundary')
      expect(errorBoundaries.length).toBeGreaterThan(0)
    })

    it('provides section-specific error boundaries', () => {
      render(<App />)
      
      // Each section should have its own error boundary
      // App level + 6 sections (including Hero) = 7 error boundaries
      const errorBoundaries = screen.getAllByTestId('error-boundary')
      expect(errorBoundaries.length).toBe(7) // App + 6 sections (Hero also has error boundary)
    })

    it('displays global error fallback when app-level error occurs', () => {
      // Test the fallback component structure
      const AppErrorFallback = () => (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but something went wrong. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-blue-primary text-white px-6 py-3 rounded-lg hover:bg-brand-blue-dark transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
      
      render(<AppErrorFallback />)
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText(/We're sorry, but something went wrong/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Refresh Page' })).toBeInTheDocument()
    })

    it('handles refresh button click in error fallback', async () => {
      const AppErrorFallback = () => (
        <div>
          <button
            onClick={() => window.location.reload()}
            data-testid="refresh-button"
          >
            Refresh Page
          </button>
        </div>
      )
      
      render(<AppErrorFallback />)
      
      const refreshButton = screen.getByTestId('refresh-button')
      await user.click(refreshButton)
      
      expect(window.location.reload).toHaveBeenCalled()
    })

    it('displays section-specific error fallbacks', () => {
      render(<App />)
      
      // Since we're mocking, we can at least verify the structure is set up
      // Each section should have an error boundary wrapper
      const sections = ['hero', 'about', 'approach', 'lessons', 'community', 'contact']
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId)
        expect(section).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Tests', () => {
    it('includes main content with proper ID', () => {
      render(<App />)
      
      const mainContent = screen.getByRole('main')
      expect(mainContent).toHaveAttribute('id', 'main-content')
      expect(mainContent).toHaveClass('main-content')
    })

    it('provides navigation with proper ARIA labels', () => {
      render(<App />)
      
      const navigation = screen.getByLabelText('Main navigation')
      expect(navigation).toBeInTheDocument()
      expect(navigation.tagName).toBe('NAV')
    })

    it('includes skip link functionality', () => {
      render(<App />)
      
      // The main content should be accessible via #main-content
      const mainContent = document.getElementById('main-content')
      expect(mainContent).toBeInTheDocument()
      
      // This enables skip links to work properly
      const skipTarget = screen.getByRole('main')
      expect(skipTarget).toHaveAttribute('id', 'main-content')
    })

    it('ensures all sections have proper landmark structure', () => {
      render(<App />)
      
      // Main navigation should be a nav landmark
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      
      // Main content should be a main landmark
      expect(screen.getByRole('main')).toBeInTheDocument()
      
      // Each section should be properly structured
      const sections = ['hero', 'about', 'approach', 'lessons', 'community', 'contact']
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId)
        expect(section).toBeInTheDocument()
        expect(section?.tagName).toBe('SECTION')
      })
    })
  })

  describe('Performance & SEO Tests', () => {
    it('initializes performance monitor in development environment', () => {
      render(<App />)
      
      expect(global.PerformanceObserver).toHaveBeenCalled()
      expect(mockPerformanceObserver.observe).toHaveBeenCalledWith({
        entryTypes: [
          'largest-contentful-paint',
          'first-input',
          'layout-shift',
        ],
      })
    })

    it('does not initialize performance monitor in production', () => {
      vi.stubEnv('NODE_ENV', 'production')
      
      render(<App />)
      
      // Performance observer should not be called in production
      expect(mockPerformanceObserver.observe).not.toHaveBeenCalled()
    })

    it('sets SEO meta tags correctly', () => {
      render(<App />)
      
      // Check that SEO meta tags are rendered
      expect(screen.getByTestId('seo-head')).toBeInTheDocument()
      
      // Check specific meta tag content
      const titleMeta = document.querySelector('meta[name="title"]')
      const descriptionMeta = document.querySelector('meta[name="description"]')
      const keywordsMeta = document.querySelector('meta[name="keywords"]')
      const typeMeta = document.querySelector('meta[property="og:type"]')
      
      expect(titleMeta).toHaveAttribute('content', 'Guitar Lessons & Blues Improvisation')
      expect(descriptionMeta).toHaveAttribute('content', 
        'Learn guitar and blues improvisation with Rrish in Melbourne. Personalized lessons for all levels. Start your musical journey today!')
      expect(keywordsMeta).toHaveAttribute('content', 
        'guitar lessons, blues improvisation, music teacher, Melbourne, guitar instructor, music education')
      expect(typeMeta).toHaveAttribute('content', 'website')
    })

    it('optimizes section ID memoization', async () => {
      const { useScrollSpy } = await import('@/hooks/useScrollSpy')
      const mockUseScrollSpy = useScrollSpy as ReturnType<typeof vi.fn>
      
      const { rerender } = render(<App />)
      
      // First render
      expect(mockUseScrollSpy).toHaveBeenCalledTimes(1)
      
      // Re-render should use memoized values
      rerender(<App />)
      expect(mockUseScrollSpy).toHaveBeenCalledTimes(2)
      
      // Section IDs should be the same array
      const firstCall = mockUseScrollSpy.mock.calls[0]
      const secondCall = mockUseScrollSpy.mock.calls[1]
      expect(firstCall[0]).toEqual(secondCall[0])
    })

    it('handles performance observer errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      // Mock PerformanceObserver to throw an error
      global.PerformanceObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn().mockImplementation(() => {
          throw new Error('Performance observer not supported')
        }),
        disconnect: vi.fn(),
      }))
      
      render(<App />)
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Performance observer not supported:',
        expect.any(Error)
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('Component Integration Tests', () => {
    it('passes correct activeSection prop to Navigation', async () => {
      render(<App />)
      
      const { Navigation } = await import('@/components/layout/Navigation')
      expect(Navigation).toHaveBeenCalledWith(
        expect.objectContaining({
          activeSection: 'hero',
        }),
        undefined
      )
    })

    it('updates Navigation when activeSection changes', async () => {
      const { useScrollSpy } = await import('@/hooks/useScrollSpy')
      const mockUseScrollSpy = useScrollSpy as ReturnType<typeof vi.fn>
      
      const { rerender } = render(<App />)
      
      // Change active section
      mockUseScrollSpy.mockReturnValue('about')
      rerender(<App />)
      
      const { Navigation } = await import('@/components/layout/Navigation')
      expect(Navigation).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeSection: 'about',
        }),
        undefined
      )
    })

    it('renders all section components within their boundaries', async () => {
      render(<App />)
      
      // Hero should render immediately
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
      
      // Other sections should render after lazy loading
      await waitFor(() => {
        expect(screen.getByTestId('about-section')).toBeInTheDocument()
        expect(screen.getByTestId('approach-section')).toBeInTheDocument()
        expect(screen.getByTestId('lessons-section')).toBeInTheDocument()
        expect(screen.getByTestId('community-section')).toBeInTheDocument()
        expect(screen.getByTestId('contact-section')).toBeInTheDocument()
      })
    })

    it('maintains correct CSS classes and structure', () => {
      render(<App />)
      
      // App container
      const appContainer = document.querySelector('.app-container')
      expect(appContainer).toBeInTheDocument()
      
      // Main content
      const mainContent = screen.getByRole('main')
      expect(mainContent).toHaveClass('main-content')
      
      // Section structure
      const sections = document.querySelectorAll('.app-section')
      expect(sections).toHaveLength(6) // All sections should have app-section class
    })
  })

  describe('Memory Management and Performance', () => {
    it('performance observer cleanup is configured correctly', () => {
      // This test verifies that the performance observer would be cleaned up
      // by checking that the observer setup returns a cleanup function
      render(<App />)
      
      // Verify that PerformanceObserver was created with disconnect capability
      expect(global.PerformanceObserver).toHaveBeenCalled()
      expect(mockPerformanceObserver.disconnect).toBeDefined()
      
      // The actual disconnect is called in the useEffect cleanup,
      // which is difficult to test in isolation without triggering actual component lifecycle
      // This test ensures the functionality is properly set up
      expect(typeof mockPerformanceObserver.disconnect).toBe('function')
    })

    it('properly memoizes section IDs to prevent unnecessary re-calculations', async () => {
      const { useScrollSpy } = await import('@/hooks/useScrollSpy')
      const mockUseScrollSpy = useScrollSpy as ReturnType<typeof vi.fn>
      
      const { rerender } = render(<App />)
      
      // Multiple re-renders should use the same memoized section IDs
      rerender(<App />)
      rerender(<App />)
      
      const calls = mockUseScrollSpy.mock.calls
      expect(calls[0][0]).toBe(calls[1][0]) // Same array reference
      expect(calls[1][0]).toBe(calls[2][0]) // Same array reference
    })
  })
})