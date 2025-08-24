import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

// Mock window.matchMedia for device detection
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
});

// Mock all components to prevent complex rendering issues
vi.mock('@/components/sections', () => ({
  Hero: () => <div data-testid="hero-section">Hero</div>,
  About: () => <div data-testid="about-section">About</div>,
  Approach: () => <div data-testid="approach-section">Approach</div>,
  Lessons: () => <div data-testid="lessons-section">Lessons</div>,
  Community: () => <div data-testid="community-section">Community</div>,
  Contact: () => <div data-testid="contact-section">Contact</div>,
  ServicesHierarchy: () => <div data-testid="services-hierarchy-section">Services Hierarchy</div>,
}))

// Mock the ContextAwareHeader component
vi.mock('@/components/ContextAwareHeader', () => ({
  ContextAwareHeader: () => <nav data-testid="navigation">Context Aware Navigation</nav>,
}))

// Mock the Teaching page component
vi.mock('@/components/pages/Teaching', () => ({
  Teaching: () => <div data-testid="teaching-page">Teaching Page</div>,
}))

// Mock the actual Home page component structure for testing
vi.mock('@/components/pages/Home', () => ({
  Home: () => (
    <main id="main-content" data-testid="home-page">
      <section id="hero" data-testid="hero-section">Hero</section>
      <section id="services-hierarchy" data-testid="services-hierarchy-section">Services Hierarchy</section>
      <section id="about" data-testid="about-section">About</section>
      <section id="approach" data-testid="approach-section">Approach</section>
      <section id="lessons" data-testid="lessons-section">Lessons</section>
      <section id="community" data-testid="community-section">Community</section>
      <section id="contact" data-testid="contact-section">Contact</section>
    </main>
  ),
}))

vi.mock('@/components/pages/Performance', () => ({
  Performance: () => <div data-testid="performance-page">Performance Page</div>,
}))

vi.mock('@/components/pages/Collaboration', () => ({
  Collaboration: () => <div data-testid="collaboration-page">Collaboration Page</div>,
}))

vi.mock('@/components/common/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/common/SEOHead', () => ({
  SEOHead: () => null,
}))

vi.mock('@/components/common/LazySection', () => ({
  LazySection: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/ui/CrossServiceSuggestion', () => ({
  CrossServiceSuggestion: () => <div data-testid="cross-service-suggestion">Cross Service Suggestion</div>,
}))

vi.mock('@/hooks/useScrollSpy', () => ({
  useScrollSpy: () => 'hero',
  useSmoothScroll: () => ({ smoothScrollTo: vi.fn() }),
}))

vi.mock('@/hooks/useDeviceDetection', () => ({
  useDeviceDetection: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasHover: true,
    hasTouch: false,
    screenSize: 'desktop',
    orientation: 'landscape'
  }),
}))

vi.mock('@/hooks/useServiceContext', () => ({
  useServiceContext: () => ({
    currentService: 'home',
    services: {
      home: {
        service: 'home',
        name: 'Rrish Music',
        primaryColor: 'var(--brand-blue-primary)',
        secondaryColor: 'var(--brand-yellow-accent)',
        navigationItems: [],
        primaryCTA: { text: 'Explore Services', href: '#services', type: 'anchor', variant: 'primary' },
        secondaryCTA: { text: 'Contact', href: '#contact', type: 'anchor', variant: 'outline' }
      }
    },
    isTransitioning: false,
    getCurrentNavigation: () => [],
    getCurrentPrimaryCTA: () => ({ text: 'Explore Services', href: '#services', type: 'anchor', variant: 'primary' }),
    getCurrentSecondaryCTA: () => ({ text: 'Contact', href: '#contact', type: 'anchor', variant: 'outline' }),
    setService: vi.fn(),
    getServiceData: vi.fn(),
    isServiceActive: vi.fn(),
  }),
}))

describe('App - Breakage Detection Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => render(<App />)).not.toThrow()
  })

  it('displays navigation', () => {
    render(<App />)
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('displays all main sections on home route', () => {
    render(<App />)
    
    // Updated to test that the home page renders with its sections
    // Using the updated 80/15/5 content allocation structure
    const sections = ['hero', 'services-hierarchy', 'about', 'approach', 'lessons', 'community', 'contact']
    sections.forEach(section => {
      expect(screen.getByTestId(`${section}-section`)).toBeInTheDocument()
    })
  })

  it('has proper section structure with IDs on home route', () => {
    render(<App />)
    
    // Test that all section IDs are properly set for the 80/15/5 allocation
    const sectionIds = ['hero', 'services-hierarchy', 'about', 'approach', 'lessons', 'community', 'contact']
    sectionIds.forEach(id => {
      expect(document.getElementById(id)).toBeInTheDocument()
    })
  })

  it('includes main content landmark', () => {
    render(<App />)
    expect(document.getElementById('main-content')).toBeInTheDocument()
  })
})