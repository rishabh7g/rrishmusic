import { useMemo, useState, useCallback } from 'react';
import { Testimonial, LessonPackage } from '@/types/content';
import { calculateTestimonialStats } from '@/utils/testimonialCalculations';
import { calculateLessonPackagePricing, calculateTrialLessonPricing, formatPrice, getPricingSummary } from '@/utils/pricingCalculations';
import { calculateStats, clearStatsCache, getStatsCacheStatus } from '@/utils/statsCalculator';
import heroData from '@/content/hero.json';
import aboutData from '@/content/about.json';
import approachData from '@/content/approach.json';
import communityData from '@/content/community.json';
import contactData from '@/content/contact.json';
import lessonContent from '@/content/lessons.json';
import testimonials from '@/content/testimonials.json';
import stats from '@/content/stats.json';
import seoData from '@/content/seo.json';
import performanceData from '@/content/performance.json';

// Content map for centralized access
const contentMap = {
  hero: heroData,
  about: aboutData,
  approach: approachData,
  community: communityData,
  contact: contactData,
  lessons: lessonContent,
  testimonials: testimonials,
  stats: stats,
  seo: seoData,
  performance: performanceData
} as const;

/**
 * Enhanced content hook with testimonial stats integration and dynamic calculations
 */
export const useContent = () => {
  return useMemo(() => {
    try {
      const testimonialsList: Testimonial[] = testimonials?.testimonials || [];
      const lessons: LessonPackage[] = lessonContent?.packages || [];
      
      // Calculate dynamic testimonial stats
      const testimonialStats = calculateTestimonialStats(testimonialsList);
      
      // Calculate dynamic general stats
      const dynamicStats = calculateStats();
      
      return {
        ...contentMap,
        testimonials: {
          ...testimonials,
          testimonials: testimonialsList,
          stats: testimonialStats,
          meta: {
            total: testimonialsList.length,
            featured: testimonialsList.filter(t => t.featured).length,
            byService: {
              performance: testimonialsList.filter(t => t.service === 'performance').length,
              teaching: testimonialsList.filter(t => t.service === 'teaching').length,
              collaboration: testimonialsList.filter(t => t.service === 'collaboration').length
            }
          }
        },
        lessons: {
          ...lessonContent,
          packages: lessons.map(pkg => ({
            ...pkg,
            pricing: calculateLessonPackagePricing(pkg),
            trialPricing: calculateTrialLessonPricing(pkg)
          })),
          meta: {
            totalPackages: lessons.length,
            pricing: {
              range: getPricingSummary(lessons),
              formatter: formatPrice
            }
          }
        },
        stats: {
          ...stats,
          calculated: dynamicStats,
          loading: false,
          error: null,
          meta: {
            isCalculated: true,
            cacheStatus: getStatsCacheStatus(),
            lastCalculated: new Date().toISOString()
          }
        },
        loading: false,
        error: null
      };
      
    } catch (error) {
      console.error('Error processing content with dynamic calculations:', error);
      return {
        ...contentMap,
        stats: {
          ...stats,
          calculated: calculateStats(), // Fallback still works
          loading: false,
          error: 'Failed to process some dynamic content',
          meta: {
            isCalculated: false,
            cacheStatus: getStatsCacheStatus(),
            lastCalculated: new Date().toISOString()
          }
        },
        loading: false,
        error: 'Failed to process some content'
      };
    }
  }, []);
};

// Legacy hooks for backward compatibility
export const useHero = () => {
  return useMemo(() => heroData, []);
};

export const useAbout = () => {
  return useMemo(() => aboutData, []);
};

export const useApproach = () => {
  return useMemo(() => approachData, []);
};

