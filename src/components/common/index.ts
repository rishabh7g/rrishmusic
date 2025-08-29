/**
 * Common Components Export
 * Centralized exports for reusable components
 */
export { default as ErrorBoundary } from './ErrorBoundary'
export { default as SEOHead } from './SEOHead'
export { usePageSEO } from '@/hooks/usePageSEO'
export { generateMetaDescription, validateStructuredData } from '@/utils/seo'
export {
  default as LazySection,
  LazyImage,
  withLazyLoading,
  createLazyComponent,
  useImagePreloader,
  usePerformanceMonitor,
} from './LazySection'
