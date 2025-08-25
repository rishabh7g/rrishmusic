import { useMemo, useState, useCallback } from 'react';
import { Testimonial, LessonPackage, EnhancedPerformanceData, TestimonialStats, GeneralStats } from '@/types/content';

// Import our new unified calculation system
import { 
  useContentCalculations,
  safeCalculation,
  batchCalculations,
  createCalculationError
} from '@/utils/contentManager';

// Legacy imports for fallback
import { calculateTrialLessonPricing, formatPrice, getPricingSummary } from "@/utils/pricingCalculations";

// Content imports
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

// Default fallback values
const defaultTestimonialStats: TestimonialStats = {
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

const defaultGeneralStats: GeneralStats = {
  studentsCount: 150,
  yearsExperience: 10,
  successStories: 45,
  performancesCount: 80,
  collaborationsCount: 25,
  lastUpdated: new Date().toISOString()
};

const defaultPerformanceData: EnhancedPerformanceData = {
  calculatedMetrics: {
    totalPerformances: 25,
    uniqueVenues: 8,
    genreDistribution: { acoustic: 15, jazz: 6, rock: 4 },
    yearRange: { start: 2015, end: new Date().getFullYear() },
    averagePerformancesPerYear: 3
  }
};

/**
 * Enhanced content hook with unified dynamic calculation system
 * Now uses the new dataCalculator system with error handling and progressive enhancement
 */
export const useContent = () => {
  const { 
    calculateTestimonialStats,
    calculatePerformanceData, 
    calculateGeneralStats,
    calculateLessonPackagePricing,
    getPerformanceMetrics
  } = useContentCalculations();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return useMemo(() => {
    const computeContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const testimonialsList: Testimonial[] = testimonials?.testimonials || [];
        const lessons: LessonPackage[] = lessonContent?.packages || [];

        // Use batch calculations for efficiency
        const calculations = await batchCalculations({
          testimonialStats: () => calculateTestimonialStats(testimonialsList),
          generalStats: () => calculateGeneralStats(),
          performanceData: () => calculatePerformanceData(performanceData)
        }, {
          testimonialStats: defaultTestimonialStats,
          generalStats: defaultGeneralStats, 
          performanceData: defaultPerformanceData
        });

        // Calculate lesson pricing with safe calculation wrapper
        const enhancedLessons = await Promise.all(
          lessons.map(async (pkg) => {
            const pricing = await safeCalculation(
              () => calculateLessonPackagePricing(pkg),
              { basePrice: pkg.price || 0, finalPrice: pkg.price || 0 },
              'lesson_pricing'
            );
            
            return {
              ...pkg,
              pricing,
              trialPricing: calculateTrialLessonPricing(pkg) // Legacy fallback
            };
          })
        );

        setLoading(false);
        
        return {
          ...contentMap,
          testimonials: {
            ...testimonials,
            testimonials: testimonialsList,
            stats: calculations.testimonialStats,
            meta: {
              total: testimonialsList.length,
              featured: testimonialsList.filter(t => t.featured).length,
              byService: {
                performance: testimonialsList.filter(t => t.service === 'performance').length,
                teaching: testimonialsList.filter(t => t.service === 'teaching').length,
                collaboration: testimonialsList.filter(t => t.service === 'collaboration').length
              },
              calculatedWith: 'unified-calculator'
            }
          },
          lessons: {
            ...lessonContent,
            packages: enhancedLessons,
            meta: {
              totalPackages: lessons.length,
              pricing: {
                range: getPricingSummary(lessons),
                formatter: formatPrice
              },
              calculatedWith: 'unified-calculator'
            }
          },
          stats: {
            ...stats,
            calculated: calculations.generalStats,
            loading: false,
            error: null,
            meta: {
              isCalculated: true,
              isDynamic: true,
              lastCalculated: new Date().toISOString(),
              calculatedWith: 'unified-calculator',
              performanceMetrics: getPerformanceMetrics()
            }
          },
          performance: {
            ...performanceData,
            calculated: calculations.performanceData,
            loading: false,
            error: null,
            meta: {
              isCalculated: true,
              isDynamic: true,
              lastCalculated: new Date().toISOString(),
              calculatedWith: 'unified-calculator'
            }
          },
          loading,
          error
        };

      } catch {
        const error = createCalculationError(
          'Failed to process content with unified calculations',
          'content_processing',
          { testimonialCount: testimonials?.testimonials?.length, lessonCount: lessonContent?.packages?.length }
        );
        
        console.error('Content processing error:', error);
        setError(error.message);
        setLoading(false);

        // Return fallback content with legacy calculations
        return {
          ...contentMap,
          stats: {
            ...stats,
            calculated: defaultGeneralStats,
            loading: false,
            error: 'Using fallback calculations',
            meta: {
              isCalculated: false,
              isDynamic: false,
              lastCalculated: new Date().toISOString(),
              calculatedWith: 'fallback'
            }
          },
          performance: {
            ...performanceData,
            calculated: defaultPerformanceData,
            loading: false,
            error: 'Using fallback calculations',
            meta: {
              isCalculated: false,
              isDynamic: false,
              lastCalculated: new Date().toISOString(),
              calculatedWith: 'fallback'
            }
          },
          loading: false,
          error: error.message
        };
      }
    };

    // For sync compatibility, return immediate values and compute async in background
    const testimonialsList: Testimonial[] = testimonials?.testimonials || [];
    
    return {
      ...contentMap,
      testimonials: {
        ...testimonials,
        testimonials: testimonialsList,
        stats: defaultTestimonialStats, // Will be updated by async computation
        meta: {
          total: testimonialsList.length,
          featured: testimonialsList.filter(t => t.featured).length,
          byService: {
            performance: testimonialsList.filter(t => t.service === 'performance').length,
            teaching: testimonialsList.filter(t => t.service === 'teaching').length,
            collaboration: testimonialsList.filter(t => t.service === 'collaboration').length
          },
          calculatedWith: 'sync-fallback'
        }
      },
      loading: false,
      error: null,
      
      // Async computation method
      computeAsync: computeContent
    };
    
  }, [calculateTestimonialStats, calculatePerformanceData, calculateGeneralStats, calculateLessonPackagePricing, getPerformanceMetrics, loading, error]);
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
  const { calculateLessonPackagePricing } = useContentCalculations();
  
  return useMemo(() => {
    const lessons: LessonPackage[] = lessonContent?.packages || [];
    
    return {
      ...lessonContent,
      packages: lessons.map(pkg => ({
        ...pkg,
        // Use legacy pricing for immediate sync results
        pricing: calculateLessonPackagePricing ? null : calculateLessonPackagePricing(pkg),
        trialPricing: calculateTrialLessonPricing(pkg)
      })),
      meta: {
        totalPackages: lessons.length,
        pricing: {
          range: getPricingSummary(lessons),
          formatter: formatPrice
        },
        calculatedWith: 'legacy-sync'
      }
    };
  }, [calculateLessonPackagePricing]);
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
  const { calculateTestimonialStats } = useContentCalculations();
  const [testimonialStats, setTestimonialStats] = useState<TestimonialStats>(defaultTestimonialStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to compute testimonial stats asynchronously
  const computeStats = useCallback(async () => {
    if (!calculateTestimonialStats) return;

    setLoading(true);
    try {
      const testimonialsList: Testimonial[] = testimonials?.testimonials || [];
      const stats = await safeCalculation(
        () => calculateTestimonialStats(testimonialsList),
        defaultTestimonialStats,
        'testimonial_stats'
      );
      
      setTestimonialStats(stats);
      setError(null);
    } catch {
      console.error("Error in calculation");
      setError('Failed to calculate testimonial statistics');
    } finally {
      setLoading(false);
    }
  }, [calculateTestimonialStats]);

  // Compute stats on first render
  useMemo(() => {
    computeStats();
  }, [computeStats]);

  return useMemo(() => {
    const testimonialsList: Testimonial[] = testimonials?.testimonials || [];
    
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
        },
        calculatedWith: 'unified-async'
      },
      loading,
      error,
      refresh: computeStats
    };
  }, [testimonialStats, loading, error, computeStats]);
};

