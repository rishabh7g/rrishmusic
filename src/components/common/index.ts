/**
 * Common Components Export
 * Centralized exports for reusable components
 */
export { default as ErrorBoundary } from './ErrorBoundary'
export { default as SEOHead } from './SEOHead'
export { BlockErrorFallback } from './BlockErrorFallback'
export { usePageSEO } from '@/hooks/usePageSEO'
export { generateMetaDescription, validateStructuredData } from '@/utils/seo'