export const useLessons = () => {
  return useMemo(() => {
    const lessons: LessonPackage[] = lessonContent?.packages || [];
    return {
      ...lessonContent,
      packages: lessons.map(pkg => ({
        ...pkg,
        pricing: calculateLessonPackagePricing(pkg),
        trialPricing: calculateTrialLessonPricing(pkg)
      })),
      meta: {
        totalPackages: lessons.length,
        pricing: {
          range: getPricingSummary(lessons),
          formatter: formatPrice
        }
      }
    };
  }, []);
};

// Alias for backward compatibility
export const useLessonPackages = useLessons;

export const useCommunity = () => {
  return useMemo(() => communityData, []);
};

export const useContact = () => {
  return useMemo(() => contactData, []);
};

export const useTestimonials = () => {
  return useMemo(() => {
    try {
      const testimonialsList: Testimonial[] = testimonials?.testimonials || [];
      const testimonialStats = calculateTestimonialStats(testimonialsList);
      
      return {
        ...testimonials,
        testimonials: testimonialsList,
        stats: testimonialStats,
        meta: {
          total: testimonialsList.length,
          featured: testimonialsList.filter(t => t.featured).length,
          byService: {
            performance: testimonialsList.filter(t => t.service === 'performance').length,
            teaching: testimonialsList.filter(t => t.service === 'teaching').length,
            collaboration: testimonialsList.filter(t => t.service === 'collaboration').length
          }
        },
        loading: false,
        error: null
      };
      
    } catch (error) {
      console.error('Error processing testimonials with dynamic stats:', error);
      return {
        ...testimonials,
        loading: false,
        error: 'Failed to process testimonial statistics'
      };
    }
  }, []);
};

/**
 * Enhanced Stats Hook with Dynamic Calculation Support
 */
export const useStats = (options: {
  useDynamic?: boolean;
  forceRefresh?: boolean;
} = {}) => {
  const { useDynamic = true, forceRefresh = false } = options;
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Refresh function for manual cache clearing
  const refreshStats = useCallback(() => {
    clearStatsCache();
    setRefreshKey(prev => prev + 1);
  }, []);
  
  return useMemo(() => {
    try {
      if (useDynamic) {
        const calculatedStats = calculateStats(forceRefresh);
        const cacheStatus = getStatsCacheStatus();
        
        return {
          // Use dynamic stats as primary data
          ...calculatedStats,
          
          // Include original stats for comparison
          original: stats,
          
          // Metadata about the calculation
          meta: {
            isCalculated: true,
            isDynamic: true,
            cacheStatus,
            lastCalculated: new Date().toISOString(),
            refreshKey
          },
          
          // State management
          loading: false,
          error: null,
          
          // Actions
          refresh: refreshStats,
          clearCache: clearStatsCache
        };
      } else {
        // Fallback to static stats
        return {
          ...stats,
          meta: {
            isCalculated: false,
            isDynamic: false,
            cacheStatus: { cached: false, age: -1, expires: -1 },
            lastCalculated: null,
            refreshKey
          },
          loading: false,
          error: null,
          refresh: refreshStats,
          clearCache: () => {} // No-op for static stats
        };
      }
      
    } catch (error) {
      console.error('Error in useStats hook:', error);
      return {
        ...stats,
        meta: {
          isCalculated: false,
          isDynamic: false,
          cacheStatus: { cached: false, age: -1, expires: -1 },
          lastCalculated: null,
          refreshKey
        },
        loading: false,
        error: 'Failed to calculate dynamic statistics',
        refresh: refreshStats,
        clearCache: clearStatsCache
      };
    }
  }, [useDynamic, forceRefresh, refreshKey, refreshStats]);
};

/**
 * Hook for SEO content
 */
export const useSEO = () => {
  return useMemo(() => ({
    data: seoData,
    loading: false,
    error: null
  }), []);
};

/**
 * Hook for performance content
 */
export const usePerformance = () => {
  return useMemo(() => performanceData, []);
};

// Alias for section content access
export const useSectionContent = (section: string) => {
  const content = useContent();
  return content[section as keyof typeof content];
};

export default useContent;