import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    p: 'p',
  },
}))

// Mock the content hook
vi.mock('../../hooks/useContent', () => ({
  useSectionContent: () => ({
    data: {
      title: 'About Rrish',
      content: ['Test content paragraph 1', 'Test content paragraph 2'],
      skills: [
        { name: 'Blues Improvisation', level: 'expert', yearsExperience: 15, description: 'Test description' },
        { name: 'Guitar Technique', level: 'expert', yearsExperience: 10, description: 'Test description' }
      ]
    },
    loading: false,
    error: null
  })
}))

describe('About Component', () => {
  it('renders without crashing', () => {
    render(<About />)
    expect(screen.getByText('About Rrish')).toBeTruthy()
  })

  it('displays content paragraphs', () => {
    render(<About />)
    
    expect(screen.getByText('Test content paragraph 1')).toBeTruthy()
    expect(screen.getByText('Test content paragraph 2')).toBeTruthy()
  })

  it('displays skills correctly', () => {
    render(<About />)
    
    expect(screen.getByText('Blues Improvisation')).toBeTruthy()
    expect(screen.getByText('Guitar Technique')).toBeTruthy()
  })

  it('shows loading state', () => {
    vi.doMock('../../hooks/useContent', () => ({
      useSectionContent: () => ({
        data: null,
        loading: true,
        error: null
      })
    }))

    render(<About />)
    
    // Should show loading skeleton
    expect(document.querySelector('.animate-pulse')).toBeTruthy()
  })

  it('shows error state', () => {
    vi.doMock('../../hooks/useContent', () => ({
      useSectionContent: () => ({
        data: null,
        loading: false,
        error: 'Failed to load'
      })
    }))

    render(<About />)
    
    expect(screen.getByText('Content temporarily unavailable. Please try again later.')).toBeTruthy()
  })
})