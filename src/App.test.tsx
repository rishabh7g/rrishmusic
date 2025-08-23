import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

// Mock browser APIs
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
})

Object.defineProperty(window, 'PerformanceObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  })),
})

// Mock all the complex dependencies
vi.mock('framer-motion', () => {
  const createMockElement = (tag: string) => ({ children, ...props }: any) => {
    const { whileHover, whileTap, whileInView, variants, custom, initial, animate, exit, transition, ...restProps } = props
    const Element = tag as any
    return <Element {...restProps}>{children}</Element>
  }

  return {
    motion: {
      div: createMockElement('div'),
      section: createMockElement('section'),
      nav: createMockElement('nav'),
      ul: createMockElement('ul'),
      li: createMockElement('li'),
      a: createMockElement('a'),
      button: createMockElement('button'),
      h1: createMockElement('h1'),
      h2: createMockElement('h2'),
      h3: createMockElement('h3'),
      p: createMockElement('p'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  }
})

vi.mock('./hooks/useScrollSpy', () => ({
  useScrollSpy: () => 'hero',
  useSmoothScroll: () => vi.fn()
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
  }),
  useSEO: () => ({
    data: {
      title: 'Test Title',
      description: 'Test Description',
      keywords: 'test, keywords',
      ogImage: 'test-image.jpg',
      canonicalUrl: 'https://test.com'
    },
    generatePageTitle: (title: string) => `${title} | RrishMusic`
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

  it('contains app container element', () => {
    const { container } = render(<App />)
    const appContainer = container.querySelector('.app-container')
    expect(appContainer).toBeTruthy()
  })
})