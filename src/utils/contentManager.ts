/**
 * Content Manager for Dynamic Data Calculations
 * Provides backward-compatible integration with existing content hooks
 */

import { useMemo, useCallback } from 'react';
import { dataCalculator, globalCache, performanceMonitor } from './dataCalculator';
import { 
  Testimonial, 
  TestimonialStats,
  LessonPackage,
  EnhancedPerformanceData,
  GeneralStats
} from '@/types/content';

// Re-export for backward compatibility
export { dataCalculator, globalCache, performanceMonitor };

/**
 * Unified content calculation hook for integration with existing useContent
 */
export const useContentCalculations = () => {
  // Memoized calculator methods
  const calculateTestimonialStats = useCallback(async (testimonials: Testimonial[]): Promise<TestimonialStats> => {
    return dataCalculator.calculateTestimonialStats(testimonials);
  }, []);

  const calculatePerformanceData = useCallback(async (rawData: Record<string, unknown>): Promise<EnhancedPerformanceData> => {
    return dataCalculator.calculatePerformanceData(rawData);
  }, []);

  const calculateGeneralStats = useCallback(async (): Promise<GeneralStats> => {
    return dataCalculator.calculateGeneralStats();
  }, []);

  const calculateLessonPackagePricing = useCallback(async (lessonPackage: LessonPackage): Promise<Record<string, unknown>> => {
    return dataCalculator.calculateLessonPackagePricing(lessonPackage);
  }, []);

  // Cache management
  const clearAllCaches = useCallback(() => {
    dataCalculator.clearAllCaches();
  }, []);

  const getPerformanceMetrics = useCallback(() => {
    return dataCalculator.getPerformanceMetrics();
  }, []);

  const cleanup = useCallback(() => {
    return dataCalculator.cleanup();
  }, []);

  return useMemo(() => ({
    // Calculation methods
    calculateTestimonialStats,
    calculatePerformanceData,
    calculateGeneralStats,
    calculateLessonPackagePricing,
    
    // Cache management
    clearAllCaches,
    getPerformanceMetrics,
    cleanup,
    
    // Direct access to calculator
    calculator: dataCalculator,
    cache: globalCache,
    monitor: performanceMonitor
  }), [
    calculateTestimonialStats,
    calculatePerformanceData,
    calculateGeneralStats,
    calculateLessonPackagePricing,
    clearAllCaches,
    getPerformanceMetrics,
    cleanup
  ]);
};

/**
 * Backward-compatible functions for existing code
 */

// Testimonial calculations (backward compatibility)
export async function calculateTestimonialStats(testimonials: Testimonial[]): Promise<TestimonialStats> {
  return dataCalculator.calculateTestimonialStats(testimonials);
}

// Performance calculations (backward compatibility)
export async function calculatePerformanceData(rawData: Record<string, unknown>): Promise<EnhancedPerformanceData> {
  return dataCalculator.calculatePerformanceData(rawData);
}

// General stats calculations (backward compatibility)
export async function calculateGeneralStats(): Promise<GeneralStats> {
  return dataCalculator.calculateGeneralStats();
}

// Pricing calculations (backward compatibility)
export async function calculateLessonPackagePricing(lessonPackage: LessonPackage): Promise<Record<string, unknown>> {
  return dataCalculator.calculateLessonPackagePricing(lessonPackage);
}

// Cache management (backward compatibility)
export function clearAllCalculationCaches(): void {
  dataCalculator.clearAllCaches();
}

export function getCalculationPerformanceMetrics() {
  return dataCalculator.getPerformanceMetrics();
}

export function cleanupExpiredCache(): number {
  return dataCalculator.cleanup();
}

/**
 * Error boundary integration for calculation failures
 */
export interface CalculationError extends Error {
  calculationType: string;
  inputData?: unknown;
  timestamp: string;
}

export function createCalculationError(
  message: string, 
  calculationType: string, 
  inputData?: unknown
): CalculationError {
  const error = new Error(message) as CalculationError;
  error.calculationType = calculationType;
  error.inputData = inputData;
  error.timestamp = new Date().toISOString();
  return error;
}

