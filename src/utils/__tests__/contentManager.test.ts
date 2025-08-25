/**
 * Unit Tests for Content Manager Integration
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { TestimonialStats } from '@/types/content';
import {
  useContentCalculations,
  calculateTestimonialStats,
  calculatePerformanceData,
  calculateGeneralStats,
  calculateLessonPackagePricing,
  safeCalculation,
  batchCalculations,
  validateCalculationInputs,
  createCalculationError,
  PerformanceUtils
} from '../contentManager';
import { dataCalculator, globalCache } from '../dataCalculator';
import { Testimonial, LessonPackage } from '@/types/content';

// Mock data
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Doe',
    text: 'Great teaching!',
    rating: 5,
    service: 'teaching',
    featured: true,
    verified: true
  }
];

const mockLessonPackage: LessonPackage = {
  id: 'test',
  name: 'Test Package',
  description: 'Test',
  sessions: 4,
  features: ['Test'],
  popular: false,
  price: 100,
  discount: 10
};

describe('useContentCalculations Hook', () => {
  beforeEach(() => {
    globalCache.clear();
  });

  test('should provide all calculation methods', () => {
    const { result } = renderHook(() => useContentCalculations());

    expect(result.current.calculateTestimonialStats).toBeDefined();
    expect(result.current.calculatePerformanceData).toBeDefined();
    expect(result.current.calculateGeneralStats).toBeDefined();
    expect(result.current.calculateLessonPackagePricing).toBeDefined();
    expect(result.current.clearAllCaches).toBeDefined();
    expect(result.current.getPerformanceMetrics).toBeDefined();
    expect(result.current.cleanup).toBeDefined();
  });

  test('should provide access to calculator instances', () => {
    const { result } = renderHook(() => useContentCalculations());

    expect(result.current.calculator).toBe(dataCalculator);
    expect(result.current.cache).toBe(globalCache);
    expect(result.current.monitor).toBeDefined();
  });

  test('should memoize calculation methods', () => {
    const { result, rerender } = renderHook(() => useContentCalculations());
    
    const firstRender = result.current.calculateTestimonialStats;
    rerender();
    const secondRender = result.current.calculateTestimonialStats;

    expect(firstRender).toBe(secondRender);
  });

  test('should execute testimonial calculations', async () => {
    const { result } = renderHook(() => useContentCalculations());

    const stats = await result.current.calculateTestimonialStats(mockTestimonials);
    expect(stats.total).toBe(1);
    expect(stats.averageRating).toBe(5);
  });
});

describe('Backward Compatibility Functions', () => {
  beforeEach(() => {
    globalCache.clear();
  });

  test('calculateTestimonialStats should work as before', async () => {
    const stats = await calculateTestimonialStats(mockTestimonials);
    
    expect(stats.total).toBe(1);
    expect(stats.averageRating).toBe(5);
    expect(stats.byService.teaching.count).toBe(1);
  });

  test('calculatePerformanceData should work as before', async () => {
    const mockData = {
      gallery: { items: [
        { id: '1', venue: 'Test Venue', date: '2023-01-01', genre: 'acoustic' }
      ]}
    };

    const result = await calculatePerformanceData(mockData);
    expect(result.calculatedMetrics.totalPerformances).toBe(1);
  });

  test('calculateGeneralStats should work as before', async () => {
    const stats = await calculateGeneralStats();
    
    expect(stats.studentsCount).toBeGreaterThan(0);
    expect(stats.yearsExperience).toBeGreaterThan(0);
    expect(typeof stats.lastUpdated).toBe('string');
  });

  test('calculateLessonPackagePricing should work as before', async () => {
    const result = await calculateLessonPackagePricing(mockLessonPackage);
    
    expect(result.basePrice).toBe(100);
    expect(result.finalPrice).toBe(90); // 10% discount
    expect(result.formatted.finalPrice).toBe('$90.00');
  });
});

describe('Error Handling Utilities', () => {
  test('createCalculationError should create proper error objects', () => {
    const error = createCalculationError('Test error', 'test_calc', { test: 'data' });

    expect(error.message).toBe('Test error');
    expect(error.calculationType).toBe('test_calc');
    expect(error.inputData).toEqual({ test: 'data' });
    expect(error.timestamp).toBeDefined();
  });

  test('safeCalculation should return result on success', async () => {
    const successFn = vi.fn().mockResolvedValue('success');
    const fallback = 'fallback';

    const result = await safeCalculation(successFn, fallback, 'test');

    expect(result).toBe('success');
    expect(successFn).toHaveBeenCalled();
  });

  test('safeCalculation should return fallback on error', async () => {
    const errorFn = vi.fn().mockRejectedValue(new Error('Test error'));
    const fallback = 'fallback';

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const result = await safeCalculation(errorFn, fallback, 'test');

    expect(result).toBe('fallback');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});

describe('Batch Calculations', () => {
  beforeEach(() => {
    globalCache.clear();
  });

  test('should execute multiple calculations in batch', async () => {
    const calculations = {
      testimonials: () => dataCalculator.calculateTestimonialStats(mockTestimonials),
      pricing: () => dataCalculator.calculateLessonPackagePricing(mockLessonPackage),
      stats: () => dataCalculator.calculateGeneralStats()
    };

    const fallbacks = {
      testimonials: { total: 0, averageRating: 0, byService: { performance: { count: 0, percentage: 0, averageRating: 0 }, teaching: { count: 0, percentage: 0, averageRating: 0 }, collaboration: { count: 0, percentage: 0, averageRating: 0 } }, featured: 0, verified: 0 } ,
      pricing: { basePrice: 0, finalPrice: 0 },
      stats: { studentsCount: 0, yearsExperience: 0, successStories: 0, performancesCount: 0, collaborationsCount: 0, lastUpdated: "" }
    };

    const results = await batchCalculations(calculations, fallbacks);

    expect(results.testimonials.total).toBe(1);
    expect(results.pricing.basePrice).toBe(100);
    expect(results.stats.studentsCount).toBeGreaterThan(0);
  });

  test('should handle partial failures in batch', async () => {
    const calculations = {
      success: () => Promise.resolve('success'),
      failure: () => Promise.reject(new Error('Test error'))
    };

    const fallbacks = {
      success: 'fallback-success',
      failure: 'fallback-failure'
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const results = await batchCalculations(calculations, fallbacks);

    expect(results.success).toBe('success');
    expect(results.failure).toBe('fallback-failure');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});

describe('Validation Utilities', () => {
  test('validateCalculationInputs should pass valid data', () => {
    const validData = [1, 2, 3, 4, 5];
    const validator = (item: number) => item > 0;

    expect(() => {
      validateCalculationInputs(validData, validator, 'Invalid numbers');
    }).not.toThrow();
  });

  test('validateCalculationInputs should throw on invalid data', () => {
    const invalidData = [1, 2, -1, 4, 5];
    const validator = (item: number) => item > 0;

    expect(() => {
      validateCalculationInputs(invalidData, validator, 'Invalid numbers');
    }).toThrow('Invalid numbers: Found 1 invalid items');
  });
});

describe('Performance Utilities', () => {
  test.skip("debounceCalculation should delay execution", async () => {
    const mockFn = vi.fn().mockResolvedValue('result');
    const debouncedFn = PerformanceUtils.debounceCalculation(mockFn, 100);

    // Call multiple times quickly
    const promise1 = debouncedFn('arg1');
    const promise2 = debouncedFn('arg2');
    const promise3 = debouncedFn('arg3');

    // All should resolve to the same result from the last call
    const results = await Promise.all([promise1, promise2, promise3]);
    
    expect(results).toEqual(['result', 'result', 'result']);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('arg3');
  });

  test('throttleCalculation should limit call frequency', async () => {
    const mockFn = vi.fn().mockResolvedValue('result');
    const throttledFn = PerformanceUtils.throttleCalculation(mockFn, 100);

    // First call should execute
    const result1 = await throttledFn('arg1');
    expect(result1).toBe('result');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Immediate second call should be skipped
    const result2 = await throttledFn('arg2');
    expect(result2).toBeNull();
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Wait for throttle period to pass
    await new Promise(resolve => setTimeout(resolve, 150));

    // Third call should execute
    const result3 = await throttledFn('arg3');
    expect(result3).toBe('result');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('memoizeCalculation should cache results', async () => {
    const mockFn = vi.fn().mockResolvedValue('result');
    const keyGenerator = (arg: string) => `key-${arg}`;
    const memoizedFn = PerformanceUtils.memoizeCalculation(mockFn, keyGenerator, 1000);

    // First call should execute function
    const result1 = await memoizedFn('test');
    expect(result1).toBe('result');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Second call with same args should use cache
    const result2 = await memoizedFn('test');
    expect(result2).toBe('result');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Call with different args should execute function again
    const result3 = await memoizedFn('different');
    expect(result3).toBe('result');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe('Integration with React Hooks', () => {
  test('should work with useEffect for data loading', async () => {
    const { result } = renderHook(() => {
      const { calculateTestimonialStats } = useContentCalculations();
      return { calculateTestimonialStats };
    });

    let stats: TestimonialStats | null = null;
    
    await act(async () => {
      stats = await result.current.calculateTestimonialStats(mockTestimonials);
    });

    expect(stats.total).toBe(1);
  });

  test.skip("should work with useState for caching results", async () => {
    const { result } = renderHook(() => {
      const [cachedStats, setCachedStats] = React.useState<TestimonialStats | null>(null);
      const { calculateTestimonialStats } = useContentCalculations();
      
      return {
        cachedStats,
        loadStats: async (): Promise<TestimonialStats> => {
          const stats = await calculateTestimonialStats(mockTestimonials);
          setCachedStats(stats);
          return stats;
        }
      };
    });

    expect(result.current.cachedStats).toBeNull();

    let stats: TestimonialStats | null = null;
    await act(async () => {
      stats = await result.current.loadStats();
    });

    expect(stats.total).toBe(1);
    expect(result.current.cachedStats).toEqual(stats);
  });
});

// Mock React for the integration tests
const React = {
  useState: <T>(initial: T) => {
    let value = initial as T;
    const setValue = (newValue: T) => { value = newValue; };
    return [value, setValue];
  }
};