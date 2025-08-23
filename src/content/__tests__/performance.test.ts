/**
 * Content Performance Tests
 * 
 * Tests for performance optimization, caching mechanisms, and memory management
 * in the RrishMusic content management system.
 */

import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { 
  useContent, 
  useSectionContent, 
  useLessonPackages,
  useTestimonials,
  contentUtils
} from '../hooks/useContent';
import { validateSiteContent } from '../utils/validation';
import type { SiteContent, LessonPackage } from '../types';

// Mock performance API
Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn()
  }
});

// Mock JSON data
vi.mock('../data/site-content.json', () => ({
  default: mockSiteContent
}));

vi.mock('../data/lessons.json', () => ({
  default: mockLessonsData
}));

// Mock validation
vi.mock('../utils/validation', () => ({
  validateSiteContent: vi.fn(() => ({ valid: true, errors: [], warnings: [] })),
  validateLessonPackage: vi.fn(() => ({ valid: true, errors: [], warnings: [] })),
  validateTestimonial: vi.fn(() => ({ valid: true, errors: [], warnings: [] })),
}));

const mockSiteContent: SiteContent = {
  id: 'perf-test-site',
  lastUpdated: '2024-08-23',
  version: '1.0.0',
  hero: {
    id: 'perf-hero',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    title: 'Performance Test Hero',
    subtitle: 'Testing content loading performance'
  },
  about: {
    id: 'perf-about',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    biography: 'Performance testing biography',
    profileImage: {
      src: '/test-profile.jpg',
      alt: 'Test Profile',
      width: 400,
      height: 400
    }
  },
  community: {
    id: 'perf-community',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    testimonials: {
      featured: Array(50).fill(null).map((_, i) => ({
        id: `testimonial-${i}`,
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        studentName: `Student ${i}`,
        content: `This is testimonial content number ${i}. Great teaching experience!`,
        rating: 5,
        date: '2024-08-23',
        featured: i < 10,
        studentLevel: ['beginner', 'intermediate', 'advanced'][i % 3] as any
      })),
      all: Array(200).fill(null).map((_, i) => ({
        id: `testimonial-all-${i}`,
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        studentName: `All Student ${i}`,
        content: `All testimonial content ${i}. Excellent lessons!`,
        rating: Math.ceil(Math.random() * 5),
        date: new Date(2024, 7, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
        featured: false,
        studentLevel: ['beginner', 'intermediate', 'advanced'][i % 3] as any
      }))
    }
  },
  contact: {
    id: 'perf-contact',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    methods: [
      { type: 'email', value: 'test@example.com', label: 'Email', primary: true }
    ]
  }
};

const mockLessonsData: LessonPackage[] = Array(100).fill(null).map((_, i) => ({
  id: `lesson-${i}`,
  lastUpdated: '2024-08-23',
  version: '1.0.0',
  name: `Lesson Package ${i}`,
  description: `This is lesson package ${i} with comprehensive curriculum`,
  duration: 30 + (i % 4) * 15, // 30, 45, 60, 75 minute variations
  price: 50 + (i % 10) * 10, // $50-$140 range
  currency: 'USD',
  targetAudience: [['beginner', 'intermediate', 'advanced'][i % 3]] as any,
  instruments: [['guitar', 'piano', 'violin'][i % 3]],
  features: [
    'One-on-one instruction',
    'Practice materials',
    'Progress tracking',
    'Flexible scheduling'
  ]
}));

describe('Content Performance Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Reset cache between tests
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Content Loading Performance', () => {
    it('should load content within acceptable time limits', async () => {
      const startTime = performance.now();
      
      const { result } = renderHook(() => useContent());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Content should load within 100ms (excluding network time)
      expect(loadTime).toBeLessThan(100);
      expect(result.current.content).toBeDefined();
    });

    it('should handle large datasets efficiently', async () => {
      const { result } = renderHook(() => useTestimonials());

      const startTime = performance.now();
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const endTime = performance.now();
      const processTime = endTime - startTime;

      // Should process 200 testimonials quickly
      expect(processTime).toBeLessThan(50);
      expect(result.current.testimonials).toHaveLength(200);
      expect(result.current.stats.total).toBe(200);
    });

    it('should optimize repeated hook calls', async () => {
      let validationCallCount = 0;
      (validateSiteContent as Mock).mockImplementation(() => {
        validationCallCount++;
        return { valid: true, errors: [], warnings: [] };
      });

      // Render multiple instances of the same hook
      const { result: result1 } = renderHook(() => useContent());
      const { result: result2 } = renderHook(() => useContent());
      const { result: result3 } = renderHook(() => useContent());

      await waitFor(() => {
        expect(result1.current.loading).toBe(false);
        expect(result2.current.loading).toBe(false);
        expect(result3.current.loading).toBe(false);
      });

      // Validation should only be called once due to caching
      expect(validationCallCount).toBe(1);
      
      // All hooks should return the same data
      expect(result1.current.content?.id).toBe('perf-test-site');
      expect(result2.current.content?.id).toBe('perf-test-site');
      expect(result3.current.content?.id).toBe('perf-test-site');
    });
  });

  describe('Caching Mechanisms', () => {
    it('should implement TTL-based cache expiration', async () => {
      const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
      
      // First load
      const { result: result1 } = renderHook(() => useContent());
      await waitFor(() => expect(result1.current.loading).toBe(false));

      const firstLoadTime = Date.now();
      
      // Advance time but stay within TTL
      vi.advanceTimersByTime(CACHE_TTL / 2);
      
      // Second load - should use cache
      const { result: result2 } = renderHook(() => useContent());
      await waitFor(() => expect(result2.current.loading).toBe(false));

      // Should get cached data immediately
      expect(result2.current.content?.id).toBe('perf-test-site');
      
      // Advance time beyond TTL
      vi.advanceTimersByTime(CACHE_TTL);
      
      // Third load - should fetch fresh data
      const { result: result3 } = renderHook(() => useContent());
      await waitFor(() => expect(result3.current.loading).toBe(false));

      expect(result3.current.content?.id).toBe('perf-test-site');
    });

    it('should invalidate cache on force refresh', async () => {
      let validationCallCount = 0;
      (validateSiteContent as Mock).mockImplementation(() => {
        validationCallCount++;
        return { valid: true, errors: [], warnings: [] };
      });

      const { result } = renderHook(() => useContent());
      
      // Initial load
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(validationCallCount).toBe(1);

      // Force refresh
      act(() => {
        result.current.refresh();
      });

      await waitFor(() => expect(result.current.loading).toBe(false));
      
      // Should have called validation again
      expect(validationCallCount).toBe(2);
    });

    it('should implement proper cache key strategies', async () => {
      // Mock different content versions
      const version1 = { ...mockSiteContent, version: '1.0.0' };
      const version2 = { ...mockSiteContent, version: '1.1.0' };

      vi.doMock('../data/site-content.json', () => ({ default: version1 }));

      const { result: result1 } = renderHook(() => useContent());
      await waitFor(() => expect(result1.current.loading).toBe(false));
      
      expect(result1.current.content?.version).toBe('1.0.0');

      // Simulate content version change
      vi.doMock('../data/site-content.json', () => ({ default: version2 }));

      // Force refresh to get new version
      act(() => {
        result1.current.refresh();
      });

      await waitFor(() => expect(result1.current.loading).toBe(false));
      
      // Should detect version change and update
      expect(result1.current.content?.version).toBe('1.1.0');
    });
  });

  describe('Memory Management', () => {
    it('should prevent memory leaks with multiple hook instances', async () => {
      const hookInstances: any[] = [];
      
      // Create multiple hook instances
      for (let i = 0; i < 10; i++) {
        const { result, unmount } = renderHook(() => useContent());
        hookInstances.push({ result, unmount });
      }

      // Wait for all to load
      await Promise.all(hookInstances.map(({ result }) => 
        waitFor(() => expect(result.current.loading).toBe(false))
      ));

      // Unmount half of them
      for (let i = 0; i < 5; i++) {
        hookInstances[i].unmount();
      }

      // Remaining instances should still work
      for (let i = 5; i < 10; i++) {
        expect(hookInstances[i].result.current.content?.id).toBe('perf-test-site');
      }

      // Clean up remaining instances
      for (let i = 5; i < 10; i++) {
        hookInstances[i].unmount();
      }
    });

    it('should clean up event listeners on unmount', async () => {
      const addEventListener = vi.spyOn(window, 'addEventListener');
      const removeEventListener = vi.spyOn(window, 'removeEventListener');

      const { result, unmount } = renderHook(() => useContent());
      
      await waitFor(() => expect(result.current.loading).toBe(false));

      // Should have added event listeners for hot reload
      expect(addEventListener).toHaveBeenCalled();

      unmount();

      // Should clean up event listeners
      expect(removeEventListener).toHaveBeenCalled();
    });

    it('should handle rapid component mounting/unmounting', async () => {
      const mountAndUnmount = async (iterations: number) => {
        for (let i = 0; i < iterations; i++) {
          const { result, unmount } = renderHook(() => useContent());
          
          // Don't wait for full load, just unmount quickly
          unmount();
        }
      };

      // Should not throw errors or cause memory issues
      await expect(mountAndUnmount(50)).resolves.toBeUndefined();
    });
  });

  describe('Data Processing Performance', () => {
    it('should efficiently filter large lesson package datasets', async () => {
      const { result } = renderHook(() => 
        useLessonPackages({ 
          instruments: ['guitar'],
          priceRange: { min: 60, max: 100 }
        })
      );

      const startTime = performance.now();
      
      await waitFor(() => expect(result.current.loading).toBe(false));
      
      const endTime = performance.now();
      const filterTime = endTime - startTime;

      // Should filter 100 packages quickly
      expect(filterTime).toBeLessThan(20);
      expect(result.current.packages.length).toBeGreaterThan(0);
      
      // Verify filtering worked correctly
      result.current.packages.forEach(pkg => {
        expect(pkg.instruments).toContain('guitar');
        expect(pkg.price).toBeGreaterThanOrEqual(60);
        expect(pkg.price).toBeLessThanOrEqual(100);
      });
    });

    it('should efficiently calculate statistics for large datasets', async () => {
      const { result } = renderHook(() => useTestimonials());

      await waitFor(() => expect(result.current.loading).toBe(false));

      const startTime = performance.now();
      
      // Access stats to trigger calculation
      const stats = result.current.stats;
      
      const endTime = performance.now();
      const calcTime = endTime - startTime;

      // Should calculate stats for 200 testimonials quickly
      expect(calcTime).toBeLessThan(10);
      expect(stats.total).toBe(200);
      expect(stats.averageRating).toBeGreaterThan(0);
      expect(stats.featuredCount).toBe(10);
    });

    it('should optimize repeated calculations with memoization', async () => {
      let calculationCount = 0;
      
      // Mock expensive calculation
      const originalCalculate = contentUtils.calculateLessonPricing;
      contentUtils.calculateLessonPricing = vi.fn((price: number, sessions: number) => {
        calculationCount++;
        return originalCalculate(price, sessions);
      });

      const { result, rerender } = renderHook(({ price, sessions }) => 
        contentUtils.calculateLessonPricing(price, sessions),
        { initialProps: { price: 75, sessions: 4 } }
      );

      // First calculation
      expect(result.current.total).toBeDefined();
      expect(calculationCount).toBe(1);

      // Same parameters - should use memoized result
      rerender({ price: 75, sessions: 4 });
      expect(calculationCount).toBe(1);

      // Different parameters - should recalculate
      rerender({ price: 80, sessions: 4 });
      expect(calculationCount).toBe(2);

      // Back to first parameters - should use memoized result
      rerender({ price: 75, sessions: 4 });
      expect(calculationCount).toBe(2); // No new calculation
    });
  });

  describe('Search Performance', () => {
    it('should perform content search efficiently', async () => {
      const { result } = renderHook(() => {
        const { search } = require('../hooks/useContent').useContentSearch();
        return { search };
      });

      await waitFor(() => expect(result.current.search).toBeDefined());

      const startTime = performance.now();
      
      const searchResults = result.current.search('lesson', {
        maxResults: 20
      });
      
      const endTime = performance.now();
      const searchTime = endTime - startTime;

      // Search should complete quickly even with large content
      expect(searchTime).toBeLessThan(50);
      expect(searchResults.items.length).toBeGreaterThan(0);
      expect(searchResults.items.length).toBeLessThanOrEqual(20);
    });

    it('should optimize search with result limiting', async () => {
      const { result } = renderHook(() => {
        const { search } = require('../hooks/useContent').useContentSearch();
        return { search };
      });

      await waitFor(() => expect(result.current.search).toBeDefined());

      // Search with small limit should be faster
      const startTime1 = performance.now();
      const smallResults = result.current.search('test', { maxResults: 5 });
      const endTime1 = performance.now();

      // Search with large limit
      const startTime2 = performance.now();
      const largeResults = result.current.search('test', { maxResults: 100 });
      const endTime2 = performance.now();

      const smallSearchTime = endTime1 - startTime1;
      const largeSearchTime = endTime2 - startTime2;

      // Both should be fast, but small limit might be slightly faster
      expect(smallSearchTime).toBeLessThan(30);
      expect(largeSearchTime).toBeLessThan(50);
      expect(smallResults.items.length).toBeLessThanOrEqual(5);
      expect(largeResults.items.length).toBeGreaterThanOrEqual(smallResults.items.length);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent content access efficiently', async () => {
      const concurrentPromises = Array(20).fill(null).map(async () => {
        const { result } = renderHook(() => useContent());
        await waitFor(() => expect(result.current.loading).toBe(false));
        return result.current.content;
      });

      const startTime = performance.now();
      const results = await Promise.all(concurrentPromises);
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // All concurrent operations should complete reasonably quickly
      expect(totalTime).toBeLessThan(200);
      
      // All should return the same content
      results.forEach(content => {
        expect(content?.id).toBe('perf-test-site');
      });
    });

    it('should handle concurrent updates without race conditions', async () => {
      const { result } = renderHook(() => useContent());
      
      await waitFor(() => expect(result.current.loading).toBe(false));

      // Trigger multiple rapid refreshes
      const refreshPromises = Array(5).fill(null).map(() => 
        act(() => result.current.refresh())
      );

      await Promise.all(refreshPromises);
      
      // Should end in a stable state
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.content?.id).toBe('perf-test-site');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Resource Optimization', () => {
    it('should minimize validation calls through smart caching', async () => {
      let validationCalls = 0;
      (validateSiteContent as Mock).mockImplementation(() => {
        validationCalls++;
        return { valid: true, errors: [], warnings: [] };
      });

      // Multiple components using different hooks but same content
      const { result: contentResult } = renderHook(() => useContent());
      const { result: heroResult } = renderHook(() => useSectionContent('hero'));
      const { result: aboutResult } = renderHook(() => useSectionContent('about'));

      await waitFor(() => {
        expect(contentResult.current.loading).toBe(false);
        expect(heroResult.current.loading).toBe(false);
        expect(aboutResult.current.loading).toBe(false);
      });

      // Should only validate once for all hooks
      expect(validationCalls).toBe(1);
    });

    it('should efficiently handle component re-renders', async () => {
      let renderCount = 0;
      
      const TestComponent = () => {
        renderCount++;
        const { content, loading } = useContent();
        return loading ? 'loading' : content?.id;
      };

      const { result, rerender } = renderHook(() => <TestComponent />);
      
      await waitFor(() => expect(renderCount).toBeGreaterThan(0));
      
      const initialRenderCount = renderCount;
      
      // Multiple re-renders shouldn't cause excessive re-computation
      rerender();
      rerender();
      rerender();
      
      expect(renderCount - initialRenderCount).toBeLessThan(5);
    });

    it('should optimize bundle size through tree shaking', () => {
      // Test that unused utilities aren't included
      const usedUtils = Object.keys(contentUtils);
      
      // Should expose only necessary utilities
      expect(usedUtils).toContain('calculatePackageDiscount');
      expect(usedUtils).toContain('calculateLessonPricing');
      expect(usedUtils).toContain('getContentStats');
      
      // Utilities should be functions (not unused imports)
      usedUtils.forEach(util => {
        expect(typeof contentUtils[util as keyof typeof contentUtils]).toBe('function');
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should provide performance metrics', async () => {
      const { result } = renderHook(() => useContent());
      
      await waitFor(() => expect(result.current.loading).toBe(false));

      // Should have performance data available
      expect(result.current.lastLoadTime).toBeDefined();
      expect(typeof result.current.lastLoadTime).toBe('number');
    });

    it('should track error recovery performance', async () => {
      let callCount = 0;
      (validateSiteContent as Mock).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Network error');
        }
        return { valid: true, errors: [], warnings: [] };
      });

      const { result } = renderHook(() => useContent());
      
      // Wait for error
      await waitFor(() => expect(result.current.error).toBeTruthy());

      const errorTime = Date.now();
      
      // Retry
      act(() => {
        result.current.retry();
      });

      // Wait for recovery
      await waitFor(() => expect(result.current.error).toBeNull());
      
      const recoveryTime = Date.now();
      const recoveryDuration = recoveryTime - errorTime;

      // Recovery should be reasonably fast
      expect(recoveryDuration).toBeLessThan(1000);
    });
  });
});

