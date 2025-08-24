/**
 * SEO Head Component for RrishMusic
 * Provides comprehensive meta tags and structured data for search engines
 */

import { useEffect } from 'react';
import { useSEO } from '@/hooks/useContent';
import { getCanonicalURL, getSecureAssetURL } from '@/utils/protocolHandling';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Record<string, unknown>;
}

export function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  canonical,
  type = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  noFollow = false,
  structuredData,
}: SEOHeadProps): null {
  const { data: seoData, generatePageTitle } = useSEO({
    title,
    description,
    keywords,
  });

  useEffect(() => {
    if (!seoData) return;

    const finalTitle = title ? generatePageTitle(title) : seoData.title;
    const finalDescription = description || seoData.description;
    const finalKeywords = keywords || seoData.keywords;
    const finalImage = getSecureAssetURL(image || seoData.ogImage || '/og-image.jpg');
    const finalUrl = url || canonical || getCanonicalURL(window.location.pathname);
    const finalCanonical = canonical || getCanonicalURL(window.location.pathname);

    // Set page title
    document.title = finalTitle;

    // Remove existing meta tags we'll be managing
    const existingMetas = document.querySelectorAll('meta[data-seo="managed"]');
    existingMetas.forEach((meta) => meta.remove());

    // Remove existing structured data
    const existingStructuredData = document.querySelectorAll('script[type="application/ld+json"][data-seo="managed"]');
    existingStructuredData.forEach((script) => script.remove());

    // Create meta tags
    const metaTags = [
      // Basic meta tags
      { name: 'description', content: finalDescription },
      { name: 'keywords', content: finalKeywords },
      { name: 'author', content: 'Rrish' },
      { name: 'robots', content: `${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}` },
      
      // Viewport and mobile
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'theme-color', content: '#2563eb' }, // brand-blue-primary
      
      // Open Graph
      { property: 'og:type', content: type },
      { property: 'og:title', content: finalTitle },
      { property: 'og:description', content: finalDescription },
      { property: 'og:image', content: finalImage },
      { property: 'og:url', content: finalUrl },
      { property: 'og:site_name', content: 'RrishMusic' },
      { property: 'og:locale', content: 'en_AU' },
      
      // Twitter Card
      { name: 'twitter:card', content: twitterCard },
      { name: 'twitter:title', content: finalTitle },
      { name: 'twitter:description', content: finalDescription },
      { name: 'twitter:image', content: finalImage },
      { name: 'twitter:creator', content: '@rrishmusic' },
      
      // Additional meta tags for music/education sites
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'RrishMusic' },
    ];

    // Add/update canonical link with proper HTTPS URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = finalCanonical;

    // Add meta tags to head
    metaTags.forEach((tag) => {
      const meta = document.createElement('meta');
      meta.setAttribute('data-seo', 'managed');
      
      if ('name' in tag && tag.name) {
        meta.name = tag.name;
      }
      if ('property' in tag && tag.property) {
        meta.setAttribute('property', tag.property);
      }
      if (tag.content) {
        meta.content = tag.content;
      }
      
      document.head.appendChild(meta);
    });

    // Add structured data
    const baseUrl = getCanonicalURL();
    const defaultStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Rrish',
      jobTitle: 'Music Teacher & Blues Improviser',
      description: finalDescription,
      url: baseUrl,
      image: finalImage,
      sameAs: [
        'https://instagram.com/rrishmusic',
      ],
      knowsAbout: [
        'Guitar Teaching',
        'Blues Improvisation',
        'Music Education',
        'Musical Instruments',
        'Music Theory',
      ],
      areaServed: {
        '@type': 'City',
        name: 'Melbourne',
        addressCountry: 'AU',
      },
      offers: {
        '@type': 'Service',
        serviceType: 'Music Lessons',
        provider: {
          '@type': 'Person',
          name: 'Rrish',
        },
      },
    };

    const finalStructuredData = structuredData || defaultStructuredData;

    if (finalStructuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'managed');
      script.textContent = JSON.stringify(finalStructuredData);
      document.head.appendChild(script);
    }

    // Add additional structured data for LocalBusiness if applicable
    const localBusinessData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}#business`,
      name: 'RrishMusic',
      description: 'Professional music lessons and blues improvisation instruction in Melbourne',
      url: baseUrl,
      telephone: '',  // Add when available
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Melbourne',
        addressRegion: 'Victoria',
        addressCountry: 'AU',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -37.8136,
        longitude: 144.9631,
      },
      openingHours: ['Mo-Su 09:00-18:00'], // Update based on actual schedule
      priceRange: '$$',
      servedCuisine: [],
      serviceArea: {
        '@type': 'City',
        name: 'Melbourne',
      },
    };

    const localBusinessScript = document.createElement('script');
    localBusinessScript.type = 'application/ld+json';
    localBusinessScript.setAttribute('data-seo', 'managed');
    localBusinessScript.textContent = JSON.stringify(localBusinessData);
    document.head.appendChild(localBusinessScript);

  }, [seoData, title, description, keywords, image, url, canonical, type, twitterCard, noIndex, noFollow, structuredData, generatePageTitle]);

  return null;
}

export default SEOHead;