/**
 * Performance Test Setup
 * 
 * Setup for performance tests including performance monitoring,
 * memory usage tracking, and benchmark utilities
 */

import '@testing-library/jest-dom';
import { expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Performance monitoring utilities
declare global {
  var __PERFORMANCE_OBSERVER__: PerformanceObserver | undefined;
  var __MEMORY_BASELINE__: number;
}

// Mock performance APIs with enhanced capabilities for testing
const mockPerformance = {
  ...global.performance,
  mark: vi.fn((name: string) => {
    const entry = {
      name,
      entryType: 'mark',
      startTime: performance.now(),
      duration: 0,
    };
    return entry;
  }),
  measure: vi.fn((name: string, startMark?: string, endMark?: string) => {
    const entry = {
      name,
      entryType: 'measure',
      startTime: 100,
      duration: 50,
    };
    return entry;
  }),
  getEntriesByType: vi.fn((type: string) => []),
  getEntriesByName: vi.fn((name: string) => []),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
  now: () => performance.now(),
};

// Mock PerformanceObserver for performance tests
global.PerformanceObserver = class PerformanceObserver {
  private callback: PerformanceObserverCallback;
  
  constructor(callback: PerformanceObserverCallback) {
    this.callback = callback;
  }
  
  observe() {}
  disconnect() {}
  takeRecords() { return []; }
};

// Mock Memory API for memory usage tests
Object.defineProperty(performance, 'memory', {
  value: {
    get usedJSHeapSize() {
      return Math.floor(Math.random() * 50000000) + 10000000; // 10-60MB
    },
    get totalJSHeapSize() {
      return this.usedJSHeapSize * 1.2;
    },
    get jsHeapSizeLimit() {
      return 2147483648; // 2GB
    },
  },
  configurable: true,
});

// Enhanced performance utilities for tests
global.performance = mockPerformance as any;

// Disable animations and transitions for consistent performance testing
const disableAnimations = () => {
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-delay: 0s !important;
      transition-duration: 0.001ms !important;
      transition-delay: 0s !important;
    }
  `;
  document.head.appendChild(style);
};

// Performance test utilities
export const performanceUtils = {
  measureRenderTime: async (renderFn: () => Promise<void> | void) => {
    const start = performance.now();
    await renderFn();
    const end = performance.now();
    return end - start;
  },
  
  measureMemoryUsage: () => {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  },
  
  createPerformanceBaseline: () => {
    global.__MEMORY_BASELINE__ = performance.memory?.usedJSHeapSize || 0;
  },
  
  getMemoryDelta: () => {
    const current = performance.memory?.usedJSHeapSize || 0;
    const baseline = global.__MEMORY_BASELINE__ || 0;
    return current - baseline;
  },
};

// Mock requestAnimationFrame for consistent timing
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 16); // 60fps
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Setup for performance tests
beforeAll(() => {
  // Set performance test environment
  process.env.VITEST_PERFORMANCE = 'true';
  process.env.NODE_ENV = 'test';
  process.env.REACT_DISABLE_ANIMATION = 'true';
  
  // Disable animations
  disableAnimations();
  
  // Set up performance baseline
  performanceUtils.createPerformanceBaseline();
});

beforeEach(() => {
  // Clear performance marks and measures
  if (performance.clearMarks) performance.clearMarks();
  if (performance.clearMeasures) performance.clearMeasures();
  
  // Reset performance mocks
  vi.clearAllMocks();
  
  // Force garbage collection if available (Node.js)
  if (global.gc) {
    global.gc();
  }
});

afterEach(() => {
  // Clear any performance observers
  if (global.__PERFORMANCE_OBSERVER__) {
    global.__PERFORMANCE_OBSERVER__.disconnect();
    global.__PERFORMANCE_OBSERVER__ = undefined;
  }
  
  // Clear timers
  vi.clearAllTimers();
});

afterAll(() => {
  // Restore performance APIs
  vi.restoreAllMocks();
  
  // Final memory measurement
  const finalMemory = performanceUtils.getMemoryDelta();
  if (finalMemory > 10000000) { // 10MB threshold
    console.warn(`Performance tests may have memory leak: ${finalMemory} bytes`);
  }
});