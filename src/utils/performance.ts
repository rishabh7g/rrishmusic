/**
 * Unified Performance System
 * Combines web performance monitoring, portfolio data calculations, and Core Web Vitals tracking
 */

import { useEffect, useCallback, useRef } from 'react'
import { testimonials as testimonialsData } from '@/content/testimonials.json'
import performanceContent from '@/content/performance.json'
import { Testimonial } from '@/types/content'

// ============================================================================
// WEB PERFORMANCE MONITORING & OPTIMIZATION
// ============================================================================

/**
 * Performance metrics collection
 */
export interface PerformanceMetrics {
  // Core Web Vitals
  FCP?: number // First Contentful Paint
  LCP?: number // Largest Contentful Paint
  FID?: number // First Input Delay
  CLS?: number // Cumulative Layout Shift
  TTFB?: number // Time to First Byte

  // Navigation timing
  domContentLoaded?: number
  loadComplete?: number
  firstPaint?: number

  // Custom metrics
  timeToInteractive?: number
  totalBlockingTime?: number
  pageLoadTime?: number

  // Resource metrics
  imageLoadTime?: number
  scriptLoadTime?: number
  cssLoadTime?: number

  // User interaction metrics
  serviceNavigationTime?: number
  formInteractionTime?: number
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  enableConsoleLogging?: boolean
  enableAnalytics?: boolean
  threshold?: {
    fcp?: number
    lcp?: number
    fid?: number
    cls?: number
    pageLoad?: number
  }
}

/**
 * Extended Performance interface with memory information
 */
interface PerformanceMemory {
  usedJSMemorySize: number
  totalJSMemorySize: number
  jsMemoryLimit: number
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory
}

interface PerformanceEntryWithLayout extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
}

interface PerformanceEntryWithProcessing extends PerformanceEntry {
  processingStart: number
}

/**
 * Generic function type for debounce, throttle, and rafThrottle utilities
 */
type GenericFunction = (...args: unknown[]) => unknown

/**
 * Performance budget checker interface
 */
export interface PerformanceBudget {
  FCP: number // First Contentful Paint (ms)
  LCP: number // Largest Contentful Paint (ms)
  FID: number // First Input Delay (ms)
  CLS: number // Cumulative Layout Shift
  TTFB: number // Time to First Byte (ms)
}

export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  FCP: 1800, // 1.8s
  LCP: 2500, // 2.5s
  FID: 100, // 100ms
  CLS: 0.1, // 0.1
  TTFB: 800, // 800ms
}

