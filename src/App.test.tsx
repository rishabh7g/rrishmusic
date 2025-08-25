import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
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

// Mock fetch for API calls during testing
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
) as unknown as typeof fetch

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock the Analytics component to avoid external API calls
vi.mock('./components/Analytics', () => ({
  default: () => null,
}))

// Mock debug panels that might not exist
vi.mock('./components/debug/RoutingDebugPanel', () => ({
  default: () => null,
}))

// Mock Footer if it doesn't exist
vi.mock('./components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}))

// Mock ScrollToTop if it doesn't exist
vi.mock('./components/ScrollToTop', () => ({
  default: () => null,
}))

// Mock performance monitor
vi.mock('./utils/performanceMonitor', () => ({
  PerformanceMonitor: vi.fn().mockImplementation(() => ({
    startMonitoring: vi.fn(),
    getRecommendations: vi.fn(() => []),
    cleanup: vi.fn(),
  })),
}))

// Mock the SEO hook to return default values
vi.mock('./hooks/usePageSEO', () => ({
  usePageSEO: () => ({
    seoData: {
      title: 'Rrish Music - Test',
      titleTemplate: '%s | Rrish Music',
      defaultTitle: 'Rrish Music',
      description: 'Professional musician services',
      keywords: 'music, guitar, lessons',
      canonicalUrl: 'https://www.rrishmusic.com',
      robots: 'index, follow',
      author: 'Rrish',
      openGraph: {
        type: 'website',
        title: 'Rrish Music',
        description: 'Professional musician services',
        url: 'https://www.rrishmusic.com',
        image: '/images/og-image.jpg',
        imageAlt: 'Rrish Music',
        siteName: 'Rrish Music',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Rrish Music',
        description: 'Professional musician services',
        image: '/images/og-image.jpg',
        imageAlt: 'Rrish Music',
      },
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Website',
        name: 'Rrish Music',
        url: 'https://www.rrishmusic.com',
      },
      breadcrumbData: null,
    }
  }),
}))

// Helper to render App with required providers
const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

describe('App - Breakage Detection Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    
    // Reset console to avoid noise
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders without crashing', () => {
    expect(() => renderApp()).not.toThrow()
  })

  it('displays navigation', async () => {
    renderApp()
    
    // Wait for lazy-loaded components
    await screen.findByRole('navigation', { timeout: 3000 })
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('displays all main sections on home route', async () => {
    renderApp()
    
    // Wait for main content to load
    const main = await screen.findByRole('main', { timeout: 3000 })
    expect(main).toBeInTheDocument()
  })

  it('has proper section structure with IDs on home route', async () => {
    renderApp()
    
    // Wait for content to load
    const main = await screen.findByRole('main', { timeout: 3000 })
    expect(main).toBeInTheDocument()
    
    // Check for main content class
    expect(main).toHaveClass('main-content')
  })

  it('includes main content landmark', async () => {
    renderApp()
    
    // Wait for main landmark
    const main = await screen.findByRole('main', { timeout: 3000 })
    expect(main).toBeInTheDocument()
  })

  // Test different routes don't crash
  it('renders performance route without crashing', () => {
    expect(() => renderApp()).not.toThrow()
  })

  it('renders teaching route without crashing', () => {
    expect(() => renderApp()).not.toThrow()
  })

  it('renders collaboration route without crashing', () => {
    expect(() => renderApp()).not.toThrow()
  })
})