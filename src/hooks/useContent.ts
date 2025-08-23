/**
 * Content Management Hook for RrishMusic
 * Unified content access with type safety, caching, and error handling
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { 
  SiteContent, 
  LessonContent, 
  Testimonial,
  ContentLoadingState 
} from '@/types/content';

// Import JSON files directly - Vite handles this at build time
import siteContentData from '@/content/site-content.json';
import lessonsData from '@/content/lessons.json';
import testimonialsData from '@/content/testimonials.json';

// Type assertions for imported data
const siteContent = siteContentData as unknown as SiteContent;
const lessonContent = lessonsData as LessonContent;
const testimonials = testimonialsData as Testimonial[];

interface UseContentReturn {
  content: SiteContent;
  lessons: LessonContent;
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// Content cache for performance optimization
const contentCache = new Map<string, {
  data: unknown;
  timestamp: number;
  ttl: number;
}>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Cache utility functions
 */
const cacheUtils = {
  set<T>(key: string, data: T, ttl = CACHE_TTL): void {
    contentCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  },

  get<T>(key: string): T | null {
    const cached = contentCache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      contentCache.delete(key);
      return null;
    }

    return cached.data as T;
  },

  clear(): void {
    contentCache.clear();
  },

  has(key: string): boolean {
    return contentCache.has(key);
  },
};

/**
 * Main content hook - provides all site content with type safety and caching
 */