/**
 * Progressive enhancement wrapper for calculations
 * Falls back to static data if calculations fail
 */
export async function safeCalculation<T>(
  calculationFn: () => Promise<T>,
  fallbackValue: T,
  calculationType: string
): Promise<T> {
  try {
    const result = await calculationFn();
    return result;
  } catch (error) {
    console.error(`Calculation failed for ${calculationType}:`, error);
    
    // Log performance metrics
    performanceMonitor.recordCacheMiss();
    
    // Return fallback value
    return fallbackValue;
  }
}

/**
 * Batch calculation utility for multiple operations
 */
export async function batchCalculations<T extends Record<string, unknown>>(
  calculations: Record<keyof T, () => Promise<T[keyof T]>>,
  fallbackValues: T
): Promise<T> {
  const results = {} as T;
  
  await Promise.allSettled(
    Object.entries(calculations).map(async ([key, calculationFn]) => {
      try {
        results[key as keyof T] = await (calculationFn as () => Promise<T[keyof T]>)();
      } catch (error) {
        console.error(`Batch calculation failed for ${key}:`, error);
        results[key as keyof T] = fallbackValues[key as keyof T];
      }
    })
  );
  
  return results;
}

/**
 * Content validation utilities
 */
export function validateCalculationInputs<T>(
  data: T[], 
  validator: (item: T) => boolean,
  errorMessage: string
): void {
  const invalidItems = data.filter(item => !validator(item));
  
  if (invalidItems.length > 0) {
    throw createCalculationError(
      `${errorMessage}: Found ${invalidItems.length} invalid items`,
      'validation',
      invalidItems
    );
  }
}

/**
 * Performance optimization utilities
 */
export const PerformanceUtils = {
  // Debounce calculations to avoid excessive calls
  debounceCalculation<T>(
    calculationFn: (...args: unknown[]) => Promise<T>, 
    delay: number = 300
  ): (...args: unknown[]) => Promise<T> {
    let timeoutId: NodeJS.Timeout;
    let latestResolve: (value: T) => void;
    let latestReject: (reason: unknown) => void;

    return (...args: unknown[]): Promise<T> => {
      return new Promise<T>((resolve, reject) => {
        latestResolve = resolve;
        latestReject = reject;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            const result = await calculationFn(...args);
            latestResolve(result);
          } catch (error) {
            latestReject(error);
          }
        }, delay);
      });
    };
  },

  // Throttle calculations to limit frequency
  throttleCalculation<T>(
    calculationFn: (...args: unknown[]) => Promise<T>, 
    limit: number = 1000
  ): (...args: unknown[]) => Promise<T | null> {
    let lastCall = 0;

    return async (...args: unknown[]): Promise<T | null> => {
      const now = Date.now();
      
      if (now - lastCall >= limit) {
        lastCall = now;
        return calculationFn(...args);
      }
      
      return null; // Skip calculation if called too frequently
    };
  },

  // Memoize calculations with custom key generator
  memoizeCalculation<T>(
    calculationFn: (...args: unknown[]) => Promise<T>,
    keyGenerator: (...args: unknown[]) => string,
    ttl: number = 300000 // 5 minutes default
  ): (...args: unknown[]) => Promise<T> {
    return async (...args: unknown[]): Promise<T> => {
      const key = keyGenerator(...args);
      return globalCache.getOrSet(key, () => calculationFn(...args), ttl);
    };
  }
};

export default {
  useContentCalculations,
  calculateTestimonialStats,
  calculatePerformanceData,
  calculateGeneralStats,
  calculateLessonPackagePricing,
  clearAllCalculationCaches,
  getCalculationPerformanceMetrics,
  cleanupExpiredCache,
  createCalculationError,
  safeCalculation,
  batchCalculations,
  validateCalculationInputs,
  PerformanceUtils,
  dataCalculator,
  globalCache,
  performanceMonitor
};