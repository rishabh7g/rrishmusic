/**
 * Common Components Export
 * Centralized exports for reusable components
 */

export { default as ErrorBoundary, SimpleErrorBoundary, useErrorHandler } from './ErrorBoundary';
export { default as SEOHead, usePageSEO, generateMetaDescription, validateStructuredData } from './SEOHead';
export { 
  default as LazySection, 
  LazyImage, 
  withLazyLoading, 
  createLazyComponent,
  useImagePreloader,
  usePerformanceMonitor 
} from './LazySection';