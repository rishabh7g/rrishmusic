/**
 * Hook for managing page-specific SEO dynamically
 */
import { useEffect } from 'react';

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

export function usePageSEO(props: SEOHeadProps = {}): { seoData: Required<SEOHeadProps> } {
  const {
    title = 'Rrish Music - Live Piano Performance | Music Teaching | Collaboration',
    description = 'Professional piano performance, music teaching, and collaboration services. Book live performances, learn piano, or collaborate on musical projects.',
    keywords = 'piano, music, performance, teaching, collaboration, live music, piano lessons, music lessons',
    image = '/images/rrish-profile.jpg',
    url = 'https://www.rrishmusic.com',
    type = 'website' as const,
    twitterCard = 'summary_large_image' as const,
    noIndex = false,
    noFollow = false,
    structuredData = {},
  } = props;

  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (attribute: string, value: string, content: string) => {
      let meta = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, value);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('property', 'og:type', type);

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', twitterCard);
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);

    // Update robots meta tag
    const robotsContent = [
      noIndex ? 'noindex' : 'index',
      noFollow ? 'nofollow' : 'follow'
    ].join(', ');
    updateMetaTag('name', 'robots', robotsContent);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;

    // Add structured data
    if (Object.keys(structuredData).length > 0) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, image, url, type, twitterCard, noIndex, noFollow, structuredData]);

  return {
    seoData: {
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
    }
  };
}