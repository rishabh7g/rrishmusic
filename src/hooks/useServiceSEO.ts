/**
 * Service-specific SEO Hook
 * Provides optimized SEO metadata for different service pages
 */

import { useMemo } from 'react';
import { ServiceType } from '@/types/content';
import { generateStructuredData, StructuredData } from '@/utils/structuredData';

/**
 * SEO Configuration for each service type
 */
interface ServiceSEOConfig {
  title: string;
  description: string;
  keywords: string;
  image: string;
  canonicalPath: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  schemaType: string;
  structuredData: StructuredData;
}

/**
 * Base SEO configuration
 */
const BASE_SEO = {
  siteName: 'Rrish Music',
  baseUrl: 'https://www.rrishmusic.com',
  author: 'Rrish',
  twitterHandle: '@rrishmusic',
  defaultImage: '/images/og-image.jpg'
};

/**
 * Service-specific SEO configurations
 */
const SERVICE_SEO_CONFIGS: Record<ServiceType, Omit<ServiceSEOConfig, 'structuredData'>> = {
  teaching: {
    title: 'Professional Guitar Lessons - Rrish Music',
    description: 'Learn guitar with personalized instruction from professional musician Rrish. Online lessons available worldwide with flexible scheduling and proven teaching methods.',
    keywords: 'guitar lessons, music teacher, online guitar lessons, guitar instructor, music education, learn guitar, guitar coaching, music lessons',
    image: '/images/teaching-hero.jpg',
    canonicalPath: '/teaching',
    ogTitle: 'Professional Guitar Lessons with Rrish',
    ogDescription: 'Transform your musical journey with expert guitar instruction. Personalized lessons for all skill levels with a focus on technique, theory, and creativity.',
    twitterTitle: 'Guitar Lessons with Rrish Music',
    twitterDescription: 'Learn guitar from a professional musician. Online lessons, personalized approach, all skill levels welcome.',
    schemaType: 'MusicTeacher'
  },
  performance: {
    title: 'Live Music Performances - Professional Entertainment - Rrish Music',
    description: 'Book Rrish for professional live music performances. Experienced performer available for events, venues, weddings, and entertainment with diverse musical repertoire.',
    keywords: 'live music, live performer, wedding music, event entertainment, acoustic performances, professional musician, booking, live shows',
    image: '/images/performance-hero.jpg',
    canonicalPath: '/performance',
    ogTitle: 'Live Music Performances by Rrish',
    ogDescription: 'Professional live entertainment for your events. Acoustic performances, diverse repertoire, and engaging stage presence for memorable experiences.',
    twitterTitle: 'Live Music Performances - Rrish Music',
    twitterDescription: 'Professional live music for events, venues, and entertainment. Book now for memorable musical experiences.',
    schemaType: 'Performer'
  },
  collaboration: {
    title: 'Music Collaboration & Creative Services - Rrish Music',
    description: 'Collaborate with professional musician Rrish on creative projects. Session work, music production, songwriting, and artistic collaborations available worldwide.',
    keywords: 'music collaboration, session musician, music production, songwriting, creative projects, studio work, music composition, artistic collaboration',
    image: '/images/collaboration-hero.jpg',
    canonicalPath: '/collaboration',
    ogTitle: 'Music Collaboration with Rrish',
    ogDescription: 'Creative musical partnerships and professional session work. Bringing artistic vision to life through collaborative music projects.',
    twitterTitle: 'Music Collaboration - Rrish Music',
    twitterDescription: 'Creative musical collaborations and session work. Professional musician available for artistic projects worldwide.',
    schemaType: 'MusicProducer'
  }
};

/**
 * Page-specific SEO configurations for non-service pages
 */
