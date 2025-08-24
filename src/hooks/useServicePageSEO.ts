/**
 * Enhanced SEO Hook for service pages
 * Combines ServicePageSEO with additional optimizations
 */

import { ServiceType } from '@/types/content';
import { useServiceMetaTags } from './useServiceSEO';
import ServicePageSEO from '@/components/ServicePageSEO';
import { StructuredData } from '@/utils/structuredData';

/**
 * Props for ServicePageSEO component
 */
interface ServicePageSEOProps {
  serviceType?: ServiceType;
  pageType?: 'about' | 'contact' | 'home';
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string;
  customImage?: string;
  includeFAQ?: boolean;
  includeBreadcrumbs?: boolean;
  additionalStructuredData?: StructuredData[];
  noIndex?: boolean;
  noFollow?: boolean;
}

/**
 * Enhanced SEO Hook for service pages
 * Combines ServicePageSEO with additional optimizations
 */
export function useServicePageSEO(
  serviceType?: ServiceType,
  pageType?: 'about' | 'contact' | 'home',
  options?: Partial<ServicePageSEOProps>
) {
  const metaTags = useServiceMetaTags(serviceType, pageType);
  
  // Return both the component and the meta tags for flexibility
  return {
    SEOComponent: ServicePageSEO({
      serviceType,
      pageType,
      ...options
    }),
    metaTags,
    // Helper function to get specific meta tag value
    getMetaTag: (tagName: string) => metaTags[tagName as keyof typeof metaTags],
    // Helper function to check if page should be indexed
    shouldIndex: !options?.noIndex
  };
}

export default useServicePageSEO;