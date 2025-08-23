/**
 * Performance Optimization Utilities
 * Tools for monitoring and optimizing React application performance
 */

import { useEffect, useCallback, useRef } from 'react';

/**
 * Performance metrics collection
 */
export interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

/**
 * Web Vitals observer for performance monitoring
 */
export class WebVitalsMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor(private onMetric?: (name: string, value: number) => void) {}

  public start(): void {
    // First Contentful Paint
    this.observePaintTiming();
    
    // Largest Contentful Paint
    this.observeLCP();
    
    // First Input Delay
    this.observeFID();
    
    // Cumulative Layout Shift
    this.observeCLS();
    
    // Time to First Byte
    this.observeTTFB();
  }

  public stop(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  private observePaintTiming(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime;
            this.onMetric?.('FCP', entry.startTime);
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Paint timing not supported:', error);
    }
  }

  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.metrics.LCP = lastEntry.startTime;
          this.onMetric?.('LCP', lastEntry.startTime);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP not supported:', error);
    }
  }

  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            this.metrics.FID = fid;
            this.onMetric?.('FID', fid);
          }
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID not supported:', error);
    }
  }

  private observeCLS(): void {
    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.CLS = clsValue;
            this.onMetric?.('CLS', clsValue);
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS not supported:', error);
    }
  }

  private observeTTFB(): void {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.metrics.TTFB = ttfb;
        this.onMetric?.('TTFB', ttfb);
      }
    } catch (error) {
      console.warn('TTFB calculation failed:', error);
    }
  }
}

/**
 * Performance monitoring hook
 */
export function useWebVitals(enabled = process.env.NODE_ENV === 'development'): PerformanceMetrics {
  const monitorRef = useRef<WebVitalsMonitor | null>(null);
  const metricsRef = useRef<PerformanceMetrics>({});

  const handleMetric = useCallback((name: string, value: number) => {
    metricsRef.current = { ...metricsRef.current, [name]: value };
    
    if (enabled) {
      console.log(`${name}: ${value.toFixed(2)}ms`);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || monitorRef.current) return;

    monitorRef.current = new WebVitalsMonitor(handleMetric);
    monitorRef.current.start();

    return () => {
      monitorRef.current?.stop();
      monitorRef.current = null;
    };
  }, [enabled, handleMetric]);

  return metricsRef.current;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function throttledFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Request animation frame throttle for smooth animations
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function throttledFunction(...args: Parameters<T>) {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      func.apply(this, args);
      rafId = null;
    });
  };
}

/**
 * Memoization utility for expensive calculations
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyFn?: (...args: TArgs) => string
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  };
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
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Resource preloader for critical assets
 */
export class ResourcePreloader {
  private loadedResources = new Set<string>();
  private loadingResources = new Map<string, Promise<void>>();

  public preloadImage(src: string): Promise<void> {
    if (this.loadedResources.has(src)) {
      return Promise.resolve();
    }

    if (this.loadingResources.has(src)) {
      return this.loadingResources.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.loadedResources.add(src);
        this.loadingResources.delete(src);
        resolve();
      };
      
      img.onerror = () => {
        this.loadingResources.delete(src);
        reject(new Error(`Failed to preload image: ${src}`));
      };
      
      img.src = src;
    });

    this.loadingResources.set(src, promise);
    return promise;
  }

  public preloadImages(srcs: string[]): Promise<void[]> {
    return Promise.all(srcs.map(src => this.preloadImage(src)));
  }

  public preloadFont(fontFamily: string, fontWeight = '400'): Promise<void> {
    const key = `${fontFamily}-${fontWeight}`;
    
    if (this.loadedResources.has(key)) {
      return Promise.resolve();
    }

    if (this.loadingResources.has(key)) {
      return this.loadingResources.get(key)!;
    }

    const promise = new Promise<void>((resolve) => {
      const font = new FontFace(fontFamily, `url(${fontFamily})`, {
        weight: fontWeight
      });

      font.load().then(() => {
        document.fonts.add(font);
        this.loadedResources.add(key);
        this.loadingResources.delete(key);
        resolve();
      }).catch(() => {
        // Fail silently for fonts
        this.loadingResources.delete(key);
        resolve();
      });
    });

    this.loadingResources.set(key, promise);
    return promise;
  }

  public isLoaded(resource: string): boolean {
    return this.loadedResources.has(resource);
  }

  public clear(): void {
    this.loadedResources.clear();
    this.loadingResources.clear();
  }
}

/**
 * Memory usage monitor for development
 */
export function getMemoryUsage(): {
  usedJSMemorySize?: number;
  totalJSMemorySize?: number;
  jsMemoryLimit?: number;
} {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSMemorySize: memory.usedJSMemorySize,
      totalJSMemorySize: memory.totalJSMemorySize,
      jsMemoryLimit: memory.jsMemoryLimit
    };
  }
  return {};
}

/**
 * Bundle analyzer helper
 */
export function logBundleInfo(): void {
  if (process.env.NODE_ENV === 'development') {
    console.group('Bundle Analysis');
    
    // Log loaded scripts
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    console.log('Loaded Scripts:', scripts.map(s => (s as HTMLScriptElement).src));
    
    // Log loaded stylesheets  
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    console.log('Loaded Stylesheets:', styles.map(s => (s as HTMLLinkElement).href));
    
    // Log memory usage
    const memory = getMemoryUsage();
    if (memory.usedJSMemorySize) {
      console.log('Memory Usage:', `${(memory.usedJSMemorySize / 1024 / 1024).toFixed(2)} MB`);
    }
    
    console.groupEnd();
  }
}

/**
 * Performance budget checker
 */
export interface PerformanceBudget {
  FCP: number;    // First Contentful Paint (ms)
  LCP: number;    // Largest Contentful Paint (ms)
  FID: number;    // First Input Delay (ms)
  CLS: number;    // Cumulative Layout Shift
  TTFB: number;   // Time to First Byte (ms)
}

export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  FCP: 1800,   // 1.8s
  LCP: 2500,   // 2.5s
  FID: 100,    // 100ms
  CLS: 0.1,    // 0.1
  TTFB: 800,   // 800ms
};

export function checkPerformanceBudget(
  metrics: PerformanceMetrics,
  budget: PerformanceBudget = DEFAULT_PERFORMANCE_BUDGET
): { passed: boolean; violations: string[] } {
  const violations: string[] = [];

  Object.entries(budget).forEach(([metric, limit]) => {
    const value = metrics[metric as keyof PerformanceMetrics];
    if (value !== undefined && value > limit) {
      violations.push(`${metric}: ${value.toFixed(2)} exceeds budget of ${limit}`);
    }
  });

  return {
    passed: violations.length === 0,
    violations
  };
}

// Export singleton instances
export const resourcePreloader = new ResourcePreloader();

// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Log bundle info after page load
  window.addEventListener('load', () => {
    setTimeout(logBundleInfo, 1000);
  });
}