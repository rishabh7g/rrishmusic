import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

// Mock all the complex dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
    nav: 'nav',
    ul: 'ul',
    li: 'li', 
    a: 'a',
    button: 'button',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('./hooks/useScrollSpy', () => ({
  useScrollSpy: () => 'hero'
}))

vi.mock('./hooks/useContent', () => ({
  useSectionContent: () => ({
    data: {
      title: 'Test Title',
      content: ['Test content'],
      skills: [{ name: 'Guitar' }],
      methods: [{ type: 'email', value: 'test@example.com', href: 'mailto:test@example.com', primary: true, icon: 'mail' }]
    },
    loading: false,
    error: null
  }),
  useLessonPackages: () => ({
    packages: [{ id: 'test', name: 'Test Package', sessions: 1, features: ['Test'], popular: false }],
    packageInfo: {},
    loading: false,
    error: null
  })
}))

vi.mock('./hooks/usePageSEO', () => ({
  usePageSEO: () => ({
    updateSEO: vi.fn()
  })
}))

describe('App Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  it('contains main app structure', () => {
    const { container } = render(<App />)
    expect(container.querySelector('.app-container')).toBeTruthy()
  })
})