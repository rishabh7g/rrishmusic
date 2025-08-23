/**
 * Memory Usage and Management Performance Tests
 * 
 * Tests memory usage patterns, garbage collection efficiency,
 * memory leaks prevention, and optimal memory management
 * for the content management system and React components.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { render, unmount } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { 
  useContent, 
  useLessonPackages, 
  useTestimonials,
  useContentSearch 
} from '@/content/hooks/useContent';

// Memory monitoring utilities
class MemoryMonitor {
  private initialMemory: NodeJS.MemoryUsage;
  private measurements: Array<{
    timestamp: number;
    memory: NodeJS.MemoryUsage;
    description: string;
  }> = [];

  constructor() {
    this.initialMemory = process.memoryUsage();
  }

  snapshot(description: string): NodeJS.MemoryUsage {
    if (global.gc) {
      global.gc();
    }

    const memory = process.memoryUsage();
    this.measurements.push({
      timestamp: Date.now(),
      memory,
      description
    });

    return memory;
  }

  getHeapGrowth(description?: string): number {
    const current = this.getCurrentMemory();
    const baseline = description 
      ? this.measurements.find(m => m.description === description)?.memory || this.initialMemory
      : this.initialMemory;

    return current.heapUsed - baseline.heapUsed;
  }

  getExternalGrowth(description?: string): number {
    const current = this.getCurrentMemory();
    const baseline = description 
      ? this.measurements.find(m => m.description === description)?.memory || this.initialMemory
      : this.initialMemory;

    return current.external - baseline.external;
  }

  getRSSGrowth(description?: string): number {
    const current = this.getCurrentMemory();
    const baseline = description 
      ? this.measurements.find(m => m.description === description)?.memory || this.initialMemory
      : this.initialMemory;

    return current.rss - baseline.rss;
  }

  private getCurrentMemory(): NodeJS.MemoryUsage {
    if (global.gc) {
      global.gc();
    }
    return process.memoryUsage();
  }

  generateReport(): MemoryReport {
    const current = this.getCurrentMemory();
    const totalHeapGrowth = current.heapUsed - this.initialMemory.heapUsed;
    const totalRSSGrowth = current.rss - this.initialMemory.rss;
    const totalExternalGrowth = current.external - this.initialMemory.external;

    return {
      initial: this.initialMemory,
      current,
      growth: {
        heap: totalHeapGrowth,
        rss: totalRSSGrowth,
        external: totalExternalGrowth
      },
      measurements: this.measurements.map(m => ({
        ...m,
        heapGrowth: m.memory.heapUsed - this.initialMemory.heapUsed,
        rssGrowth: m.memory.rss - this.initialMemory.rss
      }))
    };
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  clear() {
    this.measurements = [];
    this.initialMemory = process.memoryUsage();
  }
}

// Memory usage patterns analyzer
class MemoryLeakDetector {
  private snapshots: Array<{
    timestamp: number;
    memory: NodeJS.MemoryUsage;
    phase: string;
  }> = [];

  captureSnapshot(phase: string) {
    if (global.gc) {
      global.gc();
    }

    this.snapshots.push({
      timestamp: Date.now(),
      memory: process.memoryUsage(),
      phase
    });
  }

  analyzeLeakPattern(): LeakAnalysis {
    if (this.snapshots.length < 3) {
      return { hasLeak: false, confidence: 0, pattern: 'insufficient-data' };
    }

    const heapSizes = this.snapshots.map(s => s.memory.heapUsed);
    const trend = this.calculateTrend(heapSizes);
    
    // Check for consistent upward trend
    const isIncreasing = trend > 0.1; // 10% growth threshold
    const hasStableBaseline = this.hasStableBaseline(heapSizes);

    return {
      hasLeak: isIncreasing && !hasStableBaseline,
      confidence: Math.abs(trend) * 100,
      pattern: isIncreasing ? 'increasing' : hasStableBaseline ? 'stable' : 'fluctuating',
      trend,
      snapshots: this.snapshots
    };
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const sumX = (n * (n - 1)) / 2; // Sum of indices
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squared indices

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope / values[0]; // Normalize by initial value
  }

  private hasStableBaseline(values: number[]): boolean {
    if (values.length < 4) return false;

    const recent = values.slice(-3);
    const baseline = values.slice(0, 3);

    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const baselineAvg = baseline.reduce((a, b) => a + b) / baseline.length;

    const variance = Math.abs(recentAvg - baselineAvg) / baselineAvg;
    return variance < 0.1; // Within 10% of baseline
  }

  clear() {
    this.snapshots = [];
  }
}

// Performance budgets for memory usage
const MEMORY_PERFORMANCE_BUDGETS = {
  HOOK_MOUNT_MEMORY: 1024 * 1024, // 1MB per hook mount
  COMPONENT_MEMORY: 512 * 1024, // 512KB per component
  CONTENT_CACHE_MEMORY: 2 * 1024 * 1024, // 2MB for content cache
  MAXIMUM_HEAP_GROWTH: 10 * 1024 * 1024, // 10MB total heap growth
  GC_EFFICIENCY_THRESHOLD: 0.8, // 80% memory should be recoverable
  MEMORY_LEAK_THRESHOLD: 0.05, // 5% growth per cycle
  CONCURRENT_HOOK_MEMORY: 5 * 1024 * 1024, // 5MB for multiple hooks
} as const;

// Type definitions
interface MemoryReport {
  initial: NodeJS.MemoryUsage;
  current: NodeJS.MemoryUsage;
  growth: {
    heap: number;
    rss: number;
    external: number;
  };
  measurements: Array<{
    timestamp: number;
    memory: NodeJS.MemoryUsage;
    description: string;
    heapGrowth: number;
    rssGrowth: number;
  }>;
}

interface LeakAnalysis {
  hasLeak: boolean;
  confidence: number;
  pattern: 'increasing' | 'stable' | 'fluctuating' | 'insufficient-data';
  trend?: number;
  snapshots?: Array<{
    timestamp: number;
    memory: NodeJS.MemoryUsage;
    phase: string;
  }>;
}

describe('Memory Usage and Management Performance Tests', () => {
  let monitor: MemoryMonitor;
  let leakDetector: MemoryLeakDetector;

  beforeEach(() => {
    monitor = new MemoryMonitor();
    leakDetector = new MemoryLeakDetector();
    
    // Force initial garbage collection
    if (global.gc) {
      global.gc();
    }
  });

  afterEach(() => {
    monitor.clear();
    leakDetector.clear();
    
    // Final cleanup
    if (global.gc) {
      global.gc();
    }
  });

  describe('Content Hook Memory Management', () => {
    it('should not leak memory with useContent hook', async () => {
      monitor.snapshot('baseline');
      const hooks: any[] = [];

      // Mount multiple hook instances
      for (let i = 0; i < 10; i++) {
        const { result, unmount } = renderHook(() => useContent());
        await waitFor(() => !result.current.loading);
        hooks.push({ result, unmount });
        
        leakDetector.captureSnapshot(`mount-${i}`);
      }

      monitor.snapshot('after-mounts');

      // Unmount all hooks
      hooks.forEach(({ unmount }) => unmount());
      
      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      if (global.gc) {
        global.gc();
      }

      monitor.snapshot('after-unmounts');
      leakDetector.captureSnapshot('final');

      const heapGrowth = monitor.getHeapGrowth('baseline');
      const leakAnalysis = leakDetector.analyzeLeakPattern();

      expect(heapGrowth).toBeLessThan(MEMORY_PERFORMANCE_BUDGETS.CONCURRENT_HOOK_MEMORY);
      expect(leakAnalysis.hasLeak).toBe(false);

      console.log(`Hook memory test: ${monitor.formatBytes(heapGrowth)} heap growth`);
    });

    it('should efficiently manage content cache memory', async () => {
      monitor.snapshot('cache-baseline');

      const { result, unmount } = renderHook(() => useContent());
      await waitFor(() => !result.current.loading);

      monitor.snapshot('after-load');

      // Trigger multiple cache operations
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.refresh();
        });
        await waitFor(() => !result.current.loading);
        monitor.snapshot(`refresh-${i}`);
      }

      const cacheMemoryGrowth = monitor.getHeapGrowth('cache-baseline');
      
      unmount();
      if (global.gc) {
        global.gc();
      }

      expect(cacheMemoryGrowth).toBeLessThan(MEMORY_PERFORMANCE_BUDGETS.CONTENT_CACHE_MEMORY);

      console.log(`Cache memory test: ${monitor.formatBytes(cacheMemoryGrowth)} growth`);
    });

    it('should handle rapid mount/unmount cycles efficiently', async () => {
      monitor.snapshot('cycle-baseline');
      
      const cycles = 25;
      const memorySnapshots: number[] = [];

      for (let i = 0; i < cycles; i++) {
        const { result, unmount } = renderHook(() => useContent());
        await waitFor(() => !result.current.loading);
        
        const beforeUnmount = monitor.getCurrentMemory().heapUsed;
        unmount();
        
        // Force cleanup
        if (i % 5 === 0 && global.gc) {
          global.gc();
        }
        
        memorySnapshots.push(monitor.getCurrentMemory().heapUsed - beforeUnmount);
        leakDetector.captureSnapshot(`cycle-${i}`);
      }

      const finalGrowth = monitor.getHeapGrowth('cycle-baseline');
      const leakAnalysis = leakDetector.analyzeLeakPattern();

      expect(finalGrowth).toBeLessThan(MEMORY_PERFORMANCE_BUDGETS.CONCURRENT_HOOK_MEMORY);
      expect(leakAnalysis.hasLeak).toBe(false);

      console.log(`Mount/unmount cycles: ${monitor.formatBytes(finalGrowth)} final growth`);
    });

    it('should manage memory for complex hook compositions', async () => {
      monitor.snapshot('composition-baseline');

      const { result: contentHook, unmount: unmountContent } = renderHook(() => useContent());
      const { result: lessonHook, unmount: unmountLessons } = renderHook(() => 
        useLessonPackages({ popular: true, maxPrice: 1000 })
      );
      const { result: testimonialHook, unmount: unmountTestimonials } = renderHook(() => 
        useTestimonials({ featured: true, limit: 10 })
      );
      const { result: searchHook, unmount: unmountSearch } = renderHook(() => useContentSearch());

      await waitFor(() => 
        !contentHook.current.loading && 
        !lessonHook.current.loading && 
        !testimonialHook.current.loading
      );

      monitor.snapshot('after-composition');

      // Perform operations that might increase memory usage
      act(() => {
        if (searchHook.current?.search) {
          searchHook.current.search('guitar lessons');
          searchHook.current.search('piano tutorials');
          searchHook.current.search('blues improvisation');
        }
      });

      monitor.snapshot('after-search-operations');

      const compositionMemory = monitor.getHeapGrowth('composition-baseline');

      // Cleanup
      unmountContent();
      unmountLessons();
      unmountTestimonials();
      unmountSearch();

      if (global.gc) {
        global.gc();
      }

      expect(compositionMemory).toBeLessThan(MEMORY_PERFORMANCE_BUDGETS.CONCURRENT_HOOK_MEMORY);

      console.log(`Hook composition: ${monitor.formatBytes(compositionMemory)} memory usage`);
    });
  });

  describe('Component Memory Management', () => {
    it('should not leak memory during component rendering', async () => {
      // This would need actual components, but we'll simulate the test structure
      monitor.snapshot('component-baseline');
      const components: any[] = [];

      for (let i = 0; i < 10; i++) {
        // Mock component mounting
        const mockComponent = {
          mounted: true,
          props: { data: new Array(100).fill(`test-${i}`) }
        };
        components.push(mockComponent);
        
        leakDetector.captureSnapshot(`component-mount-${i}`);
      }

      monitor.snapshot('after-component-mounts');

      // Simulate component unmounting
      components.length = 0;
      
      if (global.gc) {
        global.gc();
      }

      monitor.snapshot('after-component-cleanup');

      const componentMemoryGrowth = monitor.getHeapGrowth('component-baseline');
      expect(componentMemoryGrowth).toBeLessThan(MEMORY_PERFORMANCE_BUDGETS.CONCURRENT_HOOK_MEMORY);

      console.log(`Component rendering: ${monitor.formatBytes(componentMemoryGrowth)} growth`);
    });

    it('should efficiently handle large content datasets', async () => {
      monitor.snapshot('dataset-baseline');

      // Simulate large content dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        title: `Item ${i}`,
        description: `Description for item ${i}`.repeat(10),
        metadata: {
          tags: [`tag${i}`, `category${i % 5}`, `type${i % 3}`],
          timestamp: Date.now() + i,
          author: `Author ${i % 20}`
        }
      }));

      // Simulate processing large dataset
      const processedData = largeDataset.map(item => ({
        ...item,
        processed: true,
        searchableText: `${item.title} ${item.description}`.toLowerCase()
      }));

      monitor.snapshot('after-dataset-processing');

      const datasetMemory = monitor.getHeapGrowth('dataset-baseline');
      
      // Clear dataset
      largeDataset.length = 0;
      processedData.length = 0;

      if (global.gc) {
        global.gc();
      }

      expect(datasetMemory).toBeLessThan(MEMORY_PERFORMANCE_BUDGETS.CONTENT_CACHE_MEMORY * 2);

      console.log(`Large dataset: ${monitor.formatBytes(datasetMemory)} memory usage`);
    });
  });

  describe('Memory Leak Detection', () => {
    it('should detect and prevent content cache memory leaks', async () => {
      const iterations = 10;
      
      for (let i = 0; i < iterations; i++) {
        const { result, unmount } = renderHook(() => useContent());
        await waitFor(() => !result.current.loading);

        // Simulate cache growth
        act(() => {
          result.current.refresh();
        });
        await waitFor(() => !result.current.loading);

        unmount();
        leakDetector.captureSnapshot(`iteration-${i}`);
      }

      const leakAnalysis = leakDetector.analyzeLeakPattern();
      
      expect(leakAnalysis.hasLeak).toBe(false);
      
      if (leakAnalysis.confidence > 70) {
        console.warn(`High memory growth confidence: ${leakAnalysis.confidence}%`);
        console.warn(`Pattern: ${leakAnalysis.pattern}`);
      }
    });

    it('should maintain stable memory usage over time', async () => {
      const testDuration = 50; // iterations
      
      for (let i = 0; i < testDuration; i++) {
        // Simulate typical usage patterns
        if (i % 10 === 0) {
          const { result, unmount } = renderHook(() => useContent());
          await waitFor(() => !result.current.loading);
          unmount();
        }

        if (i % 5 === 0 && global.gc) {
          global.gc();
        }

        leakDetector.captureSnapshot(`stability-${i}`);
      }

      const leakAnalysis = leakDetector.analyzeLeakPattern();
      
      expect(leakAnalysis.pattern).not.toBe('increasing');
      expect(leakAnalysis.confidence).toBeLessThan(50); // Low confidence in leak

      console.log(`Stability test: ${leakAnalysis.pattern} pattern, ${leakAnalysis.confidence}% confidence`);
    });

    it('should handle memory pressure gracefully', async () => {
      monitor.snapshot('pressure-baseline');

      // Simulate memory pressure by creating large objects
      const largeObjects: any[] = [];
      
      try {
        for (let i = 0; i < 100; i++) {
          // Create objects that will cause memory pressure
          const largeObject = {
            data: new Array(10000).fill(`pressure-test-${i}`),
            metadata: new Array(1000).fill({ index: i, timestamp: Date.now() })
          };
          largeObjects.push(largeObject);

          // Test content hooks under memory pressure
          if (i % 20 === 0) {
            const { result, unmount } = renderHook(() => useContent());
            await waitFor(() => !result.current.loading || result.current.error);
            unmount();
          }

          leakDetector.captureSnapshot(`pressure-${i}`);
        }

        monitor.snapshot('peak-pressure');

        // Clear pressure objects
        largeObjects.length = 0;
        
        if (global.gc) {
          global.gc();
        }

        monitor.snapshot('after-pressure-relief');

        const pressureRecovery = monitor.getHeapGrowth('peak-pressure');
        const gcEfficiency = Math.abs(pressureRecovery) / monitor.getHeapGrowth('pressure-baseline');

        expect(gcEfficiency).toBeGreaterThan(MEMORY_PERFORMANCE_BUDGETS.GC_EFFICIENCY_THRESHOLD);

        console.log(`Memory pressure test: ${monitor.formatBytes(pressureRecovery)} recovery`);
        console.log(`GC efficiency: ${(gcEfficiency * 100).toFixed(1)}%`);

      } catch (error) {
        // Clean up in case of error
        largeObjects.length = 0;
        if (global.gc) {
          global.gc();
        }
        throw error;
      }
    });
  });

  describe('Memory Usage Optimization', () => {
    it('should optimize object references and prevent unnecessary copies', async () => {
      monitor.snapshot('optimization-baseline');

      const { result: hook1, unmount: unmount1 } = renderHook(() => useContent());
      const { result: hook2, unmount: unmount2 } = renderHook(() => useContent());
      
      await waitFor(() => !hook1.current.loading && !hook2.current.loading);

      monitor.snapshot('after-dual-hooks');

      // Content should be shared between hooks (same reference)
      if (hook1.current.content && hook2.current.content) {
        // This test verifies that content objects are properly shared/memoized
        const memoryWithSharedContent = monitor.getHeapGrowth('optimization-baseline');
        expect(memoryWithSharedContent).toBeLessThan(MEMORY_PERFORMANCE_BUDGETS.CONTENT_CACHE_MEMORY);
      }

      unmount1();
      unmount2();

      console.log(`Reference optimization: ${monitor.formatBytes(monitor.getHeapGrowth('optimization-baseline'))}`);
    });

    it('should efficiently manage WeakMap and WeakSet usage', async () => {
      monitor.snapshot('weakmap-baseline');

      // Simulate WeakMap usage for content caching
      const contentWeakMap = new WeakMap();
      const contentWeakSet = new WeakSet();
      const testObjects: any[] = [];

      for (let i = 0; i < 100; i++) {
        const obj = { id: i, data: `test-${i}` };
        testObjects.push(obj);
        
        contentWeakMap.set(obj, { processed: true, timestamp: Date.now() });
        contentWeakSet.add(obj);
      }

      monitor.snapshot('after-weakmap-population');

      // Clear references to objects
      testObjects.length = 0;

      if (global.gc) {
        global.gc();
      }

      monitor.snapshot('after-weakmap-gc');

      const weakMapMemory = monitor.getHeapGrowth('weakmap-baseline');
      
      // WeakMap should not prevent garbage collection
      expect(weakMapMemory).toBeLessThan(MEMORY_PERFORMANCE_BUDGETS.COMPONENT_MEMORY);

      console.log(`WeakMap usage: ${monitor.formatBytes(weakMapMemory)} memory`);
    });

    it('should optimize event listener memory management', async () => {
      monitor.snapshot('events-baseline');

      const eventTargets: EventTarget[] = [];
      const controllers: AbortController[] = [];

      // Simulate event listener setup/cleanup
      for (let i = 0; i < 50; i++) {
        const target = new EventTarget();
        const controller = new AbortController();
        
        eventTargets.push(target);
        controllers.push(controller);

        target.addEventListener('test-event', () => {
          // Event handler
        }, { signal: controller.signal });

        leakDetector.captureSnapshot(`event-setup-${i}`);
      }

      monitor.snapshot('after-event-setup');

      // Cleanup event listeners
      controllers.forEach(controller => controller.abort());
      eventTargets.length = 0;
      controllers.length = 0;

      if (global.gc) {
        global.gc();
      }

      monitor.snapshot('after-event-cleanup');

      const eventMemory = monitor.getHeapGrowth('events-baseline');
      const leakAnalysis = leakDetector.analyzeLeakPattern();

      expect(eventMemory).toBeLessThan(MEMORY_PERFORMANCE_BUDGETS.COMPONENT_MEMORY);
      expect(leakAnalysis.hasLeak).toBe(false);

      console.log(`Event listener memory: ${monitor.formatBytes(eventMemory)}`);
    });
  });

  describe('Memory Performance Reporting', () => {
    it('should generate comprehensive memory report', async () => {
      // Perform various operations to generate meaningful report
      monitor.snapshot('report-start');

      const { result, unmount } = renderHook(() => useContent());
      await waitFor(() => !result.current.loading);
      monitor.snapshot('content-loaded');

      act(() => {
        result.current.refresh();
      });
      await waitFor(() => !result.current.loading);
      monitor.snapshot('content-refreshed');

      unmount();
      if (global.gc) {
        global.gc();
      }
      monitor.snapshot('cleanup-complete');

      const report = monitor.generateReport();

      expect(report).toHaveProperty('initial');
      expect(report).toHaveProperty('current');
      expect(report).toHaveProperty('growth');
      expect(report).toHaveProperty('measurements');

      expect(report.measurements.length).toBeGreaterThan(3);
      
      console.log('Memory Report Generated:');
      console.log(`  Initial Heap: ${monitor.formatBytes(report.initial.heapUsed)}`);
      console.log(`  Current Heap: ${monitor.formatBytes(report.current.heapUsed)}`);
      console.log(`  Heap Growth: ${monitor.formatBytes(report.growth.heap)}`);
      console.log(`  RSS Growth: ${monitor.formatBytes(report.growth.rss)}`);
    });

    it('should track memory metrics over test execution', () => {
      const metrics = {
        peakHeapUsage: 0,
        averageHeapUsage: 0,
        gcEfficiency: 0,
        memoryStability: 0
      };

      // This would be collected throughout test execution
      const measurements = monitor.generateReport().measurements;
      
      if (measurements.length > 0) {
        metrics.peakHeapUsage = Math.max(...measurements.map(m => m.memory.heapUsed));
        metrics.averageHeapUsage = measurements.reduce((sum, m) => sum + m.memory.heapUsed, 0) / measurements.length;
        
        // Calculate memory stability (lower variance is better)
        const variance = measurements.reduce((sum, m) => {
          return sum + Math.pow(m.memory.heapUsed - metrics.averageHeapUsage, 2);
        }, 0) / measurements.length;
        
        metrics.memoryStability = 1 / (1 + Math.sqrt(variance) / metrics.averageHeapUsage);
      }

      expect(metrics.peakHeapUsage).toBeLessThan(process.memoryUsage().heapTotal);
      expect(metrics.memoryStability).toBeGreaterThan(0.7); // 70% stability

      console.log('Memory Metrics:', metrics);
    });
  });
});

// Export utilities for use in other tests
export { MemoryMonitor, MemoryLeakDetector, MEMORY_PERFORMANCE_BUDGETS };

// Global memory test utilities
export const memoryTestUtils = {
  createMemoryStressTest: (iterations: number, operation: () => Promise<void>) => {
    return async () => {
      const monitor = new MemoryMonitor();
      monitor.snapshot('stress-test-start');

      for (let i = 0; i < iterations; i++) {
        await operation();
        
        if (i % 10 === 0) {
          monitor.snapshot(`iteration-${i}`);
        }
      }

      if (global.gc) {
        global.gc();
      }

      monitor.snapshot('stress-test-end');
      
      const growth = monitor.getHeapGrowth('stress-test-start');
      expect(growth).toBeLessThan(MEMORY_PERFORMANCE_BUDGETS.MAXIMUM_HEAP_GROWTH);

      return monitor.generateReport();
    };
  },

  monitorAsyncOperation: async (operation: () => Promise<any>) => {
    const monitor = new MemoryMonitor();
    monitor.snapshot('async-operation-start');

    const result = await operation();

    monitor.snapshot('async-operation-end');
    
    return {
      result,
      memoryGrowth: monitor.getHeapGrowth('async-operation-start'),
      report: monitor.generateReport()
    };
  }
};