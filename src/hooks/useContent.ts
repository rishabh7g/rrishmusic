import { useMemo } from 'react';
import { PageContent } from '@/types/content';
import heroData from '@/content/hero.json';
import aboutData from '@/content/about.json';
import approachData from '@/content/approach.json';
import communityData from '@/content/community.json';
import contactData from '@/content/contact.json';
import lessonContent from '@/content/lessons.json';
import testimonials from '@/content/testimonials.json';
import stats from '@/content/stats.json';
import seoData from '@/content/seo.json';

// Define section keys for type safety
type SectionKey = 'hero' | 'about' | 'approach' | 'community' | 'contact' | 'lessons' | 'testimonials' | 'stats' | 'seo';

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
  seo: seoData
} as const;

/**
 * Enhanced content hook with loading states and error handling
 */
export const useSectionContent = (section: SectionKey) => {
  return useMemo(() => {
    try {
      const data = contentMap[section];
      if (!data) {
        throw new Error(`Content for section "${section}" not found`);
      }
      
      return {
        data,
        loading: false,
        error: null
      };
    } catch (error) {
      console.error(`Error loading content for section "${section}":`, error);
      return {
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }, [section]);
};

/**
 * Specialized hook for hero content with enhanced type safety
 */
export const useHeroContent = () => {
  return useMemo(() => ({
    data: heroData,
    loading: false,
    error: null
  }), []);
};

/**
 * Pluralization helper function
 */
export const pluralize = (word: string, count: number) => {
  return count === 1 ? word : `${word}s`;
};

/**
 * Pluralization with count display
 */
export const pluralizeWithCount = (count: number, word: string) => {
  return `${count} ${pluralize(word, count)}`;
};

/**
 * Hook for testimonials content
 */
export const useTestimonials = () => {
  return useMemo(() => ({
    data: testimonials,
    loading: false,
    error: null
  }), []);
};

/**
 * Hook for lessons content
 */
export const useLessons = () => {
  return useMemo(() => ({
    data: lessonContent,
    loading: false,
    error: null
  }), []);
};

/**
 * Hook for lesson packages with structured data
 */
export const useLessonPackages = () => {
  return useMemo(() => {
    try {
      if (!lessonContent || !lessonContent.packages) {
        throw new Error('Lesson packages data not found');
      }

      return {
        packages: lessonContent.packages,
        packageInfo: {
          title: lessonContent.title,
          subtitle: lessonContent.subtitle,
          description: lessonContent.description
        },
        loading: false,
        error: null
      };
    } catch (error) {
      console.error('Error loading lesson packages:', error);
      return {
        packages: [],
        packageInfo: {
          title: 'Guitar Lessons & Packages',
          subtitle: 'Choose the learning path that works best for your goals and schedule',
          description: 'Whether you\'re taking your first steps or looking to refine your improvisation skills, these packages are designed to meet you where you are and guide you to where you want to be.'
        },
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }, []);
};

/**
 * Hook for SEO data
 */
export const useSEO = () => {
  return useMemo(() => ({
    data: seoData,
    generatePageTitle: (title: string) => {
      const siteName = seoData.siteName || 'RrishMusic';
      return title ? `${title} | ${siteName}` : seoData.title || siteName;
    },
    loading: false,
    error: null
  }), []);
};

/**
 * Hook for stats with computed values for different contexts
 */
export const useStats = () => {
  return useMemo(() => ({
    data: stats,
    // Computed values for different contexts
    socialProof: {
      // Properties expected by Contact component
      students: stats.students.total,
      performances: parseInt(stats.performance.venuePerformances.replace('+', '')), // Convert "50+" to 50
      experience: stats.experience.teachingYears,
      satisfaction: Math.round(stats.quality.averageRating * 20), // Convert 5.0 rating to 100% satisfaction
      
      // Legacy properties for backward compatibility
      studentsCount: stats.students.total,
      yearsTeaching: stats.experience.teachingYears,
      averageRating: stats.quality.averageRating,
      successStories: stats.quality.successStories
    },
    heroStats: {
      studentsCount: stats.students.total,
      yearsExperience: stats.experience.playingYears,
      successStories: stats.quality.successStories
    },
    aboutStats: [
      {
        number: stats.experience.performanceYears.toString() + "+",
        label: `${pluralizeWithCount(stats.experience.performanceYears, "Year")} Performing`
      },
      {
        number: stats.experience.teachingYears.toString(),
        label: `${pluralizeWithCount(stats.experience.teachingYears, "Year")} Teaching`
      },
      {
        number: stats.students.total.toString(),
        label: `Happy ${pluralizeWithCount(stats.students.total, "Student")}`
      }    ],
    communityStats: {
      totalStudents: stats.students.total,
      activeMembers: stats.students.active,
      successStories: stats.quality.successStories,
      averageRating: stats.quality.averageRating,
      countriesRepresented: stats.reach.countries
    }
  }), []);
};

// Export content data for direct access when needed
export const rawContent = {
  hero: heroData,
  about: aboutData,
  approach: approachData,
  community: communityData,
  contact: contactData,
  lessons: lessonContent,
  testimonials: testimonials,
  stats: stats,
  seo: seoData
} as const;

// Enhanced page content interface
export interface EnhancedPageContent extends PageContent {
  meta?: {
    lastUpdated?: string;
    version?: string;
    author?: string;
  };
}

/**
 * Navigation utility for multi-service platform
 */
export const useNavigation = () => {
  return useMemo(() => ({
    primarySections: [
      { id: 'hero', label: 'Home', path: '/' },
      { id: 'performances', label: 'Performances', path: '/performances' },
      { id: 'lessons', label: 'Lessons', path: '/lessons' },
      { id: 'about', label: 'About', path: '/about' },
      { id: 'contact', label: 'Contact', path: '/contact' }
    ],
    serviceSections: {
      performance: ['hero', 'performances', 'about', 'contact'],
      teaching: ['hero', 'lessons', 'approach', 'community', 'contact'],
      collaboration: ['hero', 'about', 'contact']
    }
  }), []);
};

/**
 * Content validation utility
 */
export const validateContent = (content: Record<string, unknown>, section: string): boolean => {
  if (!content) {
    console.error(`Content validation failed: ${section} content is null or undefined`);
    return false;
  }
  
  // Add specific validation rules based on content structure
  if (section === 'hero' && !content.title) {
    console.error(`Content validation failed: ${section} missing required title`);
    return false;
  }
  
  return true;
};

/**
 * Content transformation utility for different contexts
 */
export const useContentTransformer = () => {
  return useMemo(() => ({
    transformForSEO: (content: Record<string, unknown>) => ({
      ...content,
      meta: {
        ...((content.meta as Record<string, unknown>) || {}),
        generatedAt: new Date().toISOString()
      }
    }),
    transformForMobile: (content: Record<string, unknown>) => ({
      ...content,
      // Mobile-specific transformations
      title: (content.shortTitle as string) || (content.title as string),
      description: (content.shortDescription as string) || (content.description as string)
    }),
    transformForAccessibility: (content: Record<string, unknown>) => ({
      ...content,
      // Accessibility enhancements
      ariaLabels: (content.ariaLabels as Record<string, string>) || {},
      altTexts: (content.altTexts as Record<string, string>) || {}
    })
  }), []);
};

/**
 * Performance monitoring for content loading
 */
export const useContentPerformance = (section: string) => {
  return useMemo(() => {
    const startTime = performance.now();
    
    return {
      measureLoadTime: () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        console.log(`Content loading time for ${section}: ${loadTime}ms`);
        return loadTime;
      }
    };
  }, [section]);
};

/**
 * Content caching utility
 */
export const useContentCache = () => {
  return useMemo(() => ({
    getCached: (key: string) => {
      try {
        const cached = sessionStorage.getItem(`content_${key}`);
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    },
    setCached: (key: string, data: Record<string, unknown>) => {
      try {
        sessionStorage.setItem(`content_${key}`, JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to cache content:', error);
      }
    },
    clearCache: () => {
      try {
        Object.keys(sessionStorage)
          .filter(key => key.startsWith('content_'))
          .forEach(key => sessionStorage.removeItem(key));
      } catch (error) {
        console.warn('Failed to clear content cache:', error);
      }
    }
  }), []);
};

/**
 * Multi-language content support (future enhancement)
 */
export const useInternationalization = () => {
  return useMemo(() => ({
    currentLanguage: 'en',
    supportedLanguages: ['en'],
    translate: (key: string) => {
      // Future implementation for multi-language support
      return key;
    }
  }), []);
};

/**
 * Enhanced error boundary integration
 */
export const useContentErrorBoundary = () => {
  return useMemo(() => ({
    handleContentError: (error: Error) => {
      console.error('Content error:', error);
      // Could integrate with error reporting service
    },
    getErrorFallback: () => ({
      title: 'Content Temporarily Unavailable',
      description: 'Please refresh the page or try again later.',
      showRetry: true
    })
  }), []);
};

/**
 * Content analytics integration
 */
export const useContentAnalytics = () => {
  return useMemo(() => ({
    trackContentView: (section: string) => {
      // Future implementation for analytics tracking
      console.log(`Content view tracked: ${section}`);
    },
    trackContentInteraction: (section: string, action: string) => {
      console.log(`Content interaction tracked: ${section} - ${action}`);
    }
  }), []);
};