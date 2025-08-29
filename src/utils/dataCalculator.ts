/**
 * Unified Data Calculation Utilities
 * Centralized system for all dynamic calculations across the platform
 */

import { globalCache, CacheKeys, performanceMonitor } from './cache'
import {
  Testimonial,
  TestimonialStats,
  LessonPackage,
  EnhancedPerformanceData,
  GeneralStats,
} from '@/types/content'

// TTL Constants (in milliseconds)
export const CacheTTL = {
  SHORT: 60000, // 1 minute
  MEDIUM: 300000, // 5 minutes
  LONG: 900000, // 15 minutes
  EXTENDED: 3600000, // 1 hour
} as const

/**
 * Base calculator class with common functionality
 */
abstract class BaseCalculator {
  protected cache = globalCache
  protected monitor = performanceMonitor

  protected async executeWithMetrics<T>(
    operation: () => T | Promise<T>,
    cacheKey?: string
  ): Promise<T> {
    const startTime = Date.now()

    try {
      // Check cache first if key provided
      if (cacheKey) {
        const cached = this.cache.get<T>(cacheKey)
        if (cached !== null) {
          this.monitor.recordCacheHit()
          return cached
        }
        this.monitor.recordCacheMiss()
      }

      // Execute calculation
      const result = await operation()

      // Record performance
      const duration = Date.now() - startTime
      this.monitor.recordCalculation(duration)

      // Cache result if key provided
      if (cacheKey) {
        this.cache.set(cacheKey, result, CacheTTL.MEDIUM)
      }

      return result
    } catch (error) {
      console.error(`Calculation error: ${error}`)
      throw error
    }
  }

  protected generateDataHash(data: unknown[]): string {
    return JSON.stringify(data)
      .split('')
      .reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0)
        return a & a
      }, 0)
      .toString()
  }
}

/**
 * Testimonial calculation utilities
 */
export class TestimonialCalculator extends BaseCalculator {
  async calculateStats(testimonials: Testimonial[]): Promise<TestimonialStats> {
    const dataHash = this.generateDataHash(testimonials)
    const cacheKey = CacheKeys.testimonialStats(dataHash)

    return this.executeWithMetrics(async () => {
      const total = testimonials.length

      if (total === 0) {
        return this.getEmptyStats()
      }

      const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0)
      const averageRating = Math.round((totalRating / total) * 10) / 10

      // Calculate service-specific stats
      const serviceStats = this.calculateServiceBreakdown(testimonials)

      // Calculate additional metrics
      const featured = testimonials.filter(t => t.featured).length
      const verified = testimonials.filter(t => t.verified).length

      const result: TestimonialStats = {
        total,
        averageRating,
        byService: serviceStats,
        featured,
        verified,
      }

      return result
    }, cacheKey)
  }

  private getEmptyStats(): TestimonialStats {
    return {
      total: 0,
      averageRating: 0,
      byService: {
        performance: { count: 0, percentage: 0, averageRating: 0 },
        teaching: { count: 0, percentage: 0, averageRating: 0 },
        collaboration: { count: 0, percentage: 0, averageRating: 0 },
      },
      featured: 0,
      verified: 0,
    }
  }

  private calculateServiceBreakdown(testimonials: Testimonial[]) {
    const services = ['performance', 'teaching', 'collaboration'] as const
    const result: Record<
      string,
      { count: number; percentage: number; averageRating: number }
    > = {}

    services.forEach(service => {
      const serviceTestimonials = testimonials.filter(
        t => t.service === service
      )
      const count = serviceTestimonials.length
      const percentage =
        testimonials.length > 0
          ? Math.round((count / testimonials.length) * 100)
          : 0
      const averageRating =
        count > 0
          ? Math.round(
              (serviceTestimonials.reduce((sum, t) => sum + t.rating, 0) /
                count) *
                10
            ) / 10
          : 0

      result[service] = { count, percentage, averageRating }
    })

    return result
  }

  clearCache(): void {
    // Clear testimonial-related cache entries
    globalCache.clear() // For now, clear all - can be more specific later
  }
}

/**
 * Performance data calculation utilities
 */
export class PerformanceCalculator extends BaseCalculator {
  async calculatePerformanceData(
    rawData: Record<string, unknown>
  ): Promise<EnhancedPerformanceData> {
    const dataHash = this.generateDataHash([rawData])
    const cacheKey = CacheKeys.performanceData(dataHash)

    return this.executeWithMetrics(async () => {
      // Calculate total performances
      const galleryItems =
        ((rawData?.gallery as Record<string, unknown>)?.items as Record<
          string,
          unknown
        >[]) || []

      const totalPerformances = galleryItems.length

      // Calculate experience years (dynamic)
      const currentYear = new Date().getFullYear()
      const startYear = 2015 // When Rrish started professional performances
      const yearsActive = currentYear - startYear

      // Calculate venue count from gallery locations
      const locations = galleryItems.map(item =>
        (item?.location as string)?.toLowerCase()
      )
      const uniqueVenues = new Set(locations.filter(Boolean)).size

      // Geographic reach - extract cities from locations
      const cities = locations
        .map(loc => loc?.split(',')[0]?.trim())
        .filter(Boolean)
      const uniqueCities = new Set(cities).size

      // Calculate engagement metrics (estimated from data quality)
      const avgEngagement = Math.round(totalPerformances * 12.5) // Estimate

      return {
        totalPerformances,
        yearsActive,
        uniqueVenues,
        uniqueCities,
        avgEngagement,
        lastUpdated: new Date().toISOString(),
      } as EnhancedPerformanceData
    }, cacheKey)
  }
}