const PAGE_SEO_CONFIGS: Record<string, Omit<ServiceSEOConfig, 'structuredData'>> = {
  about: {
    title: 'About Rrish - Professional Musician - Rrish Music',
    description: 'Meet Rrish, a professional musician specializing in performance, teaching, and collaboration. Learn about musical background, experience, and creative approach.',
    keywords: 'about Rrish, musician biography, professional musician, music background, musical experience, artist profile',
    image: '/images/rrish-profile.jpg',
    canonicalPath: '/about',
    ogTitle: 'About Rrish - Professional Musician',
    ogDescription: 'Discover the musical journey and expertise of professional musician Rrish. Performance, teaching, and collaboration experience.',
    twitterTitle: 'About Rrish - Professional Musician',
    twitterDescription: 'Professional musician with expertise in performance, teaching, and collaboration. Discover the musical journey.',
    schemaType: 'Person'
  },
  contact: {
    title: 'Contact Rrish - Book Lessons, Performances & Collaborations',
    description: 'Get in touch with Rrish for guitar lessons, live performances, or creative collaborations. Easy booking and inquiry process with quick response times.',
    keywords: 'contact Rrish, book guitar lessons, hire musician, music collaboration inquiry, performance booking, music services',
    image: '/images/contact-hero.jpg',
    canonicalPath: '/contact',
    ogTitle: 'Contact Rrish Music - Book Your Musical Experience',
    ogDescription: 'Ready to start your musical journey? Contact Rrish for lessons, performances, or collaborations. Quick response guaranteed.',
    twitterTitle: 'Contact Rrish Music',
    twitterDescription: 'Book guitar lessons, live performances, or creative collaborations. Contact professional musician Rrish today.',
    schemaType: 'ContactPage'
  },
  home: {
    title: 'Rrish Music - Performance, Teaching & Collaboration',
    description: 'Multi-service musician platform featuring live performances, professional guitar lessons, and creative collaborations. Experience professional music services tailored to your needs.',
    keywords: 'Rrish music, professional musician, guitar lessons, live performances, music collaboration, music services, music teacher, live entertainment',
    image: '/images/og-image.jpg',
    canonicalPath: '/',
    ogTitle: 'Rrish Music - Professional Music Services',
    ogDescription: 'Performance, teaching, and collaboration services from professional musician Rrish. Transform your musical experience today.',
    twitterTitle: 'Rrish Music - Multi-Service Platform',
    twitterDescription: 'Professional music services: guitar lessons, live performances, and creative collaborations. Start your musical journey.',
    schemaType: 'WebSite'
  }
};

/**
 * Hook for service-specific SEO optimization
 */
export function useServiceSEO(
  serviceType?: ServiceType,
  pageType?: 'about' | 'contact' | 'home',
  customOverrides?: Partial<ServiceSEOConfig>
): ServiceSEOConfig {
  
  return useMemo(() => {
    // Determine which config to use
    let baseConfig: Omit<ServiceSEOConfig, 'structuredData'>;
    
    if (pageType && PAGE_SEO_CONFIGS[pageType]) {
      baseConfig = PAGE_SEO_CONFIGS[pageType];
    } else if (serviceType && SERVICE_SEO_CONFIGS[serviceType]) {
      baseConfig = SERVICE_SEO_CONFIGS[serviceType];
    } else {
      baseConfig = PAGE_SEO_CONFIGS.home;
    }
    
    // Generate structured data
    const structuredData = generateStructuredData(serviceType, pageType);
    
    // Create full configuration
    const fullConfig: ServiceSEOConfig = {
      ...baseConfig,
      structuredData,
      // Apply custom overrides if provided
      ...(customOverrides || {})
    };
    
    return fullConfig;
  }, [serviceType, pageType, customOverrides]);
}

/**
 * Generate complete Open Graph tags
 */
export function generateOpenGraphTags(config: ServiceSEOConfig) {
  return {
    'og:title': config.ogTitle,
    'og:description': config.ogDescription,
    'og:image': `${BASE_SEO.baseUrl}${config.image}`,
    'og:url': `${BASE_SEO.baseUrl}${config.canonicalPath}`,
    'og:type': 'website',
    'og:site_name': BASE_SEO.siteName,
    'og:locale': 'en_US'
  };
}

/**
 * Generate Twitter Card tags
 */
