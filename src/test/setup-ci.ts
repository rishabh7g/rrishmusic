/**
 * CI-Optimized Test Setup
 * 
 * Minimal test environment for maximum speed in CI/CD pipelines
 * Reduces setup overhead and focuses on essential test utilities
 */

import '@testing-library/jest-dom';

// Minimal DOM setup for faster execution
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Simplified IntersectionObserver for CI
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

// Basic ResizeObserver mock
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

// Simplified fetch mock for CI
Object.defineProperty(global, 'fetch', {
  writable: true,
  value: () =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    }),
});

// Performance optimization: Mock heavy dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
    header: 'header',
    nav: 'nav',
    main: 'main',
    footer: 'footer',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    a: 'a',
    button: 'button',
    img: 'img',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    set: vi.fn(),
    stop: vi.fn(),
  }),
  useInView: () => true,
}));

// Skip complex animations in CI
vi.mock('@/utils/animations', () => ({
  fadeInUp: {},
  fadeInDown: {},
  slideInLeft: {},
  slideInRight: {},
  scaleIn: {},
  stagger: {},
}));

// CI-optimized constants
export const CI_TIMEOUTS = {
  unit: 3000,        // 3 seconds per unit test
  smoke: 2000,       // 2 seconds per smoke test
  build: 60000,      // 1 minute for build verification
  total: 120000      // 2 minutes total CI execution
};

// Memory-efficient test data
export const createMinimalTestData = (overrides = {}) => ({
  id: '1',
  name: 'Test',
  ...overrides,
});

// Fast mock implementations
export const createFastMock = (returnValue: any = {}) => 
  vi.fn().mockResolvedValue(returnValue);

// CI-specific cleanup
beforeEach(() => {
  // Minimal cleanup for speed
  vi.clearAllTimers();
});

afterEach(() => {
  // Skip expensive cleanup operations in CI
  if (!process.env.CI) {
    vi.restoreAllMocks();
  }
});

// Global error handler to prevent test failures from stopping CI
const originalError = console.error;
console.error = (...args) => {
  // Only log critical errors in CI
  if (args[0]?.includes?.('Warning:') && process.env.CI) {
    return; // Skip React warnings in CI
  }
  originalError(...args);
};

// Fast test utilities for CI
export const renderFast = (component: React.ReactElement) => {
  // Simplified render without complex providers in CI mode
  const { render } = require('@testing-library/react');
  return render(component);
};

export const waitForFast = (callback: () => void, timeout = 1000) => {
  const { waitFor } = require('@testing-library/react');
  return waitFor(callback, { timeout });
};

// Memory optimization flags
export const CI_OPTIMIZATIONS = {
  skipAnimations: true,
  useMinimalMocks: true,
  reducedTimeout: true,
  skipHeavyOperations: true,
} as const;