export function useContent(): UseContentReturn {
  const [state, setState] = useState<ContentLoadingState>({
    isLoading: true,
    isError: false,
    error: null
  });

  const refresh = useCallback(() => {
    setState({ isLoading: true, isError: false, error: null });
    
    // Simulate loading for consistency with future API integration
    setTimeout(() => {
      try {
        // Cache the content
        cacheUtils.set('site-content', siteContent);
        cacheUtils.set('lessons', lessonContent);
        cacheUtils.set('testimonials', testimonials);

        setState({ isLoading: false, isError: false, error: null });
      } catch (error) {
        setState({
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error.message : 'Failed to load content'
        });
      }
    }, 100);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Memoize the return value to prevent unnecessary re-renders
  const memoizedReturn = useMemo((): UseContentReturn => ({
    content: siteContent,
    lessons: lessonContent,
    testimonials,
    loading: state.isLoading,
    error: state.error,
    refresh
  }), [state.isLoading, state.error, refresh]);

  return memoizedReturn;
}

/**
 * Hook for accessing specific content sections with type safety and caching
 */
export function useSectionContent<T extends keyof SiteContent>(
  section: T
): {
  data: SiteContent[T];
  loading: boolean;
  error: string | null;
} {
  const { content, loading, error } = useContent();
  
  const sectionData = useMemo(() => {
    // Try cache first
    const cacheKey = `section-${section}`;
    const cached = cacheUtils.get<SiteContent[T]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const data = content[section];
    cacheUtils.set(cacheKey, data);
    return data;
  }, [content, section]);

  return useMemo(() => ({
    data: sectionData,
    loading,
    error
  }), [sectionData, loading, error]);
}

/**
 * Hook for lesson packages with filtering capabilities and performance optimization
 */
export function useLessonPackages(filters?: {
  popular?: boolean;
  maxPrice?: number;
  minSessions?: number;
  targetAudience?: ('beginner' | 'intermediate' | 'advanced')[];
  recommended?: boolean;
}) {
  const { lessons, loading, error } = useContent();

  const filteredPackages = useMemo(() => {
    if (!lessons?.packages) return [];

    // Create cache key from filters
    const cacheKey = `filtered-packages-${JSON.stringify(filters)}`;
    const cached = cacheUtils.get<typeof lessons.packages>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const filtered = lessons.packages.filter(pkg => {
      // Apply filters
      if (filters?.popular !== undefined && pkg.popular !== filters.popular) {
        return false;
      }

      if (filters?.recommended !== undefined && pkg.recommended !== filters.recommended) {
        return false;
      }

      if (filters?.maxPrice !== undefined && pkg.price > filters.maxPrice) {
        return false;
      }

      if (filters?.minSessions !== undefined && pkg.sessions > 0 && pkg.sessions < filters.minSessions) {
        return false;
      }

      if (filters?.targetAudience && pkg.targetAudience) {
        const hasMatchingAudience = filters.targetAudience.some(level => 
          pkg.targetAudience?.includes(level)
        );
        if (!hasMatchingAudience) return false;
      }

      return true;
    });

    cacheUtils.set(cacheKey, filtered);
    return filtered;
  }, [lessons, filters]);

  const packageStats = useMemo(() => {
    if (!lessons?.packages) return null;

    const cacheKey = 'package-stats';
    const cached = cacheUtils.get<ReturnType<typeof calculatePackageStats>>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const stats = calculatePackageStats(lessons.packages);
    cacheUtils.set(cacheKey, stats);
    return stats;
  }, [lessons]);

  return useMemo(() => ({
    packages: filteredPackages,
    allPackages: lessons?.packages || [],
    packageInfo: lessons?.additionalInfo,
    stats: packageStats,
    loading,
    error
  }), [filteredPackages, lessons, packageStats, loading, error]);
}

/**
 * Helper function for calculating package statistics
 */
function calculatePackageStats(packages: LessonContent['packages']) {
  return {
    total: packages.length,
    popular: packages.filter(p => p.popular).length,
    recommended: packages.filter(p => p.recommended).length,
    priceRange: {
      min: Math.min(...packages.map(p => p.price)),
      max: Math.max(...packages.map(p => p.price))
    },
    averagePrice: Math.round((packages.reduce((sum, p) => sum + p.price, 0) / packages.length) * 100) / 100
  };
}

/**
 * Hook for testimonials with filtering, sorting, and caching
 */
export function useTestimonials(filters?: {
  featured?: boolean;
  instrument?: string;
  level?: string;
  minRating?: number;
  verified?: boolean;
  limit?: number;
}) {
  const { testimonials, loading, error } = useContent();

  const filteredTestimonials = useMemo(() => {
    const cacheKey = `filtered-testimonials-${JSON.stringify(filters)}`;
    const cached = cacheUtils.get<Testimonial[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    let filtered = testimonials.filter(testimonial => {
      // Apply filters
      if (filters?.featured !== undefined && testimonial.featured !== filters.featured) {
        return false;
      }

      if (filters?.verified !== undefined && testimonial.verified !== filters.verified) {
        return false;
      }

      if (filters?.instrument && testimonial.instrument !== filters.instrument) {
        return false;
      }

      if (filters?.level && testimonial.level !== filters.level) {
        return false;
      }

      if (filters?.minRating && testimonial.rating < filters.minRating) {
        return false;
      }

      return true;
    });

    // Sort by rating (desc) then by date (desc)
    filtered.sort((a, b) => {
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

    // Apply limit
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    cacheUtils.set(cacheKey, filtered);
    return filtered;
  }, [testimonials, filters]);

  const testimonialStats = useMemo(() => {
    if (!testimonials.length) return null;

    const cacheKey = 'testimonial-stats';
    const cached = cacheUtils.get<ReturnType<typeof calculateTestimonialStats>>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const stats = calculateTestimonialStats(testimonials);
    cacheUtils.set(cacheKey, stats);
    return stats;
  }, [testimonials]);

  const featuredTestimonials = useMemo(() => {
    return testimonials.filter(t => t.featured);
  }, [testimonials]);

  return useMemo(() => ({
    testimonials: filteredTestimonials,
    featured: featuredTestimonials,
    stats: testimonialStats,
    loading,
    error
  }), [filteredTestimonials, featuredTestimonials, testimonialStats, loading, error]);
}

/**
 * Helper function for calculating testimonial statistics
 */
function calculateTestimonialStats(testimonials: Testimonial[]) {
  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
  const averageRating = totalRating / testimonials.length;

  return {
    total: testimonials.length,
    averageRating: Math.round(averageRating * 10) / 10,
    featured: testimonials.filter(t => t.featured).length,
    ratingDistribution: testimonials.reduce((dist, t) => {
      dist[t.rating] = (dist[t.rating] || 0) + 1;
      return dist;
    }, {} as Record<number, number>)
  };
}

/**
 * Hook for contact methods with caching
 */
export function useContactMethods(filters?: {
  primary?: boolean;
  type?: string;
}) {
  const { content, loading, error } = useContent();

  const contactMethods = useMemo(() => {
    const cacheKey = `contact-methods-${JSON.stringify(filters)}`;
    const cached = cacheUtils.get<typeof content.contact.methods>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const methods = content?.contact?.methods || [];
    
    const filtered = methods.filter(method => {
      if (filters?.primary !== undefined && method.primary !== filters.primary) {
        return false;
      }
      
      if (filters?.type && method.type !== filters.type) {
        return false;
      }
      
      return true;
    });

    cacheUtils.set(cacheKey, filtered);
    return filtered;
  }, [content, filters]);

  const primaryContact = useMemo(() => {
    return contactMethods.find(method => method.primary) || contactMethods[0] || null;
  }, [contactMethods]);

  return useMemo(() => ({
    methods: contactMethods,
    primaryContact,
    loading,
    error
  }), [contactMethods, primaryContact, loading, error]);
}

/**
 * Hook for SEO content management with proper typing
 */
export function useSEO(customData?: {
  title?: string;
  description?: string;
  keywords?: string;
}): {
  seo: SiteContent['seo'] | undefined;
  data: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    canonicalUrl?: string;
    robots?: string;
    twitterCard?: string;
  } | null;
  generatePageTitle: (pageTitle?: string) => string;
} {
  const { content } = useContent();
  
  const seoData = useMemo(() => {
    const seo = content?.seo;
    if (!seo) return null;

    return {
      title: customData?.title || seo.defaultTitle,
      description: customData?.description || seo.defaultDescription,
      keywords: customData?.keywords || seo.defaultKeywords,
      ogImage: seo.ogImage,
      canonicalUrl: seo.canonicalUrl,
      robots: seo.robots,
      twitterCard: seo.twitterCard
    };
  }, [content, customData]);

  const generatePageTitle = useCallback((pageTitle?: string): string => {
    const siteTitle = content?.seo?.defaultTitle || 'RrishMusic';
    return pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
  }, [content]);

  return useMemo(() => ({
    seo: content?.seo,
    data: seoData,
    generatePageTitle
  }), [content, seoData, generatePageTitle]);
}

/**
 * Content utilities for formatting and calculations
 */
export const contentUtils = {
  /**
   * Format price with currency
   */
  formatPrice: (price: number, currency = 'AUD'): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(price);
  },

  /**
   * Calculate package savings
   */
  calculateSavings: (packagePrice: number, sessions: number, singlePrice: number): number => {
    if (sessions === 0) return 0; // Unlimited packages
    const fullPrice = sessions * singlePrice;
    return Math.round(((fullPrice - packagePrice) / fullPrice) * 100);
  },

  /**
   * Generate SEO-friendly slugs
   */
  generateSlug: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  /**
   * Truncate text to specified length
   */
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
  },

  /**
   * Get content preview
   */
  getPreview: (content: string, maxLength = 150): string => {
    return contentUtils.truncateText(content, maxLength);
  },

  /**
   * Clear content cache
   */
  clearCache: (): void => {
    cacheUtils.clear();
  },

  /**
   * Get cache statistics
   */
  getCacheStats: (): { size: number; keys: string[] } => {
    return {
      size: contentCache.size,
      keys: Array.from(contentCache.keys())
    };
  }
};

// Export content data for direct access when needed
export const rawContent = {
  site: siteContent,
  lessons: lessonContent,
  testimonials: testimonials
} as const;