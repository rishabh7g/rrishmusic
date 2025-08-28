/**
 * Performance Monitoring Utilities
 *
 * Comprehensive performance monitoring system for tracking page load times,
 * Core Web Vitals, and user interaction metrics
 */

interface PerformanceEntryWithLayout extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
}

interface PerformanceEntryWithProcessing extends PerformanceEntry {
  processingStart: number
}

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift

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

class PerformanceMonitor {
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
    // First Contentful Paint (FCP)
    this.observePerformanceEntry('paint', entries => {
      const fcpEntry = entries.find(
        entry => entry.name === 'first-contentful-paint'
      )
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime
        this.logMetric('FCP', fcpEntry.startTime)
      }

      const fpEntry = entries.find(entry => entry.name === 'first-paint')
      if (fpEntry) {
        this.metrics.firstPaint = fpEntry.startTime
      }
    })

    // Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', entries => {
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        this.metrics.lcp = lastEntry.startTime
        this.logMetric('LCP', lastEntry.startTime)
      }
    })

    // First Input Delay (FID) - using event timing as fallback
    this.observePerformanceEntry('first-input', entries => {
      const lastEntry = entries[entries.length - 1]
      if (lastEntry && 'processingStart' in lastEntry) {
        const processingEntry = lastEntry as PerformanceEntryWithProcessing
        this.metrics.fid = processingEntry.processingStart - lastEntry.startTime
        this.logMetric('FID', this.metrics.fid)
      }
    })

    // Cumulative Layout Shift (CLS)
    this.observePerformanceEntry('layout-shift', entries => {
      let clsValue = 0
      entries.forEach(entry => {
        const layoutEntry = entry as PerformanceEntryWithLayout
        if (!layoutEntry.hadRecentInput) {
          clsValue += layoutEntry.value
        }
      })
      this.metrics.cls = clsValue
      this.logMetric('CLS', clsValue)
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
      this.metrics.fcp &&
      threshold?.fcp &&
      this.metrics.fcp > threshold.fcp
    ) {
      issues.push(
        `FCP (${this.metrics.fcp.toFixed(0)}ms) exceeds threshold (${threshold.fcp}ms)`
      )
    }

    if (
      this.metrics.lcp &&
      threshold?.lcp &&
      this.metrics.lcp > threshold.lcp
    ) {
      issues.push(
        `LCP (${this.metrics.lcp.toFixed(0)}ms) exceeds threshold (${threshold.lcp}ms)`
      )
    }

    if (
      this.metrics.fid &&
      threshold?.fid &&
      this.metrics.fid > threshold.fid
    ) {
      issues.push(
        `FID (${this.metrics.fid.toFixed(0)}ms) exceeds threshold (${threshold.fid}ms)`
      )
    }

    if (
      this.metrics.cls &&
      threshold?.cls &&
      this.metrics.cls > threshold.cls
    ) {
      issues.push(
        `CLS (${this.metrics.cls.toFixed(3)}) exceeds threshold (${threshold.cls})`
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
    } else {
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
    // Placeholder for analytics integration
    // This would typically send to Google Analytics, Mixpanel, etc.

    if (typeof window !== 'undefined' && 'gtag' in window) {
      // Google Analytics 4 example
      Object.entries(this.metrics).forEach(([key, value]) => {
        if (typeof value === 'number') {
          ;(window as { gtag: (...args: unknown[]) => void }).gtag(
            'event',
            'performance_metric',
            {
              event_category: 'Performance',
              event_label: key,
              value: Math.round(value),
            }
          )
        }
      })
    }
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

    if (this.metrics.fcp && this.metrics.fcp > 2000) {
      recommendations.push(
        'Consider optimizing critical rendering path to improve FCP'
      )
    }

    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      recommendations.push(
        'Optimize largest content element (images, text blocks) to improve LCP'
      )
    }

    if (this.metrics.fid && this.metrics.fid > 100) {
      recommendations.push('Reduce JavaScript execution time to improve FID')
    }

    if (this.metrics.cls && this.metrics.cls > 0.1) {
      recommendations.push('Reserve space for dynamic content to improve CLS')
    }

    if (this.metrics.imageLoadTime && this.metrics.imageLoadTime > 1000) {
      recommendations.push('Optimize images with compression and WebP format')
    }

    return recommendations
  }
}

// Create and export singleton instance
export const performanceMonitor = new PerformanceMonitor()

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