export function generateTwitterTags(config: ServiceSEOConfig) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:site': BASE_SEO.twitterHandle,
    'twitter:creator': BASE_SEO.twitterHandle,
    'twitter:title': config.twitterTitle,
    'twitter:description': config.twitterDescription,
    'twitter:image': `${BASE_SEO.baseUrl}${config.image}`
  };
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  return `${BASE_SEO.baseUrl}${path}`;
}

/**
 * Hook for complete meta tag generation
 */
export function useServiceMetaTags(
  serviceType?: ServiceType,
  pageType?: 'about' | 'contact' | 'home',
  customOverrides?: Partial<ServiceSEOConfig>
) {
  const seoConfig = useServiceSEO(serviceType, pageType, customOverrides);
  
  return useMemo(() => {
    const openGraphTags = generateOpenGraphTags(seoConfig);
    const twitterTags = generateTwitterTags(seoConfig);
    const canonicalUrl = generateCanonicalUrl(seoConfig.canonicalPath);
    
    return {
      // Basic meta tags
      title: seoConfig.title,
      description: seoConfig.description,
      keywords: seoConfig.keywords,
      author: BASE_SEO.author,
      canonical: canonicalUrl,
      
      // Open Graph tags
      ...openGraphTags,
      
      // Twitter tags
      ...twitterTags,
      
      // Structured data
      structuredData: seoConfig.structuredData,
      
      // Additional SEO data
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1.0',
      charset: 'utf-8',
      language: 'en'
    };
  }, [seoConfig]);
}

/**
 * Generate service-specific FAQ structured data
 */
export function useServiceFAQs(serviceType: ServiceType) {
  return useMemo(() => {
    const faqs = {
      teaching: [
        {
          question: "What skill levels do you teach?",
          answer: "I teach all skill levels from complete beginners to advanced players looking to refine their technique and expand their musical knowledge."
        },
        {
          question: "Do you offer online lessons?",
          answer: "Yes, I offer online lessons worldwide via video call, with the same quality and personalized attention as in-person lessons."
        },
        {
          question: "What styles of music do you teach?",
          answer: "I cover a wide range of styles including acoustic, rock, pop, jazz, blues, and folk, tailored to your musical interests and goals."
        },
        {
          question: "How long are the lessons?",
          answer: "Standard lessons are 60 minutes long, providing ample time for instruction, practice, and feedback."
        }
      ],
      performance: [
        {
          question: "What types of events do you perform at?",
          answer: "I perform at weddings, corporate events, private parties, restaurants, venues, and festivals, adapting my repertoire to suit the occasion."
        },
        {
          question: "What equipment do you provide?",
          answer: "I bring professional sound equipment including microphones, amplifiers, and mixing boards for most events, ensuring high-quality audio."
        },
        {
          question: "How far in advance should I book?",
          answer: "I recommend booking at least 2-4 weeks in advance, especially for weekend events and peak seasons like wedding season."
        },
        {
          question: "Do you take song requests?",
          answer: "Yes, I'm happy to learn specific songs for your event with advance notice, ensuring your special requests are perfectly executed."
        }
      ],
      collaboration: [
        {
          question: "What types of collaborations do you do?",
          answer: "I work on original compositions, session recordings, songwriting partnerships, and creative projects across various genres and mediums."
        },
        {
          question: "Do you work remotely on projects?",
          answer: "Yes, I can contribute to projects remotely, sending high-quality recordings and collaborating via digital platforms worldwide."
        },
        {
          question: "What's your creative process like?",
          answer: "I work collaboratively, focusing on understanding your vision and bringing creative ideas that enhance and complement your artistic goals."
        },
        {
          question: "Do you help with songwriting?",
          answer: "Absolutely! I offer songwriting collaboration, helping with melody, harmony, arrangement, and bringing musical ideas to life."
        }
      ]
    };
    
    return faqs[serviceType] || [];
  }, [serviceType]);
}

export default {
  useServiceSEO,
  useServiceMetaTags,
  useServiceFAQs,
  generateOpenGraphTags,
  generateTwitterTags,
  generateCanonicalUrl,
  BASE_SEO
};