/**
 * Content Hooks Performance Tests
 * 
 * Tests the performance characteristics of content management hooks
 * including render optimization, caching effectiveness, and memory usage.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { 
  useContent, 
  useSectionContent, 
  useLessonPackages, 
  useTestimonials,
  useContentSearch 
} from '@/content/hooks/useContent';

// Performance test utilities
class PerformanceTimer {
  private startTime: number = 0;
  
  start() {
    this.startTime = performance.now();
  }
  
  end(): number {
    return performance.now() - this.startTime;
  }
  
  static measure<T>(fn: () => T): { result: T; duration: number } {
    const timer = new PerformanceTimer();
    timer.start();
    const result = fn();
    const duration = timer.end();
    return { result, duration };
  }
  
  static async measureAsync<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const timer = new PerformanceTimer();
    timer.start();
    const result = await fn();
    const duration = timer.end();
    return { result, duration };
  }
}

// Performance budget constants
const PERFORMANCE_BUDGETS = {
  HOOK_EXECUTION_TIME: 10, // milliseconds
  CONTENT_LOADING_TIME: 100, // milliseconds
  CACHE_ACCESS_TIME: 5, // milliseconds
  SEARCH_EXECUTION_TIME: 50, // milliseconds
  MEMORY_GROWTH_LIMIT: 10, // MB
  RE_RENDER_TIME: 16, // milliseconds (60fps)
} as const;

describe('Content Hooks Performance Tests', () => {
  let memoryBaseline: number;

  beforeAll(() => {
    // Establish memory baseline
    if (global.gc) {
      global.gc();
    }
    memoryBaseline = process.memoryUsage().heapUsed;
  });

  afterEach(() => {
    // Clean up any performance observers
    jest.clearAllMocks();
  });

  describe('useContent Hook Performance', () => {
    it('should execute within performance budget', async () => {
      const { result, duration } = await PerformanceTimer.measureAsync(async () => {
        const { result } = renderHook(() => useContent());
        await waitFor(() => !result.current.loading);
        return result.current;
      });

      expect(duration).toBeLessThan(PERFORMANCE_BUDGETS.CONTENT_LOADING_TIME);
      expect(result.error).toBeNull();
    });

    it('should cache content effectively', async () => {
      // First load
      const { result: hook1 } = renderHook(() => useContent());
      await waitFor(() => !hook1.current.loading);
      
      // Second load (should be cached)
      const { duration } = await PerformanceTimer.measureAsync(async () => {
        const { result: hook2 } = renderHook(() => useContent());
        await waitFor(() => !hook2.current.loading);
        return hook2.current;
      });

      expect(duration).toBeLessThan(PERFORMANCE_BUDGETS.CACHE_ACCESS_TIME);
    });

    it('should not cause memory leaks with multiple hook instances', async () => {
      const hooks: any[] = [];
      
      // Create multiple hook instances
      for (let i = 0; i < 50; i++) {
        const { result } = renderHook(() => useContent());
        hooks.push(result);
        await waitFor(() => !result.current.loading);
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const memoryAfter = process.memoryUsage().heapUsed;
      const memoryGrowth = (memoryAfter - memoryBaseline) / (1024 * 1024); // MB

      expect(memoryGrowth).toBeLessThan(PERFORMANCE_BUDGETS.MEMORY_GROWTH_LIMIT);
    });

    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = 10;
      const promises: Promise<any>[] = [];

      const startTime = performance.now();

      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          new Promise(async (resolve) => {
            const { result } = renderHook(() => useContent());
            await waitFor(() => !result.current.loading);
            resolve(result.current);
          })
        );
      }

      await Promise.all(promises);
      const totalTime = performance.now() - startTime;

      // Should not take much longer than a single request due to caching
      expect(totalTime).toBeLessThan(PERFORMANCE_BUDGETS.CONTENT_LOADING_TIME * 2);
    });

    it('should optimize re-renders with stable references', async () => {
      const renderCounts = { count: 0 };
      
      const { result, rerender } = renderHook(() => {
        renderCounts.count++;
        return useContent();
      });

      await waitFor(() => !result.current.loading);
      const initialRenderCount = renderCounts.count;

      // Force multiple re-renders
      for (let i = 0; i < 5; i++) {
        rerender();
        await new Promise(resolve => setTimeout(resolve, 1));
      }

      const finalRenderCount = renderCounts.count;
      const additionalRenders = finalRenderCount - initialRenderCount;

      // Should minimize unnecessary re-renders
      expect(additionalRenders).toBeLessThan(3);
    });
  });

  describe('useSectionContent Hook Performance', () => {
    it('should access section data within performance budget', async () => {
      const { duration } = PerformanceTimer.measure(() => {
        const { result } = renderHook(() => useSectionContent('hero'));
        return result.current;
      });

      expect(duration).toBeLessThan(PERFORMANCE_BUDGETS.HOOK_EXECUTION_TIME);
    });

    it('should memoize section data effectively', async () => {
      const { result } = renderHook(() => useSectionContent('hero'));
      await waitFor(() => !result.current.loading);
      
      const firstData = result.current.data;
      
      // Re-render with same section
      const { result: result2 } = renderHook(() => useSectionContent('hero'));
      await waitFor(() => !result2.current.loading);
      
      const secondData = result2.current.data;
      
      // Should return same reference (memoized)
      expect(firstData).toBe(secondData);
    });

    it('should handle section switching efficiently', async () => {
      const sections = ['hero', 'about', 'lessons', 'contact'] as const;
      const switchTimes: number[] = [];

      let currentSection = 0;
      const { result, rerender } = renderHook(() => 
        useSectionContent(sections[currentSection])
      );

      await waitFor(() => !result.current.loading);

      // Switch between sections and measure time
      for (let i = 1; i < sections.length; i++) {
        const startTime = performance.now();
        
        act(() => {
          currentSection = i;
          rerender();
        });
        
        await waitFor(() => result.current.data !== null);
        switchTimes.push(performance.now() - startTime);
      }

      const averageSwitchTime = switchTimes.reduce((a, b) => a + b) / switchTimes.length;
      expect(averageSwitchTime).toBeLessThan(PERFORMANCE_BUDGETS.RE_RENDER_TIME);
    });
  });

  describe('useLessonPackages Hook Performance', () => {
    it('should filter packages within performance budget', async () => {
      const filters = {
        popular: true,
        maxPrice: 1000,
        minSessions: 4,
        targetAudience: ['beginner', 'intermediate'] as const
      };

      const { duration } = PerformanceTimer.measure(() => {
        const { result } = renderHook(() => useLessonPackages(filters));
        return result.current;
      });

      expect(duration).toBeLessThan(PERFORMANCE_BUDGETS.HOOK_EXECUTION_TIME);
    });

    it('should optimize filter calculations with memoization', async () => {
      const filters = { popular: true };
      let executionCount = 0;

      const { result, rerender } = renderHook(() => {
        executionCount++;
        return useLessonPackages(filters);
      });

      await waitFor(() => !result.current.loading);
      const initialExecutions = executionCount;

      // Re-render with same filters
      rerender();
      rerender();
      
      const finalExecutions = executionCount;
      
      // Should not re-execute expensive computations
      expect(finalExecutions - initialExecutions).toBeLessThan(2);
    });

    it('should handle complex filtering scenarios efficiently', async () => {
      const complexFilters = {
        popular: true,
        maxPrice: 500,
        minSessions: 2,
        targetAudience: ['beginner'] as const,
        instruments: ['guitar', 'piano'],
        recommended: true
      };

      const { duration } = await PerformanceTimer.measureAsync(async () => {
        const { result } = renderHook(() => useLessonPackages(complexFilters));
        await waitFor(() => !result.current.loading);
        return result.current;
      });

      expect(duration).toBeLessThan(PERFORMANCE_BUDGETS.CONTENT_LOADING_TIME);
    });
  });

  describe('useTestimonials Hook Performance', () => {
    it('should sort and filter testimonials efficiently', async () => {
      const filters = {
        featured: true,
        instrument: 'guitar',
        minRating: 4,
        limit: 10
      };

      const { duration } = PerformanceTimer.measure(() => {
        const { result } = renderHook(() => useTestimonials(filters));
        return result.current;
      });

      expect(duration).toBeLessThan(PERFORMANCE_BUDGETS.HOOK_EXECUTION_TIME);
    });

    it('should calculate statistics efficiently', async () => {
      const { result } = renderHook(() => useTestimonials());
      await waitFor(() => !result.current.loading);

      const { duration } = PerformanceTimer.measure(() => {
        return result.current.stats;
      });

      expect(duration).toBeLessThan(PERFORMANCE_BUDGETS.HOOK_EXECUTION_TIME);
    });
  });

  describe('useContentSearch Hook Performance', () => {
    it('should execute search within performance budget', async () => {
      const { result } = renderHook(() => useContentSearch());
      await waitFor(() => result.current);

      const { duration } = PerformanceTimer.measure(() => {
        return result.current.search('guitar lessons', {
          section: 'lessons'
        });
      });

      expect(duration).toBeLessThan(PERFORMANCE_BUDGETS.SEARCH_EXECUTION_TIME);
    });

    it('should handle complex search queries efficiently', async () => {
      const { result } = renderHook(() => useContentSearch());
      await waitFor(() => result.current);

      const complexQuery = 'advanced blues improvisation techniques for experienced players';

      const { duration } = PerformanceTimer.measure(() => {
        return result.current.search(complexQuery);
      });

      expect(duration).toBeLessThan(PERFORMANCE_BUDGETS.SEARCH_EXECUTION_TIME * 2);
    });

    it('should optimize repeated searches with caching', async () => {
      const { result } = renderHook(() => useContentSearch());
      await waitFor(() => result.current);

      const query = 'guitar lessons';
      
      // First search
      const { duration: firstDuration } = PerformanceTimer.measure(() => {
        return result.current.search(query);
      });

      // Repeated search (should be faster due to internal optimizations)
      const { duration: secondDuration } = PerformanceTimer.measure(() => {
        return result.current.search(query);
      });

      expect(secondDuration).toBeLessThanOrEqual(firstDuration);
    });
  });

  describe('Hook Memory Management', () => {
    it('should properly cleanup resources on unmount', async () => {
      const { result, unmount } = renderHook(() => useContent());
      await waitFor(() => !result.current.loading);

      const memoryBefore = process.memoryUsage().heapUsed;
      unmount();

      // Force garbage collection
      if (global.gc) {
        global.gc();
      }

      const memoryAfter = process.memoryUsage().heapUsed;
      const memoryDifference = memoryAfter - memoryBefore;

      // Should not retain significant memory after unmount
      expect(Math.abs(memoryDifference)).toBeLessThan(1024 * 1024); // 1MB
    });

    it('should handle rapid mount/unmount cycles', async () => {
      const cycles = 20;
      const memoryBefore = process.memoryUsage().heapUsed;

      for (let i = 0; i < cycles; i++) {
        const { result, unmount } = renderHook(() => useContent());
        await waitFor(() => !result.current.loading);
        unmount();
      }

      // Force garbage collection
      if (global.gc) {
        global.gc();
      }

      const memoryAfter = process.memoryUsage().heapUsed;
      const memoryGrowth = (memoryAfter - memoryBefore) / (1024 * 1024);

      expect(memoryGrowth).toBeLessThan(PERFORMANCE_BUDGETS.MEMORY_GROWTH_LIMIT);
    });
  });

  describe('Hook Performance Under Load', () => {
    it('should maintain performance with multiple concurrent hook instances', async () => {
      const hookCount = 25;
      const hooks: any[] = [];
      
      const startTime = performance.now();

      // Create multiple hooks simultaneously
      const promises = Array.from({ length: hookCount }, async () => {
        const { result } = renderHook(() => useContent());
        hooks.push(result);
        await waitFor(() => !result.current.loading);
        return result.current;
      });

      await Promise.all(promises);
      const totalTime = performance.now() - startTime;

      // Should complete within reasonable time despite multiple instances
      expect(totalTime).toBeLessThan(PERFORMANCE_BUDGETS.CONTENT_LOADING_TIME * 3);
    });

    it('should handle rapid content updates efficiently', async () => {
      const { result } = renderHook(() => useContent());
      await waitFor(() => !result.current.loading);

      const updateTimes: number[] = [];

      // Simulate rapid content refreshes
      for (let i = 0; i < 5; i++) {
        const startTime = performance.now();
        
        act(() => {
          result.current.refresh();
        });

        await waitFor(() => !result.current.loading);
        updateTimes.push(performance.now() - startTime);
      }

      const averageUpdateTime = updateTimes.reduce((a, b) => a + b) / updateTimes.length;
      expect(averageUpdateTime).toBeLessThan(PERFORMANCE_BUDGETS.CONTENT_LOADING_TIME);
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should provide performance metrics for monitoring', async () => {
      const metrics: Array<{ name: string; duration: number; timestamp: number }> = [];

      // Mock performance monitoring
      const originalNow = performance.now;
      performance.now = jest.fn(() => Date.now());

      const { result } = renderHook(() => {
        const startTime = performance.now();
        const content = useContent();
        
        if (!content.loading && content.content) {
          metrics.push({
            name: 'useContent.execution',
            duration: performance.now() - startTime,
            timestamp: Date.now()
          });
        }
        
        return content;
      });

      await waitFor(() => !result.current.loading);

      // Restore original performance.now
      performance.now = originalNow;

      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].duration).toBeLessThan(PERFORMANCE_BUDGETS.HOOK_EXECUTION_TIME);
    });
  });
});

// Performance testing utilities for export
export const performanceTestUtils = {
  PerformanceTimer,
  PERFORMANCE_BUDGETS,
  
  /**
   * Create a performance test wrapper for any hook
   */
  createPerformanceTest: <T>(
    hookFactory: () => T,
    budget: number,
    description: string
  ) => {
    return async () => {
      const { duration } = await PerformanceTimer.measureAsync(async () => {
        const { result } = renderHook(hookFactory);
        await waitFor(() => result.current);
        return result.current;
      });

      expect(duration).toBeLessThan(budget);
    };
  },

  /**
   * Monitor memory usage during test execution
   */
  monitorMemory: (testFn: () => Promise<void> | void) => {
    return async () => {
      const memoryBefore = process.memoryUsage();
      
      await testFn();
      
      if (global.gc) {
        global.gc();
      }
      
      const memoryAfter = process.memoryUsage();
      const heapGrowth = (memoryAfter.heapUsed - memoryBefore.heapUsed) / (1024 * 1024);
      
      return {
        heapGrowth,
        rss: memoryAfter.rss - memoryBefore.rss,
        external: memoryAfter.external - memoryBefore.external
      };
    };
  }
};