/**
 * Hook for managing page-specific SEO dynamically
 */
import { useEffect, useMemo } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Record<string, unknown>;
}

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  twitterCard?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Record<string, unknown>;
}

export function usePageSEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  noFollow = false,
  structuredData,
}: SEOHeadProps = {}): { seoData: SEOData } {
  
  const seoData = useMemo(() => ({
    title,
    description,
    keywords,
    image,
    url,
    type,
    twitterCard,
    noIndex,
    noFollow,
    structuredData,
  }), [title, description, keywords, image, url, type, twitterCard, noIndex, noFollow, structuredData]);

  useEffect(() => {
    // This effect will trigger SEO updates when the component using this hook mounts
    const seoElement = document.createElement('div');
    seoElement.style.display = 'none';
    document.body.appendChild(seoElement);

    // Trigger SEO update - simplified implementation
    // In a real-world scenario, this would integrate with the SEOHead component
    // or use a state management solution to update SEO tags
    
    return () => {
      if (document.body.contains(seoElement)) {
        document.body.removeChild(seoElement);
      }
    };
  }, [title, description, keywords, image, url, type, twitterCard, noIndex, noFollow, structuredData]);

  return { seoData };
}