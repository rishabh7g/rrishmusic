/**
 * Unit Tests for Data Calculator Utilities
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { 
  dataCalculator,
  TestimonialCalculator,
  PerformanceCalculator,
  StatsCalculator,
  PricingCalculator,
  globalCache,
  performanceMonitor
} from '../dataCalculator';
import { Testimonial, LessonPackage } from '@/types/content';

// Mock data
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Doe',
    text: 'Excellent teaching!',
    rating: 5,
    service: 'teaching',
    featured: true,
    verified: true
  },
  {
    id: '2', 
    name: 'Jane Smith',
    text: 'Amazing performance!',
    rating: 4,
    service: 'performance',
    featured: false,
    verified: true
  },
  {
    id: '3',
    name: 'Bob Wilson',
    text: 'Great collaboration!',
    rating: 5,
    service: 'collaboration',
    featured: true,
    verified: false
  }
];

const mockLessonPackage: LessonPackage = {
  id: 'basic',
  name: 'Basic Package',
  description: 'Basic lesson package',
  sessions: 4,
  duration: 60,
  features: ['Feature 1', 'Feature 2'],
  popular: false,
  price: 200,
  discount: 10
};

const mockPerformanceData = {
  gallery: {
    items: [
      {
        id: '1',
        title: 'Wedding Performance',
        venue: 'Grand Hotel',
        date: '2023-06-15',
        genre: 'acoustic',
        type: 'wedding'
      },
      {
        id: '2', 
        title: 'Corporate Event',
        venue: 'Business Center',
        date: '2023-07-20',
        genre: 'jazz',
        type: 'corporate'
      },
      {
        id: '3',
        title: 'Private Party',
        venue: 'Private Residence',
        date: '2024-01-10',
        genre: 'acoustic',
        type: 'private'
      }
    ]
  }
};

describe('Cache System', () => {
  beforeEach(() => {
    globalCache.clear();
    performanceMonitor.reset();
  });

  test('should cache and retrieve data correctly', () => {
    const testData = { test: 'data' };
    const key = 'test-key';

    globalCache.set(key, testData, 1000);
    const retrieved = globalCache.get(key);

    expect(retrieved).toEqual(testData);
  });

  test('should handle cache expiration', async () => {
    const testData = { test: 'data' };
    const key = 'test-key';

    globalCache.set(key, testData, 50); // 50ms TTL
    
    // Should be available immediately
    expect(globalCache.get(key)).toEqual(testData);
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Should be expired
    expect(globalCache.get(key)).toBeNull();
  });

  test('should track cache statistics', () => {
    globalCache.set('key1', 'data1', 1000);
    globalCache.set('key2', 'data2', 1000);
    
    const stats = globalCache.getStats();
    expect(stats.size).toBe(2);
    expect(stats.expired).toBe(0);
  });

  test('should cleanup expired entries', async () => {
    globalCache.set('key1', 'data1', 50); // Short TTL
    globalCache.set('key2', 'data2', 10000); // Long TTL
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const cleared = globalCache.cleanup();
    expect(cleared).toBe(1);
    expect(globalCache.getStats().size).toBe(1);
  });
});

describe('TestimonialCalculator', () => {
  let calculator: TestimonialCalculator;

  beforeEach(() => {
    calculator = new TestimonialCalculator();
    globalCache.clear();
    performanceMonitor.reset();
  });

  test('should calculate testimonial stats correctly', async () => {
    const stats = await calculator.calculateStats(mockTestimonials);

    expect(stats.total).toBe(3);
    expect(stats.averageRating).toBe(4.7);
    expect(stats.featured).toBe(2);
    expect(stats.verified).toBe(2);
  });

  test('should calculate service breakdown correctly', async () => {
    const stats = await calculator.calculateStats(mockTestimonials);

    expect(stats.byService.teaching.count).toBe(1);
    expect(stats.byService.teaching.percentage).toBe(33);
    expect(stats.byService.teaching.averageRating).toBe(5);
    
    expect(stats.byService.performance.count).toBe(1);
    expect(stats.byService.performance.percentage).toBe(33);
    expect(stats.byService.performance.averageRating).toBe(4);
    
    expect(stats.byService.collaboration.count).toBe(1);
    expect(stats.byService.collaboration.percentage).toBe(33);
    expect(stats.byService.collaboration.averageRating).toBe(5);
  });

  test('should handle empty testimonials array', async () => {
    const stats = await calculator.calculateStats([]);

    expect(stats.total).toBe(0);
    expect(stats.averageRating).toBe(0);
    expect(stats.featured).toBe(0);
    expect(stats.verified).toBe(0);
    
    Object.values(stats.byService).forEach(service => {
      expect(service.count).toBe(0);
      expect(service.percentage).toBe(0);
      expect(service.averageRating).toBe(0);
    });
  });

  test('should cache calculation results', async () => {
    // First calculation
    const stats1 = await calculator.calculateStats(mockTestimonials);
    expect(performanceMonitor.getMetrics().cacheMisses).toBe(1);
    
    // Second calculation (should hit cache)
    const stats2 = await calculator.calculateStats(mockTestimonials);
    expect(performanceMonitor.getMetrics().cacheHits).toBe(1);
    expect(stats1).toEqual(stats2);
  });
});

describe('PerformanceCalculator', () => {
  let calculator: PerformanceCalculator;

  beforeEach(() => {
    calculator = new PerformanceCalculator();
    globalCache.clear();
    performanceMonitor.reset();
  });

  test('should calculate performance data correctly', async () => {
    const result = await calculator.calculatePerformanceData(mockPerformanceData);

    expect(result.calculatedMetrics.totalPerformances).toBe(3);
    expect(result.calculatedMetrics.uniqueVenues).toBe(3);
    expect(result.calculatedMetrics.genreDistribution.acoustic).toBe(2);
    expect(result.calculatedMetrics.genreDistribution.jazz).toBe(1);
  });

  test('should calculate year range correctly', async () => {
    const result = await calculator.calculatePerformanceData(mockPerformanceData);

    expect(result.calculatedMetrics.yearRange).toEqual({
      start: 2023,
      end: 2024
    });
    expect(result.calculatedMetrics.averagePerformancesPerYear).toBe(2); // 3 performances over 2 years
  });

  test('should handle empty performance data', async () => {
    const result = await calculator.calculatePerformanceData({ gallery: { items: [] } });

    expect(result.calculatedMetrics.totalPerformances).toBe(0);
    expect(result.calculatedMetrics.uniqueVenues).toBe(0);
    expect(result.calculatedMetrics.yearRange).toBeNull();
    expect(result.calculatedMetrics.averagePerformancesPerYear).toBe(0);
  });
});

describe('StatsCalculator', () => {
  let calculator: StatsCalculator;

  beforeEach(() => {
    calculator = new StatsCalculator();
    globalCache.clear();
    performanceMonitor.reset();
  });

  test('should calculate general stats', async () => {
    const stats = await calculator.calculateGeneralStats();

    expect(stats.studentsCount).toBeGreaterThan(0);
    expect(stats.yearsExperience).toBeGreaterThan(0);
    expect(stats.successStories).toBeGreaterThan(0);
    expect(stats.performancesCount).toBeGreaterThan(0);
    expect(stats.collaborationsCount).toBeGreaterThan(0);
    expect(stats.lastUpdated).toBeDefined();
  });

  test('should calculate years experience based on current year', async () => {
    const stats = await calculator.calculateGeneralStats();
    const currentYear = new Date().getFullYear();
    const expectedYears = currentYear - 2015;

    expect(stats.yearsExperience).toBe(expectedYears);
  });
});

describe('PricingCalculator', () => {
  let calculator: PricingCalculator;

  beforeEach(() => {
    calculator = new PricingCalculator();
    globalCache.clear();
    performanceMonitor.reset();
  });

  test('should calculate lesson package pricing correctly', async () => {
    const result = await calculator.calculateLessonPackagePricing(mockLessonPackage);

    expect(result.basePrice).toBe(200);
    expect(result.discount.percent).toBe(10);
    expect(result.discount.amount).toBe(20);
    expect(result.finalPrice).toBe(180);
    expect(result.perLessonCost).toBe(45); // 180 / 4 sessions
    expect(result.savings).toBe(20);
  });

  test('should format prices correctly', async () => {
    const result = await calculator.calculateLessonPackagePricing(mockLessonPackage);

    expect(result.formatted.basePrice).toBe('$200.00');
    expect(result.formatted.finalPrice).toBe('$180.00');
    expect(result.formatted.savings).toBe('$20.00');
    expect(result.formatted.perLessonCost).toBe('$45.00');
  });

  test('should handle packages without discount', async () => {
    const packageWithoutDiscount: LessonPackage = {
      ...mockLessonPackage,
      discount: 0
    };

    const result = await calculator.calculateLessonPackagePricing(packageWithoutDiscount);

    expect(result.discount.percent).toBe(0);
    expect(result.discount.amount).toBe(0);
    expect(result.finalPrice).toBe(200);
    expect(result.savings).toBe(0);
  });

  test('should handle packages without sessions specified', async () => {
    const packageWithoutSessions: LessonPackage = {
      ...mockLessonPackage,
      sessions: 0 // Indicates unlimited
    };

    const result = await calculator.calculateLessonPackagePricing(packageWithoutSessions);

    expect(result.perLessonCost).toBeNull();
    expect(result.formatted.perLessonCost).toBeNull();
  });
});

describe('DataCalculator Integration', () => {
  beforeEach(() => {
    globalCache.clear();
    performanceMonitor.reset();
  });

  test('should provide unified access to all calculators', async () => {
    const testimonialStats = await dataCalculator.calculateTestimonialStats(mockTestimonials);
    const performanceData = await dataCalculator.calculatePerformanceData(mockPerformanceData);
    const generalStats = await dataCalculator.calculateGeneralStats();
    const pricingData = await dataCalculator.calculateLessonPackagePricing(mockLessonPackage);

    expect(testimonialStats.total).toBe(3);
    expect(performanceData.calculatedMetrics.totalPerformances).toBe(3);
    expect(generalStats.studentsCount).toBeGreaterThan(0);
    expect(pricingData.finalPrice).toBe(180);
  });

  test('should provide performance metrics', () => {
    const metrics = dataCalculator.getPerformanceMetrics();

    expect(metrics).toHaveProperty('monitor');
    expect(metrics).toHaveProperty('cache');
    expect(metrics).toHaveProperty('hitRate');
  });

  test('should allow cache management', () => {
    // Add some data to cache
    globalCache.set('test', 'data', 1000);
    expect(globalCache.getStats().size).toBe(1);

    // Clear all caches
    dataCalculator.clearAllCaches();
    expect(globalCache.getStats().size).toBe(0);
  });

  test('should cleanup expired cache entries', async () => {
    // Add short-lived cache entry
    globalCache.set('temp', 'data', 50);
    expect(globalCache.getStats().size).toBe(1);

    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 100));

    // Cleanup
    const cleared = dataCalculator.cleanup();
    expect(cleared).toBe(1);
    expect(globalCache.getStats().size).toBe(0);
  });
});

describe('Performance Monitoring', () => {
  beforeEach(() => {
    performanceMonitor.reset();
  });

  test('should track cache hits and misses', () => {
    performanceMonitor.recordCacheHit();
    performanceMonitor.recordCacheHit();
    performanceMonitor.recordCacheMiss();

    const metrics = performanceMonitor.getMetrics();
    expect(metrics.cacheHits).toBe(2);
    expect(metrics.cacheMisses).toBe(1);
    
    const hitRate = performanceMonitor.getHitRate();
    expect(hitRate).toBeCloseTo(0.667, 2);
  });

  test('should track calculation performance', () => {
    performanceMonitor.recordCalculation(100);
    performanceMonitor.recordCalculation(200);

    const metrics = performanceMonitor.getMetrics();
    expect(metrics.totalCalculations).toBe(2);
    expect(metrics.averageCalculationTime).toBe(150);
  });

  test('should handle reset correctly', () => {
    performanceMonitor.recordCacheHit();
    performanceMonitor.recordCalculation(100);

    let metrics = performanceMonitor.getMetrics();
    expect(metrics.cacheHits).toBe(1);
    expect(metrics.totalCalculations).toBe(1);

    performanceMonitor.reset();

    metrics = performanceMonitor.getMetrics();
    expect(metrics.cacheHits).toBe(0);
    expect(metrics.totalCalculations).toBe(0);
    expect(metrics.averageCalculationTime).toBe(0);
  });
});

describe('Error Handling', () => {
  test('should handle calculation errors gracefully', async () => {
    // Test with invalid data that might cause errors
    const invalidTestimonials = [
      { id: '1', name: 'Test', text: 'Test', rating: 5, service: 'invalid' as 'performance', featured: false }
    ];

    // The calculator should handle this gracefully or throw a meaningful error
    await expect(async () => {
      await dataCalculator.calculateTestimonialStats(invalidTestimonials);
    }).not.toThrow();
  });

  test('should handle empty or null data', async () => {
    const emptyStats = await dataCalculator.calculateTestimonialStats([]);
    expect(emptyStats.total).toBe(0);

    const emptyPerformance = await dataCalculator.calculatePerformanceData({});
    expect(emptyPerformance.calculatedMetrics.totalPerformances).toBe(0);
  });
});