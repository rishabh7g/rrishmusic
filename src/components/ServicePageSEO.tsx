/**
 * Service Page SEO Component
 * Enhanced SEO component specifically for service pages with structured data
 */

import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ServiceType } from '@/types/content'
import { useServiceMetaTags, useServiceFAQs } from '@/hooks/useServiceSEO'
import {
  generateFAQSchema,
  generateBreadcrumbSchema,
  StructuredData,
} from '@/utils/structuredData'
import { getBreadcrumbs } from '@/utils/pageHierarchy'
import { useLocation } from 'react-router-dom'

/**
 * Props for ServicePageSEO component
 */
interface ServicePageSEOProps {
  serviceType?: ServiceType
  pageType?: 'about' | 'contact' | 'home'
  customTitle?: string
  customDescription?: string
  customKeywords?: string
  customImage?: string
  includeFAQ?: boolean
  includeBreadcrumbs?: boolean
  additionalStructuredData?: StructuredData[]
  noIndex?: boolean
  noFollow?: boolean
}

/**
 * ServicePageSEO Component
 *
 * Provides comprehensive SEO optimization for service pages including:
 * - Dynamic meta tags based on service type
 * - Open Graph and Twitter Card support
 * - Structured data (JSON-LD) for enhanced search results
 * - FAQ schema for better SERP features
 * - Breadcrumb navigation schema
 * - Service-specific optimization
 */
export const ServicePageSEO: React.FC<ServicePageSEOProps> = ({
  serviceType,
  pageType,
  customTitle,
  customDescription,
  customKeywords,
  customImage,
  includeFAQ = true,
  includeBreadcrumbs = true,
  additionalStructuredData = [],
  noIndex = false,
  noFollow = false,
}) => {
  const location = useLocation()

  // Get optimized meta tags for this service/page
  const metaTags = useServiceMetaTags(serviceType, pageType, {
    ...(customTitle && { title: customTitle }),
    ...(customDescription && { description: customDescription }),
    ...(customKeywords && { keywords: customKeywords }),
    ...(customImage && { image: customImage }),
  })

  // Get service-specific FAQs
  const faqs = useServiceFAQs(serviceType!)

  // Get breadcrumbs for current page
  const breadcrumbs = getBreadcrumbs(location.pathname)

  // Generate additional structured data
  const structuredDataItems = []

  // Add main service/page structured data
  structuredDataItems.push(metaTags.structuredData)

  // Add FAQ structured data if enabled and available
  if (includeFAQ && faqs.length > 0) {
    structuredDataItems.push(generateFAQSchema(faqs))
  }

  // Add breadcrumb structured data if enabled and available
  if (includeBreadcrumbs && breadcrumbs.length > 1) {
    const breadcrumbData = breadcrumbs.map(crumb => ({
      name: crumb.title,
      url: `https://www.rrishmusic.com${crumb.path}`,
    }))
    structuredDataItems.push(generateBreadcrumbSchema(breadcrumbData))
  }

  // Add any additional structured data provided
  if (additionalStructuredData.length > 0) {
    structuredDataItems.push(...additionalStructuredData)
  }

  // Generate robots content
  const robotsContent = `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`

  // Track page view for analytics (if needed)
  useEffect(() => {
    // Could add analytics tracking here
    if (
      typeof window !== 'undefined' &&
      (window as unknown as { gtag?: unknown }).gtag
    ) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void })
        .gtag
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: metaTags.title,
        page_location: window.location.href,
      })
    }
  }, [metaTags.title])

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      <meta name="keywords" content={metaTags.keywords} />
      <meta name="author" content={metaTags.author} />
      <meta name="robots" content={robotsContent} />
      <meta name="viewport" content={metaTags.viewport} />
      <meta charSet={metaTags.charset} />
      <meta httpEquiv="content-language" content={metaTags.language} />

      {/* Canonical URL */}
      <link rel="canonical" href={metaTags.canonical} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={metaTags['og:title']} />
      <meta property="og:description" content={metaTags['og:description']} />
      <meta property="og:image" content={metaTags['og:image']} />
      <meta property="og:url" content={metaTags['og:url']} />
      <meta property="og:type" content={metaTags['og:type']} />
      <meta property="og:site_name" content={metaTags['og:site_name']} />
      <meta property="og:locale" content={metaTags['og:locale']} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={metaTags['twitter:card']} />
      <meta name="twitter:site" content={metaTags['twitter:site']} />
      <meta name="twitter:creator" content={metaTags['twitter:creator']} />
      <meta name="twitter:title" content={metaTags['twitter:title']} />
      <meta
        name="twitter:description"
        content={metaTags['twitter:description']}
      />
      <meta name="twitter:image" content={metaTags['twitter:image']} />

      {/* Additional SEO Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />

      {/* Structured Data (JSON-LD) */}
      {structuredDataItems.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2),
          }}
        />
      ))}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://www.instagram.com" />

      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

      {/* Alternate language versions (if applicable) */}
      <link rel="alternate" hrefLang="en" href={metaTags.canonical} />

      {/* Service-specific additional tags */}
      {serviceType === 'teaching' && (
        <>
          <meta name="course-type" content="music-education" />
          <meta name="instructor" content="Rrish" />
          <meta name="subject" content="Guitar" />
        </>
      )}

      {serviceType === 'performance' && (
        <>
          <meta name="event-type" content="live-music" />
          <meta name="performer" content="Rrish" />
          <meta name="genre" content="acoustic, pop, rock, jazz, blues, folk" />
        </>
      )}

      {serviceType === 'collaboration' && (
        <>
          <meta name="service-type" content="music-production" />
          <meta
            name="collaboration-type"
            content="session-work, songwriting, composition"
          />
          <meta name="availability" content="worldwide" />
        </>
      )}
    </Helmet>
  )
}

export default ServicePageSEO
