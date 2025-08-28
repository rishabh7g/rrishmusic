/**
 * Structured Data (JSON-LD) Utilities for Service Pages
 * Generates schema.org markup for enhanced SEO
 */

import { ServiceType } from '@/types/content'

/**
 * Schema.org structured data types
 */
export interface StructuredData {
  '@context': string
  '@type': string | string[]
  [key: string]: unknown
}

/**
 * Base organization schema
 */
const BASE_ORGANIZATION = {
  '@type': 'Person',
  name: 'Rrish',
  alternateName: 'Rrish Music',
  description:
    'Professional musician specializing in performance, teaching, and collaboration',
  url: 'https://www.rrishmusic.com',
  image: 'https://www.rrishmusic.com/images/rrish-profile.jpg',
  sameAs: ['https://www.instagram.com/rrishmusic'],
  knowsAbout: [
    'Music Performance',
    'Guitar Teaching',
    'Music Collaboration',
    'Live Music',
    'Session Work',
  ],
  jobTitle: 'Professional Musician',
  worksFor: {
    '@type': 'Organization',
    name: 'Rrish Music',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
}

/**
 * Service-specific schema generators
 */

/**
 * Generate Teaching Service schema
 */
export function generateTeachingSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': ['Person', 'MusicTeacher'],
    ...BASE_ORGANIZATION,
    description:
      'Professional guitar instructor offering personalized music lessons for all skill levels',
    teachesSubject: [
      'Guitar',
      'Music Theory',
      'Performance Technique',
      'Song Writing',
      'Music Composition',
    ],
    offers: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Guitar Lessons',
        description:
          'Professional guitar instruction with personalized approach',
        serviceType: 'Music Education',
        provider: {
          '@type': 'Person',
          name: 'Rrish',
        },
      },
      priceSpecification: [
        {
          '@type': 'PriceSpecification',
          price: '45.00',
          priceCurrency: 'USD',
          name: 'Trial Lesson',
        },
        {
          '@type': 'PriceSpecification',
          price: '50.00',
          priceCurrency: 'USD',
          name: 'Single Lesson',
        },
        {
          '@type': 'PriceSpecification',
          price: '190.00',
          priceCurrency: 'USD',
          name: 'Foundation Package (4 lessons)',
        },
      ],
    },
    areaServed: 'Worldwide (Online)',
    availableLanguage: 'English',
  }
}

/**
 * Generate Performance Service schema
 */
export function generatePerformanceSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': ['Person', 'MusicGroup', 'Performer'],
    ...BASE_ORGANIZATION,
    description:
      'Professional live music performer available for events, venues, and entertainment',
    genre: ['Acoustic', 'Pop', 'Rock', 'Jazz', 'Blues', 'Folk'],
    performerIn: {
      '@type': 'Event',
      eventStatus: 'EventScheduled',
      eventAttendanceMode: 'OfflineEventAttendanceMode',
      name: 'Live Music Performance',
      description: 'Professional live music entertainment',
    },
    offers: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Live Music Performance',
        description: 'Professional live entertainment for events and venues',
        serviceType: 'Entertainment',
        provider: {
          '@type': 'Person',
          name: 'Rrish',
        },
      },
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: 'Contact for Quote',
        priceCurrency: 'USD',
      },
    },
    areaServed: 'United States',
  }
}

/**
 * Generate Collaboration Service schema
 */
export function generateCollaborationSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': ['Person', 'MusicProducer', 'Composer'],
    ...BASE_ORGANIZATION,
    description:
      'Creative musician available for collaborations, session work, and music production',
    hasCredential: [
      'Session Musician',
      'Music Producer',
      'Songwriter',
      'Arranger',
    ],
    offers: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Music Collaboration',
        description: 'Professional music collaboration and creative services',
        serviceType: 'Music Production',
        provider: {
          '@type': 'Person',
          name: 'Rrish',
        },
      },
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: 'Contact for Quote',
        priceCurrency: 'USD',
      },
    },
    workExample: [
      {
        '@type': 'CreativeWork',
        name: 'Original Compositions',
        description: 'Custom music compositions and arrangements',
      },
      {
        '@type': 'CreativeWork',
        name: 'Session Work',
        description: 'Professional recording session contributions',
      },
    ],
    areaServed: 'Worldwide',
  }
}

/**
 * Generate About Page schema
 */
export function generateAboutSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    ...BASE_ORGANIZATION,
    description:
      'Professional musician with expertise in performance, teaching, and collaboration',
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'Music Teacher',
        occupationLocation: 'Online',
        skills: ['Guitar Instruction', 'Music Theory', 'Performance Coaching'],
      },
      {
        '@type': 'Occupation',
        name: 'Live Performer',
        occupationLocation: 'United States',
        skills: ['Live Performance', 'Entertainment', 'Stage Presence'],
      },
      {
        '@type': 'Occupation',
        name: 'Music Collaborator',
        occupationLocation: 'Worldwide',
        skills: ['Music Production', 'Session Work', 'Composition'],
      },
    ],
  }
}

/**
 * Generate Contact Page schema
 */
export function generateContactSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    ...BASE_ORGANIZATION,
    description:
      'Get in touch for music lessons, live performances, or collaboration opportunities',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: 'English',
        areaServed: 'Worldwide',
      },
    ],
  }
}

/**
 * Generate Website/Organization schema for homepage
 */
export function generateWebsiteSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rrish Music',
    alternateName: 'Rrish Music - Performance, Teaching & Collaboration',
    description:
      'Multi-service musician platform featuring live performances, music teaching, and creative collaborations',
    url: 'https://www.rrishmusic.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.rrishmusic.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Person',
      name: 'Rrish',
      url: 'https://www.rrishmusic.com',
    },
    mainEntity: {
      '@type': 'Person',
      ...BASE_ORGANIZATION,
    },
  }
}

/**
 * Main schema generator based on service type or page
 */
export function generateStructuredData(
  serviceType?: ServiceType,
  pageType?: 'about' | 'contact' | 'home'
): StructuredData {
  if (pageType === 'home') {
    return generateWebsiteSchema()
  }

  if (pageType === 'about') {
    return generateAboutSchema()
  }

  if (pageType === 'contact') {
    return generateContactSchema()
  }

  switch (serviceType) {
    case 'teaching':
      return generateTeachingSchema()
    case 'performance':
      return generatePerformanceSchema()
    case 'collaboration':
      return generateCollaborationSchema()
    default:
      return generateWebsiteSchema()
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{
    name: string
    url: string
  }>
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

/**
 * Generate FAQ schema for service pages
 */
export function generateFAQSchema(
  faqs: Array<{
    question: string
    answer: string
  }>
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate Review schema for testimonials
 */
export function generateReviewSchema(
  reviews: Array<{
    author: string
    rating: number
    text: string
    date?: string
  }>
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    ...BASE_ORGANIZATION,
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
      },
      reviewBody: review.text,
      ...(review.date && { datePublished: review.date }),
    })),
  }
}

export default {
  generateStructuredData,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateReviewSchema,
  generateTeachingSchema,
  generatePerformanceSchema,
  generateCollaborationSchema,
  generateAboutSchema,
  generateContactSchema,
  generateWebsiteSchema,
}