/**
 * Statistical calculations
 */
export class StatsCalculator extends BaseCalculator {
  async calculateGeneralStats(
    testimonials: Testimonial[],
    lessonPackages: LessonPackage[],
    performanceData: Record<string, unknown>
  ): Promise<GeneralStats> {
    const dataHash = this.generateDataHash([
      testimonials,
      lessonPackages,
      performanceData,
    ])
    const cacheKey = CacheKeys.generalStats(dataHash)

    return this.executeWithMetrics(async () => {
      // Calculate basic metrics
      const totalTestimonials = testimonials.length
      const averageRating =
        testimonials.length > 0
          ? testimonials.reduce((sum, t) => sum + t.rating, 0) /
            testimonials.length
          : 0

      return {
        totalTestimonials,
        averageRating: Math.round(averageRating * 10) / 10,
        totalPackages: lessonPackages.length,
        performancesCount: 80, // This would be calculated from performance data
        studentsCount: 150, // This would be calculated from actual data
        yearsExperience: new Date().getFullYear() - 2015,
        lastUpdated: new Date().toISOString(),
      }
    }, cacheKey)
  }
}

/**
 * Pricing calculations
 */
export class PricingCalculator extends BaseCalculator {
  async calculatePackagePricing(
    lessonPackage: LessonPackage,
    customizations?: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const dataHash = this.generateDataHash([lessonPackage, customizations])
    const cacheKey = CacheKeys.pricingCalculations(lessonPackage.id)

    return this.executeWithMetrics(async () => {
      // Basic package calculations would go here
      const basePrice = lessonPackage.price || 0
      const duration = lessonPackage.duration || 60

      return {
        basePrice,
        pricePerHour: Math.round((basePrice / duration) * 60),
        withCustomizations: customizations ? basePrice * 1.1 : basePrice, // 10% surcharge for customizations
        currency: 'AUD',
        lastCalculated: new Date().toISOString(),
      }
    }, cacheKey)
  }
}

/**
 * Main calculator class that orchestrates all calculations
 */
export class DataCalculator {
  private testimonialCalc = new TestimonialCalculator()
  private performanceCalc = new PerformanceCalculator()
  private statsCalc = new StatsCalculator()
  private pricingCalc = new PricingCalculator()

  // Testimonial calculations
  async calculateTestimonialStats(
    testimonials: Testimonial[]
  ): Promise<TestimonialStats> {
    return this.testimonialCalc.calculateStats(testimonials)
  }

  // Performance calculations
  async calculatePerformanceData(
    rawData: Record<string, unknown>
  ): Promise<EnhancedPerformanceData> {
    return this.performanceCalc.calculatePerformanceData(rawData)
  }

  // General stats calculations
  async calculateGeneralStats(
    testimonials: Testimonial[],
    lessonPackages: LessonPackage[],
    performanceData: Record<string, unknown>
  ): Promise<GeneralStats> {
    return this.statsCalc.calculateGeneralStats(
      testimonials,
      lessonPackages,
      performanceData
    )
  }

  // Pricing calculations
  async calculatePackagePricing(
    lessonPackage: LessonPackage,
    customizations?: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return this.pricingCalc.calculatePackagePricing(
      lessonPackage,
      customizations
    )
  }

  // Utility methods
  getPerformanceMetrics() {
    return {
      monitor: performanceMonitor.getMetrics(),
      cache: globalCache.getStats(),
      hitRate: performanceMonitor.getHitRate(),
    }
  }

  clearCache(category?: string) {
    performanceMonitor.recordCleanup()
    return true
  }
}

/**
 * Synchronous testimonial stats calculation for React hooks
 * This is a lightweight version that skips caching for immediate use in hooks
 */
export function calculateTestimonialStats(
  testimonials: Testimonial[]
): TestimonialStats {
  const total = testimonials.length

  if (total === 0) {
    return {
      total: 0,
      averageRating: 0,
      byService: {
        performance: { count: 0, percentage: 0, averageRating: 0 },
        teaching: { count: 0, percentage: 0, averageRating: 0 },
        collaboration: { count: 0, percentage: 0, averageRating: 0 },
      },
      featured: 0,
      verified: 0,
    }
  }

  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0)
  const averageRating = Math.round((totalRating / total) * 10) / 10

  // Calculate service-specific stats
  const services = ['performance', 'teaching', 'collaboration'] as const
  const byService: Record<
    string,
    { count: number; percentage: number; averageRating: number }
  > = {}

  services.forEach(service => {
    const serviceTestimonials = testimonials.filter(t => t.service === service)
    const count = serviceTestimonials.length
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0
    const serviceRating =
      count > 0
        ? Math.round(
            (serviceTestimonials.reduce((sum, t) => sum + t.rating, 0) /
              count) *
              10
          ) / 10
        : 0

    byService[service] = { count, percentage, averageRating: serviceRating }
  })

  // Calculate additional metrics
  const featured = testimonials.filter(t => t.featured).length
  const verified = testimonials.filter(t => t.verified).length

  return {
    total,
    averageRating,
    byService,
    featured,
    verified,
  }
}

// Export singleton instance
export const dataCalculator = new DataCalculator()

// Export cache utilities for external use
export { globalCache, CacheKeys, performanceMonitor } from './cache'
