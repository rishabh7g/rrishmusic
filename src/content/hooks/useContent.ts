/**
 * Comprehensive Content Management Hooks for RrishMusic
 * 
 * Provides type-safe React hooks for accessing and managing content
 * with caching, validation, and hot reloading support.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type {
  SiteContent,
  LessonContent,
  LessonPackage,
  Testimonial,
  ContactMethod,
  ContentValidationResult,
  ContentLoadingState,
  ContentCache,
  ContentFilter,
  ContentSearchResult,
  ContentSection,
  DeepPartial,
  ContentPath,
  ContentValue,
  NavigationItem,
  MediaItem,
  BlogPost
} from '../types';
import { 
  validateSiteContent, 
  validateLessonPackage, 
  validateTestimonial,
  validationUtils
} from '../utils/validation';

// Import JSON files directly - Vite will handle this at build time
// These imports will be replaced with actual content files
let siteContentData: SiteContent;
let lessonsData: LessonContent;

// Fallback for development
try {
  siteContentData = require('@/content/data/site-content.json');
} catch {
  console.warn('Site content not found, using minimal fallback');
  siteContentData = {} as SiteContent;
}

try {
  lessonsData = require('@/content/data/lessons.json');
} catch {
  console.warn('Lessons data not found, using minimal fallback');
  lessonsData = {} as LessonContent;
}

// Content cache management
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const contentCache = new Map<string, ContentCache>();

/**
 * Content loading state management
 */
interface UseContentState extends ContentLoadingState {
  content: SiteContent | null;
  lessons: LessonContent | null;
  lastValidated?: string;
  validationResult?: ContentValidationResult;
}

/**
 * Main content hook with caching and validation
 */
export function useContent() {
  const [state, setState] = useState<UseContentState>({
    isLoading: false,
    isError: false,
    error: null,
    content: null,
    lessons: null,
    retryCount: 0
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  /**
   * Load and validate content
   */
  const loadContent = useCallback(async (forceRefresh = false) => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));

    try {
      // Check cache first
      const cacheKey = 'main-content';
      const cached = contentCache.get(cacheKey);
      
      if (!forceRefresh && cached && (Date.now() - new Date(cached.timestamp).getTime()) < cached.ttl) {
        setState(prev => ({
          ...prev,
          content: cached.data,
          lessons: lessonsData,
          isLoading: false,
          lastFetch: cached.timestamp
        }));
        return;
      }

      // Simulate async loading (in real app, this would be an API call)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Validate content
      const validation = validateSiteContent(siteContentData);
      
      if (!validation.valid && validation.errors.some(e => e.severity === 'error')) {
        throw new Error(`Content validation failed: ${validationUtils.formatValidationErrors(validation.errors)}`);
      }

      // Update cache
      const now = new Date().toISOString();
      contentCache.set(cacheKey, {
        data: siteContentData,
        timestamp: now,
        ttl: CACHE_TTL,
        version: siteContentData.version || '1.0.0'
      });

      setState(prev => ({
        ...prev,
        content: siteContentData,
        lessons: lessonsData,
        isLoading: false,
        isError: false,
        error: null,
        lastFetch: now,
        lastValidated: now,
        validationResult: validation,
        retryCount: 0
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: errorMessage,
        retryCount: prev.retryCount + 1
      }));

      // Auto-retry with exponential backoff
      if (state.retryCount < 3) {
        const retryDelay = Math.pow(2, state.retryCount) * 1000;
        retryTimeoutRef.current = setTimeout(() => loadContent(forceRefresh), retryDelay);
      }
    }
  }, [state.retryCount]);

  /**
   * Refresh content manually
   */
  const refresh = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    loadContent(true);
  }, [loadContent]);

  /**
   * Initial load effect
   */
  useEffect(() => {
    loadContent();

    // Cleanup retry timeout on unmount
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [loadContent]);

  /**
   * Hot reload support in development
   */
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleHotReload = () => {
        console.log('Content hot reload detected');
        refresh();
      };

      // Listen for content file changes (implementation depends on build system)
      window.addEventListener('content-reload', handleHotReload);
      
      return () => {
        window.removeEventListener('content-reload', handleHotReload);
      };
    }
  }, [refresh]);

  return {
    content: state.content,
    lessons: state.lessons,
    loading: state.isLoading,
    error: state.error,
    lastFetch: state.lastFetch,
    validationResult: state.validationResult,
    retryCount: state.retryCount,
    refresh
  };
}

/**
 * Hook for accessing specific content sections with type safety
 */
