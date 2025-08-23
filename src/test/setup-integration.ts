/**
 * Integration Test Setup
 * 
 * Additional setup for integration tests that require more complex configuration
 * including content system integration, API mocking, and test data factories
 */

import '@testing-library/jest-dom';
import { expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock ResizeObserver for integration tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver for integration tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia for responsive integration tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scroll behavior for navigation integration tests
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
});

// Setup for integration tests
beforeAll(() => {
  // Set integration test environment
  process.env.VITEST_INTEGRATION = 'true';
  process.env.NODE_ENV = 'test';
  
  // Disable console warnings for integration tests (they can be noisy)
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Filter out known integration test warnings
    const message = args[0];
    if (
      typeof message === 'string' && (
        message.includes('useLayoutEffect does nothing on the server') ||
        message.includes('Warning: ReactDOM.render is no longer supported')
      )
    ) {
      return;
    }
    originalWarn(...args);
  };
});

beforeEach(() => {
  // Clear all mocks before each integration test
  vi.clearAllMocks();
  
  // Reset DOM state
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  
  // Clear any stored data that might affect tests
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  // Cleanup after each integration test
  cleanup();
  
  // Clear any pending timers
  vi.clearAllTimers();
  
  // Clear module cache for fresh imports
  vi.resetModules();
});

afterAll(() => {
  // Restore original console.warn
  console.warn = console.warn;
  
  // Final cleanup
  vi.restoreAllMocks();
});