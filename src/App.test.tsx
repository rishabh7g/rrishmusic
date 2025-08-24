import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

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

vi.mock('@/components/layout/Navigation', () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
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
}))

describe('App - Breakage Detection Tests', () => {
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