export function useSectionContent<T extends ContentSection>(section: T) {
  const { content, loading, error, validationResult } = useContent();
  
  const sectionData = useMemo(() => {
    return content?.[section] || null;
  }, [content, section]);

  const sectionErrors = useMemo(() => {
    if (!validationResult) return [];
    return validationResult.errors.filter(error => 
      error.field.startsWith(`siteContent.${section}`) || error.field === section
    );
  }, [validationResult, section]);

  return {
    data: sectionData,
    loading,
    error,
    sectionErrors,
    isValid: sectionErrors.length === 0
  };
}

/**
 * Hook for lesson packages with advanced filtering and sorting
 */
export function useLessonPackages(filters?: {
  popular?: boolean;
  maxPrice?: number;
  minSessions?: number;
  targetAudience?: ('beginner' | 'intermediate' | 'advanced')[];
  instruments?: string[];
  recommended?: boolean;
}) {
  const { lessons, loading, error } = useContent();

  const filteredPackages = useMemo(() => {
    if (!lessons?.packages) return [];

    return lessons.packages.filter(pkg => {
      // Validate package first
      const validation = validateLessonPackage(pkg);
      if (!validation.valid) return false;

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

      if (filters?.targetAudience) {
        const hasMatchingAudience = filters.targetAudience.some(level => 
          pkg.targetAudience.includes(level)
        );
        if (!hasMatchingAudience) return false;
      }

      if (filters?.instruments) {
        const hasMatchingInstrument = filters.instruments.some(instrument => 
          pkg.instruments.includes(instrument)
        );
        if (!hasMatchingInstrument) return false;
      }

      return true;
    });
  }, [lessons, filters]);

  const packageStats = useMemo(() => {
    if (!lessons?.packages) return null;

    return {
      total: lessons.packages.length,
      popular: lessons.packages.filter(p => p.popular).length,
      recommended: lessons.packages.filter(p => p.recommended).length,
      priceRange: {
        min: Math.min(...lessons.packages.map(p => p.price)),
        max: Math.max(...lessons.packages.map(p => p.price))
      },
      averagePrice: lessons.packages.reduce((sum, p) => sum + p.price, 0) / lessons.packages.length
    };
  }, [lessons]);

  return {
    packages: filteredPackages,
    allPackages: lessons?.packages || [],
    packageInfo: lessons?.additionalInfo,
    stats: packageStats,
    loading,
    error
  };
}

/**
 * Hook for testimonials with filtering and sorting
 */
export function useTestimonials(filters?: {
  featured?: boolean;
  instrument?: string;
  level?: string;
  minRating?: number;
  verified?: boolean;
  limit?: number;
}) {
  const { content, loading, error } = useContent();

  const testimonials = useMemo(() => {
    const allTestimonials = content?.community?.testimonials?.all || [];
    
    let filtered = allTestimonials.filter(testimonial => {
      // Validate testimonial
      const validation = validateTestimonial(testimonial);
      if (!validation.valid) return false;

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
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Apply limit
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }, [content, filters]);

  const testimonialStats = useMemo(() => {
    const collection = content?.community?.testimonials;
    if (!collection) return null;

    return {
      total: collection.totalCount,
      averageRating: collection.averageRating,
      featured: collection.featured.length,
      ratingDistribution: collection.all.reduce((dist, t) => {
        dist[t.rating] = (dist[t.rating] || 0) + 1;
        return dist;
      }, {} as Record<number, number>)
    };
  }, [content]);

  return {
    testimonials,
    featured: content?.community?.testimonials?.featured || [],
    stats: testimonialStats,
    loading,
    error
  };
}

/**
 * Hook for contact methods
 */
export function useContactMethods(filters?: {
  primary?: boolean;
  type?: ContactMethod['type'];
}) {
  const { content, loading, error } = useContent();

  const contactMethods = useMemo(() => {
    const methods = content?.contact?.methods || [];
    
    return methods.filter(method => {
      if (filters?.primary !== undefined && method.primary !== filters.primary) {
        return false;
      }
      
      if (filters?.type && method.type !== filters.type) {
        return false;
      }
      
      return true;
    });
  }, [content, filters]);

  const primaryContact = useMemo(() => {
    return contactMethods.find(method => method.primary) || contactMethods[0] || null;
  }, [contactMethods]);

  return {
    methods: contactMethods,
    primaryContact,
    loading,
    error
  };
}

/**
 * Hook for SEO content management
 */
export function useSEO(pageType?: string, customData?: {
  title?: string;
  description?: string;
  keywords?: string;
}) {
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
      twitterCard: seo.twitterCard,
      structuredData: seo.structuredData
    };
  }, [content, customData]);

  const generatePageTitle = useCallback((pageTitle?: string) => {
    const siteTitle = content?.seo?.defaultTitle || '';
    return pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
  }, [content]);

  return {
    seo: content?.seo,
    data: seoData,
    generatePageTitle
  };
}

