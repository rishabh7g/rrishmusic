import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

// Simple mocks - just prevent errors, don't overcomplicate
vi.mock('@/components/sections', () => ({
  Hero: () => <div data-testid="hero-section">Hero</div>,
  About: () => <div data-testid="about-section">About</div>,
  Approach: () => <div data-testid="approach-section">Approach</div>,
  Lessons: () => <div data-testid="lessons-section">Lessons</div>,
  Community: () => <div data-testid="community-section">Community</div>,
  Contact: () => <div data-testid="contact-section">Contact</div>,
}))

vi.mock('@/components/layout/Navigation', () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
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

  it('displays all main sections', () => {
    render(<App />)
    
    const sections = ['hero', 'about', 'approach', 'lessons', 'community', 'contact']
    sections.forEach(section => {
      expect(screen.getByTestId(`${section}-section`)).toBeInTheDocument()
    })
  })

  it('has proper section structure with IDs', () => {
    render(<App />)
    
    const sectionIds = ['hero', 'about', 'approach', 'lessons', 'community', 'contact']
    sectionIds.forEach(id => {
      expect(document.getElementById(id)).toBeInTheDocument()
    })
  })

  it('includes main content landmark', () => {
    render(<App />)
    expect(document.getElementById('main-content')).toBeInTheDocument()
  })
})