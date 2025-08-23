/**
 * Content Management Utilities
 * 
 * This file provides utilities for managing and validating content
 * Used for development and content updates
 */

import type { SiteContent, LessonContent, Testimonial } from '@/types/content';

/**
 * Content validation functions
 */
export const validateContent = {
  siteContent: (content: any): content is SiteContent => {
    const required = ['hero', 'about', 'approach', 'community', 'contact', 'seo'];
    return required.every(key => key in content);
  },

  lessonContent: (content: any): content is LessonContent => {
    return 'title' in content && 'packages' in content && Array.isArray(content.packages);
  },

  testimonial: (testimonial: any): testimonial is Testimonial => {
    const required = ['id', 'name', 'text', 'rating'];
    return required.every(key => key in testimonial) && 
           typeof testimonial.rating === 'number' &&
           testimonial.rating >= 1 && testimonial.rating <= 5;
  }
};

/**
 * Content transformation utilities
 */
export const contentUtils = {
  /**
   * Format price with currency
   */
  formatPrice: (price: number, currency = 'AUD'): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  },

  /**
   * Calculate package savings
   */
  calculateSavings: (packagePrice: number, sessions: number, singlePrice: number): number => {
    if (sessions === 0) return 0; // Unlimited packages
    const fullPrice = sessions * singlePrice;
    return Math.round(((fullPrice - packagePrice) / fullPrice) * 100);
  },

  /**
   * Generate SEO-friendly slugs
   */
  generateSlug: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  /**
   * Truncate text to specified length
   */
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
  },

  /**
   * Get testimonials by filter
   */
  filterTestimonials: (
    testimonials: Testimonial[], 
    filters: {
      featured?: boolean;
      instrument?: string;
      level?: string;
      minRating?: number;
    } = {}
  ): Testimonial[] => {
    return testimonials.filter(testimonial => {
      if (filters.featured !== undefined && testimonial.featured !== filters.featured) {
        return false;
      }
      if (filters.instrument && testimonial.instrument !== filters.instrument) {
        return false;
      }
      if (filters.level && testimonial.level !== filters.level) {
        return false;
      }
      if (filters.minRating && testimonial.rating < filters.minRating) {
        return false;
      }
      return true;
    });
  }
};

/**
 * Content structure helpers
 */
export const contentStructure = {
  /**
   * Get all available content sections
   */
  getSections: (content: SiteContent): string[] => {
    return Object.keys(content);
  },

  /**
   * Validate content structure
   */
  validateStructure: (content: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!content) {
      errors.push('Content is null or undefined');
      return { valid: false, errors };
    }

    // Check required sections
    const requiredSections = ['hero', 'about', 'approach', 'community', 'contact', 'seo'];
    for (const section of requiredSections) {
      if (!content[section]) {
        errors.push(`Missing required section: ${section}`);
      }
    }

    // Validate hero section
    if (content.hero) {
      const requiredHeroFields = ['title', 'subtitle'];
      for (const field of requiredHeroFields) {
        if (!content.hero[field]) {
          errors.push(`Missing hero.${field}`);
        }
      }
    }

    // Validate contact methods
    if (content.contact?.methods) {
      content.contact.methods.forEach((method: any, index: number) => {
        if (!method.type || !method.label || !method.value) {
          errors.push(`Invalid contact method at index ${index}`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};

/**
 * Development helpers
 */
export const devHelpers = {
  /**
   * Log content structure for debugging
   */
  logContentStructure: (content: any, depth = 2): void => {
    const inspect = (obj: any, currentDepth = 0): any => {
      if (currentDepth >= depth || obj === null || typeof obj !== 'object') {
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.length > 0 ? [inspect(obj[0], currentDepth + 1)] : [];
      }
      
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = inspect(value, currentDepth + 1);
      }
      return result;
    };
    
    console.log('Content Structure:', JSON.stringify(inspect(content), null, 2));
  },

  /**
   * Generate content template
   */
  generateTemplate: (sectionType: keyof SiteContent): any => {
    const templates = {
      hero: {
        title: 'Your Title Here',
        subtitle: 'Your subtitle here',
        ctaText: 'Call to action text',
        instagramHandle: '@yourhandle',
        instagramUrl: 'https://instagram.com/yourhandle'
      },
      about: {
        title: 'About Section',
        content: ['Paragraph 1', 'Paragraph 2'],
        skills: ['Skill 1', 'Skill 2']
      },
      approach: {
        title: 'Your Approach',
        subtitle: 'Approach subtitle', 
        principles: [
          {
            title: 'Principle 1',
            description: 'Description of principle',
            icon: 'icon-name'
          }
        ]
      },
      community: {
        title: 'Community',
        description: 'Community description',
        features: ['Feature 1', 'Feature 2'],
        instagramFeed: {
          title: 'Feed title',
          description: 'Feed description'
        }
      },
      contact: {
        title: 'Contact',
        subtitle: 'Contact subtitle',
        methods: [
          {
            type: 'email' as const,
            label: 'Email',
            value: 'your@email.com',
            href: 'mailto:your@email.com',
            primary: true
          }
        ],
        location: 'Your Location'
      },
      seo: {
        defaultTitle: 'Your Site Title',
        defaultDescription: 'Your site description',
        defaultKeywords: 'your, keywords, here',
        ogImage: '/images/og-image.jpg'
      }
    };
    
    return templates[sectionType];
  }
};