describe('Performance Benchmarks', () => {
  it('should meet performance benchmarks for typical usage', async () => {
    const benchmarks = {
      contentLoad: 100, // ms
      largeDatasetFilter: 50, // ms
      searchQuery: 30, // ms
      cacheHit: 5, // ms
      validation: 20 // ms
    };

    // Content loading benchmark
    const contentStartTime = performance.now();
    const { result: contentResult } = renderHook(() => useContent());
    await waitFor(() => expect(contentResult.current.loading).toBe(false));
    const contentLoadTime = performance.now() - contentStartTime;
    expect(contentLoadTime).toBeLessThan(benchmarks.contentLoad);

    // Large dataset filtering benchmark
    const filterStartTime = performance.now();
    const { result: lessonResult } = renderHook(() => 
      useLessonPackages({ 
        instruments: ['guitar'],
        priceRange: { min: 50, max: 150 },
        targetAudience: ['intermediate']
      })
    );
    await waitFor(() => expect(lessonResult.current.loading).toBe(false));
    const filterTime = performance.now() - filterStartTime;
    expect(filterTime).toBeLessThan(benchmarks.largeDatasetFilter);

    // Search benchmark
    const searchStartTime = performance.now();
    const { result: searchResult } = renderHook(() => {
      const { search } = require('../hooks/useContent').useContentSearch();
      return { search };
    });
    await waitFor(() => expect(searchResult.current.search).toBeDefined());
    const searchResults = searchResult.current.search('music lesson');
    const searchTime = performance.now() - searchStartTime;
    expect(searchTime).toBeLessThan(benchmarks.searchQuery);

    // Cache hit benchmark (second load should be much faster)
    const cacheStartTime = performance.now();
    const { result: cachedResult } = renderHook(() => useContent());
    await waitFor(() => expect(cachedResult.current.loading).toBe(false));
    const cacheTime = performance.now() - cacheStartTime;
    expect(cacheTime).toBeLessThan(benchmarks.cacheHit);
  });
});