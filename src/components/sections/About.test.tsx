import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { whileHover, whileTap, whileInView, variants, custom, ...restProps } = props
      return <div {...restProps}>{children}</div>
    },
    p: ({ children, ...props }: any) => {
      const { whileHover, whileTap, whileInView, variants, custom, ...restProps } = props
      return <p {...restProps}>{children}</p>
    },
    section: ({ children, ...props }: any) => {
      const { whileHover, whileTap, whileInView, variants, custom, ...restProps } = props
      return <section {...restProps}>{children}</section>
    },
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
    const { container } = render(<About />)
    expect(container).toBeTruthy()
  })

  it('displays title', () => {
    render(<About />)
    expect(screen.getByText('About Rrish')).toBeTruthy()
  })

  it('displays content paragraphs', () => {
    render(<About />)
    expect(screen.getByText('Test content paragraph 1')).toBeTruthy()
    expect(screen.getByText('Test content paragraph 2')).toBeTruthy()
  })

  it('displays skills', () => {
    render(<About />)
    expect(screen.getByText('Blues Improvisation')).toBeTruthy()
    expect(screen.getByText('Guitar Technique')).toBeTruthy()
  })
})