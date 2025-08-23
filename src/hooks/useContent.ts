import { useState, useEffect } from 'react';
import type { SiteContent, LessonContent, SiteData } from '@/types/content';

// Import JSON files directly - Vite will handle this at build time
import siteContentData from '@/content/site-content.json';
import lessonsData from '@/content/lessons.json';

// Type the imported JSON data
const siteContent = siteContentData as SiteContent;
const lessonContent = lessonsData as LessonContent;

/**
 * Custom hook for accessing site content with type safety
 * Provides all content in a structured, typed format
 */
export function useContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Since we're importing JSON directly, content is available immediately
  // But we maintain the async pattern for future API integration
  useEffect(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    content: siteContent,
    lessons: lessonContent,
    loading,
    error,
  };
}

/**
 * Hook for accessing specific content sections
 */
export function useSectionContent<T extends keyof SiteContent>(section: T) {
  const { content, loading, error } = useContent();
  
  return {
    data: content[section],
    loading,
    error,
  };
}

/**
 * Hook for accessing lesson packages with filtering
 */
export function useLessonPackages(filters?: {
  popular?: boolean;
  maxPrice?: number;
  minSessions?: number;
}) {
  const { lessons, loading, error } = useContent();

  const filteredPackages = lessons.packages.filter(pkg => {
    if (filters?.popular !== undefined && pkg.popular !== filters.popular) {
      return false;
    }
    if (filters?.maxPrice !== undefined && pkg.price > filters.maxPrice) {
      return false;
    }
    if (filters?.minSessions !== undefined && pkg.sessions > 0 && pkg.sessions < filters.minSessions) {
      return false;
    }
    return true;
  });

  return {
    packages: filteredPackages,
    allPackages: lessons.packages,
    packageInfo: lessons.additionalInfo,
    loading,
    error,
  };
}

/**
 * Hook for SEO content management
 */
export function useSEO(pageType?: string) {
  const { content } = useContent();
  
  const getSEOData = (customTitle?: string, customDescription?: string) => ({
    title: customTitle || content.seo.defaultTitle,
    description: customDescription || content.seo.defaultDescription,
    keywords: content.seo.defaultKeywords,
    ogImage: content.seo.ogImage,
  });

  return {
    seo: content.seo,
    getSEOData,
  };
}

/**
 * Utility function to get content by path (e.g., 'hero.title')
 */
export function getContentByPath(path: string): any {
  const { content } = useContent();
  
  return path.split('.').reduce((obj, key) => {
    return obj && obj[key] !== undefined ? obj[key] : null;
  }, content as any);
}

/**
 * Type-safe content getter with fallback
 */
export function getContent<T>(
  getter: (content: SiteContent) => T,
  fallback: T
): T {
  try {
    return getter(siteContent);
  } catch {
    return fallback;
  }
}

// Export raw content for direct access when needed
export const rawContent = {
  site: siteContent,
  lessons: lessonContent,
};