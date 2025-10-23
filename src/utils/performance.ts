/**
 * Minimal Performance Monitoring Utilities
 * Only includes the functionality actually used in the codebase
 */

/**
 * Simple performance monitoring class
 * Provides mark() and measure() methods for performance tracking
 */
export class PerformanceMonitor {
  /**
   * Mark the start of a custom performance measurement
   */
  public mark(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`)
    }
  }

  /**
   * Measure time since mark and return duration
   */
  public measure(name: string): number {
    if (typeof performance === 'undefined') return 0

    try {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
      const measure = performance.getEntriesByName(name, 'measure')[0]
      return measure?.duration || 0
    } catch (error) {
      console.warn(`Performance measurement failed for ${name}:`, error)
      return 0
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Export helper functions for backward compatibility
export const markPerformance = (name: string) => performanceMonitor.mark(name)
export const measurePerformance = (name: string) =>
  performanceMonitor.measure(name)
