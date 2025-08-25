/**
 * Cache utility system with TTL (Time To Live) support
 * Provides efficient caching for expensive calculations
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class Cache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  
  /**
   * Set a cache entry with TTL
   */
  set<T>(key: string, data: T, ttlMs: number = 300000): void { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  /**
   * Get a cache entry if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear expired entries
   */
  cleanup(): number {
    let cleared = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    return cleared;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    expired: number;
    hitRate?: number;
  } {
    let expired = 0;
    const now = Date.now();
    
    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expired++;
      }
    }

    return {
      size: this.cache.size,
      expired
    };
  }

  /**
   * Get or set pattern - execute function if cache miss
   */
  async getOrSet<T>(
    key: string, 
    factory: () => T | Promise<T>, 
    ttlMs: number = 300000
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Execute factory function
    const data = await factory();
    
    // Store in cache
    this.set(key, data, ttlMs);
    
    return data;
  }
}

// Global cache instance
export const globalCache = new Cache();

// Cache key generators
export const CacheKeys = {
  testimonialStats: (hash?: string) => `testimonial_stats_${hash || 'default'}`,
  performanceData: (hash?: string) => `performance_data_${hash || 'default'}`,
  generalStats: (hash?: string) => `general_stats_${hash || 'default'}`,
  pricingCalculations: (packageId: string, customizations?: string) => 
    `pricing_${packageId}_${customizations || 'default'}`,
  contentMetadata: (contentType: string) => `metadata_${contentType}`,
  socialProof: (service: string) => `social_proof_${service}`,
} as const;

// Performance monitoring
export interface PerformanceMetrics {
  cacheHits: number;
  cacheMisses: number;
  totalCalculations: number;
  averageCalculationTime: number;
  lastCleanup: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    totalCalculations: 0,
    averageCalculationTime: 0,
    lastCleanup: Date.now()
  };

  recordCacheHit(): void {
    this.metrics.cacheHits++;
  }

  recordCacheMiss(): void {
    this.metrics.cacheMisses++;
  }

  recordCalculation(timeMs: number): void {
    this.metrics.totalCalculations++;
    const total = this.metrics.averageCalculationTime * (this.metrics.totalCalculations - 1);
    this.metrics.averageCalculationTime = (total + timeMs) / this.metrics.totalCalculations;
  }

  recordCleanup(): void {
    this.metrics.lastCleanup = Date.now();
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getHitRate(): number {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? this.metrics.cacheHits / total : 0;
  }

  reset(): void {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      totalCalculations: 0,
      averageCalculationTime: 0,
      lastCleanup: Date.now()
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();