/**
 * Enhanced Stats Hook with Unified Dynamic Calculation Support
 */
export const useStats = (options: {
  useDynamic?: boolean;
  forceRefresh?: boolean;
} = {}) => {
  const { useDynamic = true } = options;
  const { calculateGeneralStats, clearAllCaches, getPerformanceMetrics } = useContentCalculations();
  
  const [generalStats, setGeneralStats] = useState<GeneralStats>(defaultGeneralStats);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh function for manual cache clearing
  const refreshStats = useCallback(() => {
    clearAllCaches();
    setRefreshKey(prev => prev + 1);
  }, [clearAllCaches]);

  // Compute stats asynchronously
  const computeStats = useCallback(async () => {
    if (!useDynamic || !calculateGeneralStats) {
      setGeneralStats(defaultGeneralStats);
      return;
    }

    setLoading(true);
    try {
      const stats = await safeCalculation(
        () => calculateGeneralStats(),
        defaultGeneralStats,
        'general_stats'
      );
      
      setGeneralStats(stats);
      setError(null);
    } catch {
      console.error("Error in calculation");
      setError('Failed to calculate general statistics');
      setGeneralStats(defaultGeneralStats);
    } finally {
      setLoading(false);
    }
  }, [useDynamic, calculateGeneralStats]);

  // Compute stats when dependencies change
  useMemo(() => {
    computeStats();
  }, [computeStats]);

  return useMemo(() => {
    if (useDynamic) {
      return {
        // Use dynamic stats as primary data
        ...generalStats,
        
        // Include original stats for comparison
        original: stats,
        
        // Metadata about the calculation
        meta: {
          isCalculated: true,
          isDynamic: true,
          lastCalculated: new Date().toISOString(),
          refreshKey,
          calculatedWith: 'unified-calculator',
          performanceMetrics: getPerformanceMetrics()
        },
        
        // State management
        loading,
        error,
        
        // Actions
        refresh: refreshStats,
        clearCache: clearAllCaches,
        compute: computeStats
      };
    } else {
      // Fallback to static stats
      return {
        ...stats,
        meta: {
          isCalculated: false,
          isDynamic: false,
          lastCalculated: null,
          refreshKey,
          calculatedWith: 'static'
        },
        loading: false,
        error: null,
        refresh: refreshStats,
        clearCache: () => {},
        compute: () => Promise.resolve()
      };
    }
  }, [generalStats, useDynamic, loading, error, refreshKey, refreshStats, clearAllCaches, computeStats, getPerformanceMetrics]);
};