/**
 * Hook for navigation management
 */
export function useNavigation() {
  const { content, loading, error } = useContent();

  const navigation = useMemo(() => {
    return content?.navigation || null;
  }, [content]);

  const sortedNavigation = useMemo(() => {
    if (!navigation) return null;

    return {
      ...navigation,
      primary: navigation.primary.sort((a, b) => a.order - b.order),
      footer: navigation.footer?.sort((a, b) => a.order - b.order) || [],
      social: navigation.social.sort((a, b) => a.order - b.order)
    };
  }, [navigation]);

  return {
    navigation: sortedNavigation,
    loading,
    error
  };
}

/**
 * Content search hook
 */
export function useContentSearch() {
  const { content } = useContent();
  
  const search = useCallback((query: string, filters?: ContentFilter): ContentSearchResult => {
    if (!content || !query.trim()) {
      return { items: [], totalCount: 0, query, filters: filters || {} };
    }

    const searchTerm = query.toLowerCase().trim();
    const results: ContentSearchResult['items'] = [];

    // Search through different content sections
    const sections = Object.entries(content) as Array<[ContentSection, any]>;
    
    sections.forEach(([sectionKey, sectionData]) => {
      if (filters?.section && filters.section !== sectionKey) return;

      // Recursive search function
      const searchInObject = (obj: any, path: string, depth = 0): void => {
        if (depth > 3) return; // Limit search depth

        if (typeof obj === 'string') {
          if (obj.toLowerCase().includes(searchTerm)) {
            results.push({
              section: sectionKey,
              path,
              content: obj,
              relevance: calculateRelevance(obj, searchTerm),
              highlights: getHighlights(obj, searchTerm)
            });
          }
        } else if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            searchInObject(item, `${path}[${index}]`, depth + 1);
          });
        } else if (obj && typeof obj === 'object') {
          Object.entries(obj).forEach(([key, value]) => {
            searchInObject(value, path ? `${path}.${key}` : key, depth + 1);
          });
        }
      };

      searchInObject(sectionData, sectionKey);
    });

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return {
      items: results,
      totalCount: results.length,
      query,
      filters: filters || {}
    };
  }, [content]);

  return { search };
}

/**
 * Helper functions for search
 */
function calculateRelevance(text: string, searchTerm: string): number {
  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  
  let relevance = 0;
  
  // Exact match gets highest score
  if (lowerText === lowerTerm) relevance += 100;
  
  // Starts with search term
  if (lowerText.startsWith(lowerTerm)) relevance += 50;
  
  // Contains search term as whole word
  const wordMatch = new RegExp(`\\b${lowerTerm}\\b`).test(lowerText);
  if (wordMatch) relevance += 25;
  
  // Contains search term as substring
  if (lowerText.includes(lowerTerm)) relevance += 10;
  
  // Frequency of search term
  const matches = lowerText.split(lowerTerm).length - 1;
  relevance += matches * 5;
  
  return relevance;
}

function getHighlights(text: string, searchTerm: string, maxHighlights = 3): string[] {
  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const highlights: string[] = [];
  
  let startIndex = 0;
  while (highlights.length < maxHighlights && startIndex < text.length) {
    const index = lowerText.indexOf(lowerTerm, startIndex);
    if (index === -1) break;
    
    const contextStart = Math.max(0, index - 30);
    const contextEnd = Math.min(text.length, index + searchTerm.length + 30);
    const context = text.slice(contextStart, contextEnd);
    
    highlights.push(context);
    startIndex = index + searchTerm.length;
  }
  
  return highlights;
}

/**
 * Utility hook for type-safe content path access
 */
export function useContentPath<T extends ContentPath<SiteContent>>(
  path: T
): ContentValue<SiteContent, T> | null {
  const { content } = useContent();
  
  return useMemo(() => {
    if (!content) return null;
    
    try {
      return path.split('.').reduce((obj: any, key) => {
        return obj?.[key];
      }, content) || null;
    } catch {
      return null;
    }
  }, [content, path]);
}

/**
 * Content utilities
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
   * Validate content structure
   */
  isValidContent: (content: unknown): content is SiteContent => {
    const validation = validateSiteContent(content);
    return validationUtils.meetsMinimumRequirements(validation);
  }
};

// Export for direct access when needed
export { siteContentData as rawSiteContent, lessonsData as rawLessonsData };