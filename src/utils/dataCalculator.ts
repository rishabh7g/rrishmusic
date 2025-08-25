/**
 * Unified Data Calculation Utilities
 * Centralized system for all dynamic calculations across the platform
 */

import { 
  globalCache, 
  CacheKeys, 
  performanceMonitor,
} from './cache';
import { 
  Testimonial, 
  TestimonialStats, 
  LessonPackage,
  EnhancedPerformanceData,
  GeneralStats
} from '@/types/content';

// TTL Constants (in milliseconds)
export const CacheTTL = {
  SHORT: 60000,      // 1 minute
  MEDIUM: 300000,    // 5 minutes  
  LONG: 900000,      // 15 minutes
  EXTENDED: 3600000  // 1 hour
} as const;

/**
 * Base calculator class with common functionality
 */
abstract class BaseCalculator {
  protected cache = globalCache;
  protected monitor = performanceMonitor;

  protected async executeWithMetrics<T>(
    operation: () => T | Promise<T>,
    cacheKey?: string
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      // Check cache first if key provided
      if (cacheKey) {
        const cached = this.cache.get<T>(cacheKey);
        if (cached !== null) {
          this.monitor.recordCacheHit();
          return cached;
        }
        this.monitor.recordCacheMiss();
      }

      // Execute calculation
      const result = await operation();
      
      // Record performance
      const duration = Date.now() - startTime;
      this.monitor.recordCalculation(duration);

      return result;
    } catch (error) {
      console.error('Calculation error:', error);
      throw error;
    }
  }

  protected generateDataHash(data: unknown[]): string {
    return btoa(JSON.stringify(data.map(item => 
      typeof item === 'object' ? JSON.stringify(item) : String(item)
    ))).slice(0, 8);
  }
}

/**
 * Testimonial calculation utilities
 */
export class TestimonialCalculator extends BaseCalculator {
  async calculateStats(testimonials: Testimonial[]): Promise<TestimonialStats> {
    const dataHash = this.generateDataHash(testimonials);
    const cacheKey = CacheKeys.testimonialStats(dataHash);

    return this.executeWithMetrics(async () => {
      const total = testimonials.length;
      
      if (total === 0) {
        return this.getEmptyStats();
      }

      const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
      const averageRating = Math.round((totalRating / total) * 10) / 10;

      // Calculate service-specific stats
      const serviceStats = this.calculateServiceBreakdown(testimonials);
      
      // Calculate additional metrics
      const featured = testimonials.filter(t => t.featured).length;
      const verified = testimonials.filter(t => t.verified).length;

      const result: TestimonialStats = {
        total,
        averageRating,
        byService: serviceStats,
        featured,
        verified
      };

      // Cache the result
      this.cache.set(cacheKey, result, CacheTTL.MEDIUM);
      
      return result;
    }, cacheKey);
  }

  private getEmptyStats(): TestimonialStats {
    return {
      total: 0,
      averageRating: 0,
      byService: {
        performance: { count: 0, percentage: 0, averageRating: 0 },
        teaching: { count: 0, percentage: 0, averageRating: 0 },
        collaboration: { count: 0, percentage: 0, averageRating: 0 }
      },
      featured: 0,
      verified: 0
    };
  }

  private calculateServiceBreakdown(testimonials: Testimonial[]) {
    const services = ['performance', 'teaching', 'collaboration'] as const;
    const result: Record<string, { count: number; percentage: number; averageRating: number; }> = {};

    services.forEach(service => {
      const serviceTestimonials = testimonials.filter(t => t.service === service);
      const count = serviceTestimonials.length;
      const percentage = testimonials.length > 0 ? Math.round((count / testimonials.length) * 100) : 0;
      const averageRating = count > 0 
        ? Math.round((serviceTestimonials.reduce((sum, t) => sum + t.rating, 0) / count) * 10) / 10 
        : 0;

      result[service] = { count, percentage, averageRating };
    });

    return result;
  }

  clearCache(): void {
    // Clear testimonial-related cache entries
    globalCache.clear(); // For now, clear all - can be more specific later
  }
}

/**
 * Performance data calculation utilities
 */
export class PerformanceCalculator extends BaseCalculator {
  async calculatePerformanceData(rawData: Record<string, unknown>): Promise<EnhancedPerformanceData> {
    const dataHash = this.generateDataHash([rawData]);
    const cacheKey = CacheKeys.performanceData(dataHash);

    return this.executeWithMetrics(async () => {
      // Calculate total performances
      const galleryItems = (rawData?.gallery as Record<string, unknown>)?.items as Record<string, unknown>[] || [];
      const totalPerformances = galleryItems.length;

      // Calculate venue count
      const uniqueVenues = new Set(
        galleryItems
          .map((item: Record<string, unknown>) => item.venue)
          .filter((venue: unknown) => venue)
      ).size;

      // Calculate genre distribution
      const genreDistribution = this.calculateGenreDistribution(galleryItems);

      // Calculate year range
      const years = galleryItems
        .map((item: Record<string, unknown>) => new Date((item.date as string)).getFullYear())
        .filter((year: number) => !isNaN(year));
      
      const yearRange = years.length > 0 
        ? { start: Math.min(...years), end: Math.max(...years) }
        : null;

      const result: EnhancedPerformanceData = {
        ...rawData,
        calculatedMetrics: {
          totalPerformances,
          uniqueVenues,
          genreDistribution,
          yearRange,
          averagePerformancesPerYear: yearRange 
            ? Math.round(totalPerformances / (yearRange.end - yearRange.start + 1))
            : 0
        }
      };

      // Cache the result
      this.cache.set(cacheKey, result, CacheTTL.LONG);

      return result;
    }, cacheKey);
  }