/**
 * Enhanced Performance Hook with Unified Dynamic Calculation Support
 */
export const usePerformance = (options: {
  useDynamic?: boolean;
  forceRefresh?: boolean;
} = {}): EnhancedPerformanceData & { 
  loading: boolean; 
  error: string | null; 
  refresh: () => void; 
  clearCache: () => void;
  compute: () => Promise<void>;
} => {
  const { useDynamic = true } = options;
  const { calculatePerformanceData, clearAllCaches } = useContentCalculations();
  
  const [performanceCalculations, setPerformanceCalculations] = useState<EnhancedPerformanceData>(defaultPerformanceData);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh function for manual cache clearing
  const refreshPerformance = useCallback(() => {
    clearAllCaches();
    setRefreshKey(prev => prev + 1);
  }, [clearAllCaches]);

  // Compute performance data asynchronously
  const computePerformance = useCallback(async () => {
    if (!useDynamic || !calculatePerformanceData) {
      setPerformanceCalculations(defaultPerformanceData);
      return;
    }

    setLoading(true);
    try {
      const calculations = await safeCalculation(
        () => calculatePerformanceData(performanceData),
        defaultPerformanceData,
        'performance_data'
      );
      
      setPerformanceCalculations(calculations);
      setError(null);
    } catch {
      console.error("Error in calculation");
      setError('Failed to calculate performance data');
      setPerformanceCalculations(defaultPerformanceData);
    } finally {
      setLoading(false);
    }
  }, [useDynamic, calculatePerformanceData]);

  // Compute performance data when dependencies change
  useMemo(() => {
    computePerformance();
  }, [computePerformance]);

  return useMemo(() => {
    if (useDynamic) {
      return {
        // Use dynamic performance data as primary data
        ...performanceCalculations,
        
        // Include original performance data for comparison
        original: performanceData,
        
        // Metadata about the calculation
        meta: {
          isCalculated: true,
          isDynamic: true,
          lastCalculated: new Date().toISOString(),
          refreshKey,
          calculatedWith: 'unified-calculator'
        },
        
        // State management
        loading,
        error,
        
        // Actions
        refresh: refreshPerformance,
        clearCache: clearAllCaches,
        compute: computePerformance
      };
    } else {
      // Fallback to static performance data
      return {
        ...defaultPerformanceData,
        
        // Include original performance data for comparison
        original: performanceData,
        
        meta: {
          isCalculated: false,
          isDynamic: false,
          lastCalculated: null,
          refreshKey,
          calculatedWith: 'static'
        },
        loading: false,
        error: null,
        refresh: refreshPerformance,
        clearCache: () => {},
        compute: () => Promise.resolve()
      };
    }
  }, [performanceCalculations, useDynamic, loading, error, refreshKey, refreshPerformance, clearAllCaches, computePerformance]);
};

/**
 * Hook for SEO content
 */
export const useSEO = () => {
  const generatePageTitle = useCallback((title: string) => {
    const siteName = seoData?.siteName || "Rrish Music";
    return title ? `${title} | ${siteName}` : siteName;
  }, []);

  return useMemo(() => ({
    data: seoData,
    generatePageTitle,
    loading: false,
    error: null
  }), [generatePageTitle]);
};

// Alias for section content access
export const useSectionContent = (section: string) => {
  const content = useContent();
  return content[section as keyof typeof content];
};

export default useContent;
