/**
 * Content Management System Index
 * 
 * Main entry point for the RrishMusic content management system.
 * Exports all types, hooks, utilities, and validation functions.
 */

// Export all types
export * from './types';

// Export all hooks
export * from './hooks/useContent';

// Export validation utilities
export * from './utils/validation';

// Re-export commonly used items with shorter names for convenience
export { 
  useContent as useMainContent,
  useSectionContent as useSection,
  useLessonPackages as useLessons,
  useTestimonials,
  useContactMethods as useContact,
  useSEO,
  useNavigation as useNav,
  useContentSearch as useSearch,
  useContentPath as usePath,
  contentUtils as utils
} from './hooks/useContent';

export {
  validateSiteContent as validateContent,
  validateLessonPackage as validatePackage,
  validateTestimonial,
  validateContactMethod as validateContact,
  validationUtils
} from './utils/validation';

// Export validation error codes for external use
export { ValidationErrorCodes } from './utils/validation';

// Type guards and utilities
export const isContentLoading = (state: { loading?: boolean; isLoading?: boolean }): boolean => {
  return Boolean(state.loading || state.isLoading);
};

export const hasContentError = (state: { error?: string | null }): boolean => {
  return Boolean(state.error);
};

// Content management utilities
export const contentManager = {
  /**
   * Check if content is ready for use
   */
  isContentReady: (content: unknown): boolean => {
    return content !== null && content !== undefined && typeof content === 'object';
  },

  /**
   * Get content loading state summary
   */
  getLoadingState: (states: Array<{ loading?: boolean; error?: string | null }>): {
    isLoading: boolean;
    hasErrors: boolean;
    errorCount: number;
    allLoaded: boolean;
  } => {
    const isLoading = states.some(state => state.loading);
    const errors = states.filter(state => state.error);
    const hasErrors = errors.length > 0;
    const allLoaded = states.every(state => !state.loading && !state.error);

    return {
      isLoading,
      hasErrors,
      errorCount: errors.length,
      allLoaded
    };
  },

  /**
   * Merge multiple content states
   */
  mergeContentStates: <T>(...states: Array<{
    data?: T;
    loading?: boolean;
    error?: string | null;
  }>): {
    data: T[];
    loading: boolean;
    error: string | null;
    hasData: boolean;
  } => {
    const data = states.map(state => state.data).filter(Boolean) as T[];
    const loading = states.some(state => state.loading);
    const errors = states.map(state => state.error).filter(Boolean);
    const error = errors.length > 0 ? errors.join('; ') : null;

    return {
      data,
      loading,
      error,
      hasData: data.length > 0
    };
  }
};

// Development helpers
export const devHelpers = {
  /**
   * Log content structure for debugging
   */
  logContentStructure: (content: unknown, depth = 2): void => {
    if (process.env.NODE_ENV === 'development') {
      console.group('Content Structure');
      console.log(JSON.stringify(content, null, 2));
      console.groupEnd();
    }
  },

  /**
   * Performance measurement for content operations
   */
  measureContentOperation: async <T>(
    operation: () => Promise<T> | T,
    operationName: string
  ): Promise<{ result: T; duration: number }> => {
    const start = performance.now();
    const result = await operation();
    const duration = performance.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log(`Content operation "${operationName}" took ${duration.toFixed(2)}ms`);
    }

    return { result, duration };
  },

  /**
   * Validate content in development mode
   */
  validateInDevelopment: (content: unknown, sectionName?: string): void => {
    if (process.env.NODE_ENV === 'development') {
      const validation = validateSiteContent(content);
      
      if (!validation.valid) {
        console.warn(`Content validation failed for ${sectionName || 'unknown section'}:`, validation.errors);
      }

      if (validation.warnings.length > 0) {
        console.info(`Content warnings for ${sectionName || 'unknown section'}:`, validation.warnings);
      }
    }
  }
};

// Constants for content management
export const CONTENT_CONSTANTS = {
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_BASE: 1000, // 1 second
  SEARCH_MIN_QUERY_LENGTH: 2,
  DEFAULT_ITEMS_PER_PAGE: 10,
  MAX_TESTIMONIAL_LENGTH: 1000,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500
} as const;

// Export version info
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

// Main content management interface
export interface ContentManager {
  // Core functionality
  getContent: () => Promise<any>;
  validateContent: (content: unknown) => Promise<boolean>;
  refreshContent: () => Promise<void>;
  
  // Search and filtering
  searchContent: (query: string) => Promise<any[]>;
  filterContent: (filters: Record<string, unknown>) => Promise<any[]>;
  
  // Validation and health checks
  runHealthCheck: () => Promise<{ healthy: boolean; issues: string[] }>;
  validateAllSections: () => Promise<Record<string, boolean>>;
}

// Default export for convenience
export default {
  // Hooks
  useContent,
  useSectionContent,
  useLessonPackages,
  useTestimonials,
  useContactMethods,
  useSEO,
  useNavigation,
  useContentSearch,
  useContentPath,
  
  // Validation
  validateSiteContent,
  validateLessonPackage,
  validateTestimonial,
  validateContactMethod,
  validationUtils,
  
  // Utilities
  contentUtils,
  contentManager,
  devHelpers,
  
  // Constants
  CONTENT_CONSTANTS,
  VERSION,
  BUILD_DATE
};