  private calculateGenreDistribution(items: Record<string, unknown>[]) {
    const genreCounts: Record<string, number> = {};
    
    items.forEach((item: Record<string, unknown>) => {
      const genre = (item.genre as string) || 'other';
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    return genreCounts;
  }

  clearCache(): void {
    globalCache.clear();
  }
}

/**
 * General statistics calculation utilities
 */
export class StatsCalculator extends BaseCalculator {
  async calculateGeneralStats(): Promise<GeneralStats> {
    const cacheKey = CacheKeys.generalStats();

    return this.executeWithMetrics(async () => {
      // These would typically come from various data sources
      // For now, implementing basic calculation structure
      
      const currentYear = new Date().getFullYear();
      const yearsActive = currentYear - 2015; // Assuming start year 2015

      const result: GeneralStats = {
        studentsCount: 150, // This would be calculated from actual data
        yearsExperience: yearsActive,
        successStories: 45, // This would be calculated from testimonials/case studies
        performancesCount: 80, // This would be calculated from performance data
        collaborationsCount: 25, // This would be calculated from collaboration data
        lastUpdated: new Date().toISOString()
      };

      // Cache the result
      this.cache.set(cacheKey, result, CacheTTL.EXTENDED);

      return result;
    }, cacheKey);
  }

  clearCache(): void {
    globalCache.clear();
  }
}

/**
 * Pricing calculation utilities
 */
export class PricingCalculator extends BaseCalculator {
  async calculateLessonPackagePricing(lessonPackage: LessonPackage): Promise<Record<string, unknown>> {
    const cacheKey = CacheKeys.pricingCalculations(lessonPackage.id);

    return this.executeWithMetrics(async () => {
      const basePrice = lessonPackage.price;
      const discountPercent = lessonPackage.discount || 0;
      const discountAmount = (basePrice * discountPercent) / 100;
      const finalPrice = basePrice - discountAmount;

      // Calculate per-lesson cost if sessions specified
      const perLessonCost = lessonPackage.sessions 
        ? Math.round((finalPrice / lessonPackage.sessions) * 100) / 100
        : null;

      const result = {
        basePrice,
        discount: {
          percent: discountPercent,
          amount: discountAmount
        },
        finalPrice,
        perLessonCost,
        savings: discountAmount,
        formatted: {
          basePrice: this.formatPrice(basePrice),
          finalPrice: this.formatPrice(finalPrice),
          savings: this.formatPrice(discountAmount),
          perLessonCost: perLessonCost ? this.formatPrice(perLessonCost) : null
        }
      };

      // Cache the result
      this.cache.set(cacheKey, result, CacheTTL.MEDIUM);

      return result;
    }, cacheKey);
  }

  private formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  clearCache(): void {
    globalCache.clear();
  }
}

/**
 * Main DataCalculator class that orchestrates all calculations
 */
export class DataCalculator {
  private testimonialCalc = new TestimonialCalculator();
  private performanceCalc = new PerformanceCalculator();
  private statsCalc = new StatsCalculator();
  private pricingCalc = new PricingCalculator();

  // Testimonial calculations
  async calculateTestimonialStats(testimonials: Testimonial[]): Promise<TestimonialStats> {
    return this.testimonialCalc.calculateStats(testimonials);
  }

  // Performance calculations
  async calculatePerformanceData(rawData: Record<string, unknown>): Promise<EnhancedPerformanceData> {
    return this.performanceCalc.calculatePerformanceData(rawData);
  }

  // General stats calculations
  async calculateGeneralStats(): Promise<GeneralStats> {
    return this.statsCalc.calculateGeneralStats();
  }

  // Pricing calculations
  async calculateLessonPackagePricing(lessonPackage: LessonPackage): Promise<Record<string, unknown>> {
    return this.pricingCalc.calculateLessonPackagePricing(lessonPackage);
  }

  // Cache management
  clearAllCaches(): void {
    globalCache.clear();
    performanceMonitor.reset();
  }

  // Performance monitoring
  getPerformanceMetrics() {
    return {
      monitor: performanceMonitor.getMetrics(),
      cache: globalCache.getStats(),
      hitRate: performanceMonitor.getHitRate()
    };
  }

  // Cleanup expired cache entries
  cleanup(): number {
    const cleared = globalCache.cleanup();
    performanceMonitor.recordCleanup();
    return cleared;
  }
}

// Export singleton instance
export const dataCalculator = new DataCalculator();


// Export cache utilities for external use
export { globalCache, CacheKeys, performanceMonitor } from './cache';