/**
 * Comprehensive Performance Monitor Class
 * Combines Core Web Vitals monitoring with custom performance tracking
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}
  private config: PerformanceConfig
  private observers: PerformanceObserver[] = []
  private navigationStartTime: number

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      enableAnalytics: process.env.NODE_ENV === 'production',
      threshold: {
        fcp: 2000, // 2 seconds
        lcp: 2500, // 2.5 seconds
        fid: 100, // 100ms
        cls: 0.1, // 0.1 layout shift score
        pageLoad: 3000, // 3 seconds
      },
      ...config,
    }

    this.navigationStartTime = performance.timeOrigin || Date.now()
    this.initializeMonitoring()
  }

  /**
   * Initialize all performance monitoring
   */
  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return

    // Monitor Core Web Vitals
    this.initializeCoreWebVitals()

    // Monitor navigation timing
    this.initializeNavigationTiming()

    // Monitor resource loading
    this.initializeResourceTiming()

    // Monitor user interactions
    this.initializeInteractionTiming()

    // Set up periodic reporting
    this.setupPeriodicReporting()
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  private initializeCoreWebVitals(): void {
    // First Contentful Paint & First Paint
    this.observePerformanceEntry('paint', entries => {
      const fcpEntry = entries.find(
        entry => entry.name === 'first-contentful-paint'
      )
      if (fcpEntry) {
        this.metrics.FCP = fcpEntry.startTime
        this.logMetric('FCP', fcpEntry.startTime)
      }

      const fpEntry = entries.find(entry => entry.name === 'first-paint')
      if (fpEntry) {
        this.metrics.firstPaint = fpEntry.startTime
      }
    })

    // Largest Contentful Paint
    this.observePerformanceEntry('largest-contentful-paint', entries => {
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        this.metrics.LCP = lastEntry.startTime
        this.logMetric('LCP', lastEntry.startTime)
      }
    })

    // First Input Delay
    this.observePerformanceEntry('first-input', entries => {
      const lastEntry = entries[entries.length - 1]
      if (lastEntry && 'processingStart' in lastEntry) {
        const processingEntry = lastEntry as PerformanceEntryWithProcessing
        this.metrics.FID = processingEntry.processingStart - lastEntry.startTime
        this.logMetric('FID', this.metrics.FID)
      }
    })

    // Cumulative Layout Shift
    this.observePerformanceEntry('layout-shift', entries => {
      let clsValue = 0
      entries.forEach(entry => {
        const layoutEntry = entry as PerformanceEntryWithLayout
        if (!layoutEntry.hadRecentInput) {
          clsValue += layoutEntry.value
        }
      })
      if (clsValue > 0) {
        this.metrics.CLS = clsValue
        this.logMetric('CLS', clsValue)
      }
    })
  }

  /**
   * Initialize navigation timing monitoring
   */
  private initializeNavigationTiming(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.metrics.domContentLoaded = performance.now()
        this.logMetric('DOM Content Loaded', this.metrics.domContentLoaded)
      })
    }

    window.addEventListener('load', () => {
      this.metrics.loadComplete = performance.now()
      this.metrics.pageLoadTime = this.metrics.loadComplete
      this.logMetric('Page Load Complete', this.metrics.loadComplete)
      this.checkThresholds()
    })

    // Calculate TTFB
    try {
      const navigationEntry = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        const ttfb =
          navigationEntry.responseStart - navigationEntry.requestStart
        this.metrics.TTFB = ttfb
        this.logMetric('TTFB', ttfb)
      }
    } catch (error) {
      console.warn('TTFB calculation failed:', error)
    }
  }

  /**
   * Initialize resource timing monitoring
   */
  private initializeResourceTiming(): void {
    this.observePerformanceEntry('resource', entries => {
      entries.forEach((entry: PerformanceEntry) => {
        const resourceEntry = entry as PerformanceResourceTiming
        const duration = resourceEntry.responseEnd - resourceEntry.fetchStart

        if (resourceEntry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          this.metrics.imageLoadTime = Math.max(
            this.metrics.imageLoadTime || 0,
            duration
          )
        } else if (resourceEntry.name.match(/\.js$/i)) {
          this.metrics.scriptLoadTime = Math.max(
            this.metrics.scriptLoadTime || 0,
            duration
          )
        } else if (resourceEntry.name.match(/\.css$/i)) {
          this.metrics.cssLoadTime = Math.max(
            this.metrics.cssLoadTime || 0,
            duration
          )
        }
      })
    })
  }

  /**
   * Initialize user interaction timing
   */
  private initializeInteractionTiming(): void {
    // Track service navigation timing
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement
      if (
        target.id?.startsWith('service-') ||
        target.closest('[id^="service-"]')
      ) {
        const startTime = performance.now()
        requestAnimationFrame(() => {
          this.metrics.serviceNavigationTime = performance.now() - startTime
        })
      }
    })

    // Track form interaction timing
    document.addEventListener('input', event => {
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const startTime = performance.now()
        requestAnimationFrame(() => {
          this.metrics.formInteractionTime = performance.now() - startTime
        })
      }
    })
  }

  /**
   * Helper method to observe performance entries
   */
  private observePerformanceEntry(
    entryType: string,
    callback: (entries: PerformanceEntry[]) => void
  ): void {
    try {
      const observer = new PerformanceObserver(list => {
        callback(list.getEntries())
      })
      observer.observe({ entryTypes: [entryType] })
      this.observers.push(observer)
    } catch (error) {
      console.warn(
        `Performance observer for ${entryType} not supported:`,
        error
      )
    }
  }

  /**
   * Log performance metrics
   */
  private logMetric(name: string, value: number): void {
    if (this.config.enableConsoleLogging) {
      console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`)
    }
  }

  /**
   * Check if metrics meet performance thresholds
   */
  private checkThresholds(): void {
    const { threshold } = this.config
    const issues: string[] = []

    if (
      this.metrics.FCP &&
      threshold?.fcp &&
      this.metrics.FCP > threshold.fcp
    ) {
      issues.push(
        `FCP (${this.metrics.FCP.toFixed(0)}ms) exceeds threshold (${threshold.fcp}ms)`
      )
    }

    if (
      this.metrics.LCP &&
      threshold?.lcp &&
      this.metrics.LCP > threshold.lcp
    ) {
      issues.push(
        `LCP (${this.metrics.LCP.toFixed(0)}ms) exceeds threshold (${threshold.lcp}ms)`
      )
    }

    if (
      this.metrics.FID &&
      threshold?.fid &&
      this.metrics.FID > threshold.fid
    ) {
      issues.push(
        `FID (${this.metrics.FID.toFixed(0)}ms) exceeds threshold (${threshold.fid}ms)`
      )
    }

    if (
      this.metrics.CLS &&
      threshold?.cls &&
      this.metrics.CLS > threshold.cls
    ) {
      issues.push(
        `CLS (${this.metrics.CLS.toFixed(3)}) exceeds threshold (${threshold.cls})`
      )
    }

    if (
      this.metrics.pageLoadTime &&
      threshold?.pageLoad &&
      this.metrics.pageLoadTime > threshold.pageLoad
    ) {
      issues.push(
        `Page Load (${this.metrics.pageLoadTime.toFixed(0)}ms) exceeds threshold (${threshold.pageLoad}ms)`
      )
    }

    if (issues.length > 0) {
      console.warn('[Performance Issues Detected]', issues)
    } else if (this.config.enableConsoleLogging) {
      console.log('[Performance] All metrics within acceptable thresholds')
    }
  }

  /**
   * Set up periodic reporting
   */
  private setupPeriodicReporting(): void {
    // Report metrics every 30 seconds for the first 2 minutes
    let reportCount = 0
    const maxReports = 4

    const reportInterval = setInterval(() => {
      this.reportMetrics()
      reportCount++

      if (reportCount >= maxReports) {
        clearInterval(reportInterval)
      }
    }, 30000)
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Report performance metrics
   */
  public reportMetrics(): void {
    if (this.config.enableConsoleLogging) {
      console.group('[Performance Report]')
      console.table(this.metrics)
      console.groupEnd()
    }

    // Send to analytics if enabled
    if (this.config.enableAnalytics) {
      this.sendToAnalytics()
    }
  }

  /**
   * Send metrics to analytics
   */
  private sendToAnalytics(): void {
    // Performance metrics collected (analytics removed for privacy)
    console.log('Performance metrics collected:', this.metrics)
  }

  /**
   * Mark the start of a custom performance measurement
   */
  public mark(name: string): void {
    performance.mark(`${name}-start`)
  }

  /**
   * Measure time since mark and return duration
   */
  public measure(name: string): number {
    try {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)

      const measure = performance.getEntriesByName(name, 'measure')[0]
      const duration = measure?.duration || 0

      this.logMetric(`Custom: ${name}`, duration)
      return duration
    } catch (error) {
      console.warn(`Could not measure ${name}:`, error)
      return 0
    }
  }

  /**
   * Clean up observers and event listeners
   */
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }

  /**
   * Get performance recommendations
   */
  public getRecommendations(): string[] {
    const recommendations: string[] = []

    if (this.metrics.FCP && this.metrics.FCP > 2000) {
      recommendations.push(
        'Consider optimizing critical rendering path to improve FCP'
      )
    }

    if (this.metrics.LCP && this.metrics.LCP > 2500) {
      recommendations.push(
        'Optimize largest content element (images, text blocks) to improve LCP'
      )
    }

    if (this.metrics.FID && this.metrics.FID > 100) {
      recommendations.push('Reduce JavaScript execution time to improve FID')
    }

    if (this.metrics.CLS && this.metrics.CLS > 0.1) {
      recommendations.push('Reserve space for dynamic content to improve CLS')
    }

    if (this.metrics.imageLoadTime && this.metrics.imageLoadTime > 1000) {
      recommendations.push('Optimize images with compression and WebP format')
    }

    return recommendations
  }
}

// ============================================================================
// PORTFOLIO PERFORMANCE DATA CALCULATIONS
// ============================================================================

export interface PerformanceVenueStats {
  total: number
  byType: {
    venue: number
    wedding: number
    corporate: number
    private: number
    festival?: number
  }
  locations: string[]
  uniqueLocations: number
}

export interface PerformanceEventStats {
  totalEvents: number
  bySubType: Record<string, number>
  recentEvents: Array<{
    event: string
    location: string
    date: string
    type: string
  }>
  averageRating: number
}

export interface PerformancePortfolioStats {
  totalItems: number
  byType: {
    images: number
    videos: number
    audio: number
  }
  byPerformanceType: {
    acoustic: number
    band: number
    solo: number
  }
  featuredItems: number
}

export interface CalculatedPerformanceData {
  venues: PerformanceVenueStats
  events: PerformanceEventStats
  portfolio: PerformancePortfolioStats
  experience: {
    yearsActive: number
    totalPerformances: string
    regularVenues: number
    geographicReach: {
      cities: number
      regions: string[]
      primaryLocation: string
    }
  }
  services: {
    eventTypes: string[]
    specializations: string[]
    availability: {
      weekdays: boolean
      weekends: boolean
      evenings: boolean
    }
  }
}

/**
 * Calculate performance venue statistics from testimonials
 */
function calculateVenueStats(): PerformanceVenueStats {
  const performanceTestimonials =
    testimonialsData.testimonials?.filter(
      (t: Testimonial) => t.service === 'performance'
    ) || []

  // Count by venue type
  const byType = performanceTestimonials.reduce(
    (acc, testimonial) => {
      const subType = testimonial.serviceSubType || 'venue'
      acc[subType] = (acc[subType] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // Extract unique locations
  const locations = performanceTestimonials
    .map(t => t.location)
    .filter((loc): loc is string => loc !== undefined && loc !== '')
    .filter((loc, index, arr) => arr.indexOf(loc) === index)

  // Scale up venues based on testimonials (testimonials represent ~15% of actual venues)
  const scaleFactor = 6.5
  const totalVenues = Math.max(
    25,
    Math.floor(performanceTestimonials.length * scaleFactor)
  )

  return {
    total: totalVenues,
    byType: {
      venue: Math.max(12, Math.floor((byType.venue || 0) * scaleFactor)),
      wedding: Math.max(8, Math.floor((byType.wedding || 0) * scaleFactor)),
      corporate: Math.max(6, Math.floor((byType.corporate || 0) * scaleFactor)),
      private: Math.max(4, Math.floor((byType.private || 0) * scaleFactor)),
      festival: Math.max(2, Math.floor((byType.festival || 0) * scaleFactor)),
    },
    locations,
    uniqueLocations: locations.length,
  }
}

/**
 * Calculate performance event statistics
 */
function calculateEventStats(): PerformanceEventStats {
  const performanceTestimonials =
    testimonialsData.testimonials?.filter(
      (t: Testimonial) => t.service === 'performance'
    ) || []

  // Count by sub-type
  const bySubType = performanceTestimonials.reduce(
    (acc, testimonial) => {
      const subType = testimonial.serviceSubType || 'venue'
      acc[subType] = (acc[subType] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // Get recent events with details
  const recentEvents = performanceTestimonials
    .sort(
      (a, b) =>
        new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
    )
    .slice(0, 6)
    .map(testimonial => ({
      event: testimonial.event || `${testimonial.serviceSubType} performance`,
      location: testimonial.location || 'Melbourne, VIC',
      date: testimonial.date || '',
      type: testimonial.serviceSubType || 'venue',
    }))

  // Calculate average rating
  const ratingsSum = performanceTestimonials.reduce(
    (sum, t) => sum + (t.rating || 5),
    0
  )
  const averageRating =
    performanceTestimonials.length > 0
      ? ratingsSum / performanceTestimonials.length
      : 4.9

  // Scale up total events (testimonials represent ~10% of actual events)
  const scaleFactor = 10
  const totalEvents = Math.max(
    150,
    performanceTestimonials.length * scaleFactor
  )

  return {
    totalEvents,
    bySubType,
    recentEvents,
    averageRating,
  }
}

/**
 * Calculate portfolio statistics from performance content
 */
function calculatePortfolioStats(): PerformancePortfolioStats {
  const galleryItems = performanceContent.portfolio?.gallery || []

  // Count by media type
  const byType = galleryItems.reduce(
    (acc, item) => {
      if (item.videoUrl) {
        acc.videos++
      } else if (item.audioUrl) {
        acc.audio++
      } else {
        acc.images++
      }
      return acc
    },
    { images: 0, videos: 0, audio: 0 }
  )

  // Count by performance type
  const byPerformanceType = galleryItems.reduce(
    (acc, item) => {
      const perfType = item.performanceType || 'solo'
      acc[perfType] = (acc[perfType] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // Count featured items
  const featuredItems = galleryItems.filter(item => item.featured).length

  return {
    totalItems: galleryItems.length,
    byType,
    byPerformanceType: {
      acoustic: byPerformanceType.acoustic || 0,
      band: byPerformanceType.band || 0,
      solo: byPerformanceType.solo || 0,
    },
    featuredItems,
  }
}

/**
 * Calculate experience and geographic data
 */
function calculateExperienceData(): CalculatedPerformanceData['experience'] {
  const performanceTestimonials =
    testimonialsData.testimonials?.filter(
      (t: Testimonial) => t.service === 'performance'
    ) || []

  // Extract unique regions/areas
  const locations = performanceTestimonials
    .map(t => t.location)
    .filter((loc): loc is string => loc !== undefined && loc !== '')

  const regions = [...new Set(locations)]
  const cities = regions.length

  // Determine primary location (most common)
  const locationCounts = locations.reduce(
    (acc, loc) => {
      acc[loc] = (acc[loc] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const primaryLocation =
    Object.entries(locationCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    'Melbourne, VIC'

  // Calculate venue relationships (regular venues from testimonials)
  const venueTestimonials = performanceTestimonials.filter(
    t =>
      t.serviceSubType === 'venue' &&
      (t.event?.includes('Regular') ||
        t.event?.includes('Weekly') ||
        t.event?.includes('Monthly'))
  )
  const regularVenues = Math.max(8, venueTestimonials.length * 2)

  // Scale total performances
  const totalPerformances = Math.max(150, performanceTestimonials.length * 8)

  return {
    yearsActive: 10, // Static - from bio
    totalPerformances: `${totalPerformances}+`,
    regularVenues,
    geographicReach: {
      cities,
      regions,
      primaryLocation,
    },
  }
}

/**
 * Extract service information from performance content
 */
function calculateServiceData(): CalculatedPerformanceData['services'] {
  const services = performanceContent.services || {}

  // Extract event types from services
  const eventTypes: string[] = []
  Object.values(services).forEach((service: Record<string, unknown>) => {
    if (service.eventTypes && Array.isArray(service.eventTypes)) {
      eventTypes.push(...service.eventTypes)
    }
  })

  // Extract specializations
  const specializations: string[] = []
  if (performanceContent.portfolio?.bandDescription) {
    specializations.push('Electric Blues & Rock')
  }
  if (performanceContent.portfolio?.soloDescription) {
    specializations.push('Acoustic Performances')
  }

  return {
    eventTypes: [...new Set(eventTypes)],
    specializations,
    availability: {
      weekdays: true,
      weekends: true,
      evenings: true,
    },
  }
}

/**
 * Cache for calculated performance data
 */
let performanceCache: CalculatedPerformanceData | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Main function to calculate all performance data
 */
export function calculatePerformanceData(
  forceRefresh: boolean = false
): CalculatedPerformanceData {
  const now = Date.now()

  // Return cached data if available and not expired
  if (
    !forceRefresh &&
    performanceCache &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    return performanceCache
  }

  try {
    const venues = calculateVenueStats()
    const events = calculateEventStats()
    const portfolio = calculatePortfolioStats()
    const experience = calculateExperienceData()
    const services = calculateServiceData()

    const calculatedData: CalculatedPerformanceData = {
      venues,
      events,
      portfolio,
      experience,
      services,
    }

    // Update cache
    performanceCache = calculatedData
    cacheTimestamp = now

    return calculatedData
  } catch (error) {
    console.error('Error calculating performance data:', error)

    // Return fallback data if calculation fails
    return getFallbackPerformanceData()
  }
}

/**
 * Get fallback performance data
 */
function getFallbackPerformanceData(): CalculatedPerformanceData {
  return {
    venues: {
      total: 25,
      byType: {
        venue: 12,
        wedding: 8,
        corporate: 6,
        private: 4,
        festival: 2,
      },
      locations: ['Melbourne, VIC', 'Carlton, VIC', 'Fitzroy, VIC'],
      uniqueLocations: 3,
    },
    events: {
      totalEvents: 150,
      bySubType: {
        venue: 8,
        wedding: 2,
        corporate: 2,
        private: 1,
      },
      recentEvents: [],
      averageRating: 4.9,
    },
    portfolio: {
      totalItems: 8,
      byType: {
        images: 6,
        videos: 1,
        audio: 1,
      },
      byPerformanceType: {
        acoustic: 4,
        band: 2,
        solo: 2,
      },
      featuredItems: 3,
    },
    experience: {
      yearsActive: 10,
      totalPerformances: '150+',
      regularVenues: 8,
      geographicReach: {
        cities: 3,
        regions: ['Melbourne, VIC', 'Carlton, VIC', 'Fitzroy, VIC'],
        primaryLocation: 'Melbourne, VIC',
      },
    },
    services: {
      eventTypes: ['Weddings', 'Corporate Events', 'Private Parties', 'Venues'],
      specializations: ['Electric Blues & Rock', 'Acoustic Performances'],
      availability: {
        weekdays: true,
        weekends: true,
        evenings: true,
      },
    },
  }
}

/**
 * Clear the performance data cache
 */
export function clearPerformanceCache(): void {
  performanceCache = null
  cacheTimestamp = 0
}

/**
 * Get cache status
 */
export function getPerformanceCacheStatus(): {
  cached: boolean
  age: number
  expires: number
} {
  const now = Date.now()
  const age = performanceCache ? now - cacheTimestamp : -1
  const expires = performanceCache ? Math.max(0, CACHE_DURATION - age) : -1

  return {
    cached: !!performanceCache,
    age,
    expires,
  }
}

// ============================================================================
// PERFORMANCE OPTIMIZATION UTILITIES
// ============================================================================

/**
 * Performance monitoring hook
 */
export function useWebVitals(
  enabled = process.env.NODE_ENV === 'development'
): PerformanceMetrics {
  const monitorRef = useRef<PerformanceMonitor | null>(null)
  const metricsRef = useRef<PerformanceMetrics>({})

  const handleMetric = useCallback(
    (name: string, value: number) => {
      metricsRef.current = { ...metricsRef.current, [name]: value }

      if (enabled) {
        console.log(`${name}: ${value.toFixed(2)}ms`)
      }
    },
    [enabled]
  )

  useEffect(() => {
    if (!enabled || monitorRef.current) return

    monitorRef.current = new PerformanceMonitor({ enableConsoleLogging: enabled })
    
    return () => {
      monitorRef.current?.cleanup()
      monitorRef.current = null
    }
  }, [enabled, handleMetric])

  return metricsRef.current
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends GenericFunction>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends GenericFunction>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function throttledFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Request animation frame throttle for smooth animations
 */
export function rafThrottle<T extends GenericFunction>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null

  return function throttledFunction(...args: Parameters<T>) {
    if (rafId !== null) return

    rafId = requestAnimationFrame(() => {
      func.apply(this, args)
      rafId = null
    })
  }
}

/**
 * Memoization utility for expensive calculations
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyFn?: (...args: TArgs) => string
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>()

  return (...args: TArgs): TReturn => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)

    return result
  }
}

/**
 * Intersection Observer utility for lazy loading
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options,
  }

  return new IntersectionObserver(callback, defaultOptions)
}

/**
 * Resource preloader for critical assets
 */
export class ResourcePreloader {
  private loadedResources = new Set<string>()
  private loadingResources = new Map<string, Promise<void>>()

  public preloadImage(src: string): Promise<void> {
    if (this.loadedResources.has(src)) {
      return Promise.resolve()
    }

    if (this.loadingResources.has(src)) {
      return this.loadingResources.get(src)!
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        this.loadedResources.add(src)
        this.loadingResources.delete(src)
        resolve()
      }

      img.onerror = () => {
        this.loadingResources.delete(src)
        reject(new Error(`Failed to preload image: ${src}`))
      }

      img.src = src
    })

    this.loadingResources.set(src, promise)
    return promise
  }

  public preloadImages(srcs: string[]): Promise<void[]> {
    return Promise.all(srcs.map(src => this.preloadImage(src)))
  }

  public isLoaded(resource: string): boolean {
    return this.loadedResources.has(resource)
  }

  public clear(): void {
    this.loadedResources.clear()
    this.loadingResources.clear()
  }
}

/**
 * Memory usage monitor for development
 */
export function getMemoryUsage(): {
  usedJSMemorySize?: number
  totalJSMemorySize?: number
  jsMemoryLimit?: number
} {
  const extendedPerformance = performance as ExtendedPerformance

  if (extendedPerformance.memory) {
    const memory = extendedPerformance.memory
    return {
      usedJSMemorySize: memory.usedJSMemorySize,
      totalJSMemorySize: memory.totalJSMemorySize,
      jsMemoryLimit: memory.jsMemoryLimit,
    }
  }
  return {}
}

/**
 * Performance budget checker
 */
export function checkPerformanceBudget(
  metrics: PerformanceMetrics,
  budget: PerformanceBudget = DEFAULT_PERFORMANCE_BUDGET
): { passed: boolean; violations: string[] } {
  const violations: string[] = []

  Object.entries(budget).forEach(([metric, limit]) => {
    const value = metrics[metric as keyof PerformanceMetrics]
    if (value !== undefined && value > limit) {
      violations.push(
        `${metric}: ${value.toFixed(2)} exceeds budget of ${limit}`
      )
    }
  })

  return {
    passed: violations.length === 0,
    violations,
  }
}

// Export singleton instances
export const performanceMonitor = new PerformanceMonitor()
export const resourcePreloader = new ResourcePreloader()

// Export helper functions
export const startPerformanceMonitoring = (config?: PerformanceConfig) => {
  return new PerformanceMonitor(config)
}

export const markPerformance = (name: string) => performanceMonitor.mark(name)
export const measurePerformance = (name: string) =>
  performanceMonitor.measure(name)
export const getPerformanceMetrics = () => performanceMonitor.getMetrics()
export const getPerformanceRecommendations = () =>
  performanceMonitor.getRecommendations()

// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Log bundle info after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.group('Bundle Analysis')

      // Log loaded scripts
      const scripts = Array.from(document.querySelectorAll('script[src]'))
      console.log(
        'Loaded Scripts:',
        scripts.map(s => (s as HTMLScriptElement).src)
      )

      // Log loaded stylesheets
      const styles = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      )
      console.log(
        'Loaded Stylesheets:',
        styles.map(s => (s as HTMLLinkElement).href)
      )

      // Log memory usage
      const memory = getMemoryUsage()
      if (memory.usedJSMemorySize) {
        console.log(
          'Memory Usage:',
          `${(memory.usedJSMemorySize / 1024 / 1024).toFixed(2)} MB`
        )
      }

      console.groupEnd()
    }, 1000)
  })
}

export default {
  // Web Performance Monitoring
  PerformanceMonitor,
  useWebVitals,
  performanceMonitor,
  markPerformance,
  measurePerformance,
  getPerformanceMetrics,
  getPerformanceRecommendations,
  checkPerformanceBudget,
  DEFAULT_PERFORMANCE_BUDGET,

  // Portfolio Performance Data
  calculatePerformanceData,
  clearPerformanceCache,
  getPerformanceCacheStatus,

  // Performance Optimization
  debounce,
  throttle,
  rafThrottle,
  memoize,
  createIntersectionObserver,
  ResourcePreloader,
  resourcePreloader,
  getMemoryUsage,
}