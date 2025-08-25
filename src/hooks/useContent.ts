import { useMemo } from 'react';
import { Testimonial } from '@/types/content';
import { calculateTestimonialStats } from '@/utils/testimonialCalculations';
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

// Define section keys for type safety
type SectionKey = 'hero' | 'about' | 'approach' | 'community' | 'contact' | 'lessons' | 'testimonials' | 'stats' | 'seo' | 'performance';

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
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, [section]);
};

/**
 * Hook for getting content by key path
 */
export const useContent = <T = unknown>(path?: string): T | null => {
  return useMemo(() => {
    if (!path) return null;
    
    try {
      const keys = path.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = contentMap;
      
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          console.warn(`Content path "${path}" not found`);
          return null;
        }
      }
      
      return current as T;
    } catch (error) {
      console.error(`Error accessing content path "${path}":`, error);
      return null;
    }
  }, [path]);
};

/**
 * Utility functions for content manipulation
 */
export const pluralize = (word: string, count: number) => {
  if (count === 1) return word;
  
  // Simple pluralization rules
  if (word.endsWith('y')) {
    return word.slice(0, -1) + 'ies';
  } else if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x') || word.endsWith('z')) {
    return word + 'es';
  } else {
    return word + 's';
  }
};

/**
 * Pluralization with count display
 */
export const pluralizeWithCount = (count: number, word: string) => {
  return `${count} ${pluralize(word, count)}`;
};

/**
 * Hook for testimonials content with dynamic statistics
 */
export const useTestimonials = () => {
  return useMemo(() => {
    try {
      const testimonialsArray = testimonials.testimonials as Testimonial[];
      const dynamicStats = calculateTestimonialStats(testimonialsArray);
      
      return {
        data: {
          ...testimonials,
          stats: dynamicStats
        },
        loading: false,
        error: null
      };
    } catch (error) {
      console.error('Error processing testimonials with dynamic stats:', error);
      return {
        data: testimonials,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, []);
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
          description: lessonContent.description,
          sessionLength: 60, // Default session length in minutes
          instruments: ['Guitar'], // Primary instrument
          location: 'Melbourne / Online' // Location options
        },
        loading: false,
        error: null
      };
    } catch (error) {
      console.error('Error loading lesson packages:', error);
      return {
        packages: [],
        packageInfo: {
          title: 'Guitar Lessons',
          subtitle: 'Learn with a Professional',
          description: 'Personalized guitar lessons',
          sessionLength: 60,
          instruments: ['Guitar'],
          location: 'Melbourne / Online'
        },
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, []);
};

/**
 * Hook for stats content
 */
export const useStats = () => {
  return useMemo(() => ({
    ...stats,
    loading: false,
    error: null
  }), []);
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
  return useMemo(() => ({
    data: performanceData,
    loading: false,
    error: null
  }), []);
};