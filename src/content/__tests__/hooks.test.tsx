/**
 * Content Hooks Tests
 * 
 * Tests for React hooks used in the RrishMusic content management system.
 * Tests loading states, error handling, caching, and data transformation.
 */

import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { 
  useContent, 
  useSectionContent, 
  useLessonPackages,
  useTestimonials,
  useContactMethods,
  useSEO,
  useNavigation,
  useContentSearch,
  useContentPath,
  contentUtils
} from '../hooks/useContent';
import type { 
  SiteContent, 
  LessonPackage, 
  Testimonial, 
  ContactMethod,
  ContentSection 
} from '../types';

// Mock the JSON imports
vi.mock('../data/site-content.json', () => ({
  default: mockSiteContent
}));

vi.mock('../data/lessons.json', () => ({
  default: mockLessonsData
}));

// Mock validation functions
vi.mock('../utils/validation', () => ({
  validateSiteContent: vi.fn(() => ({ valid: true, errors: [], warnings: [] })),
  validateLessonPackage: vi.fn(() => ({ valid: true, errors: [], warnings: [] })),
  validateTestimonial: vi.fn(() => ({ valid: true, errors: [], warnings: [] })),
}));

// Mock site content data
const mockSiteContent: SiteContent = {
  id: 'site-1',
  lastUpdated: '2024-08-23',
  version: '1.0.0',
  hero: {
    id: 'hero-1',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    title: 'Professional Music Teacher',
    subtitle: 'Learn guitar, piano, and blues improvisation',
    ctaText: 'Start Your Journey',
    instagramHandle: '@rrish_music',
    instagramUrl: 'https://instagram.com/rrish_music',
    socialProof: {
      studentsCount: 150,
      yearsExperience: 10,
      successStories: 50
    }
  },
  about: {
    id: 'about-1',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    biography: 'Passionate music teacher with years of experience',
    profileImage: {
      src: '/images/profile.jpg',
      alt: 'Rrish profile',
      width: 400,
      height: 400
    },
    skills: [
      { name: 'Guitar', level: 'expert', yearsExperience: 10 },
      { name: 'Piano', level: 'advanced', yearsExperience: 8 }
    ]
  },
  community: {
    id: 'community-1',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    testimonials: {
      featured: [
        {
          id: 'testimonial-1',
          lastUpdated: '2024-08-23',
          version: '1.0.0',
          studentName: 'Alex Johnson',
          content: 'Amazing teacher!',
          rating: 5,
          date: '2024-08-20',
          featured: true,
          studentLevel: 'intermediate'
        }
      ],
      all: [
        {
          id: 'testimonial-1',
          lastUpdated: '2024-08-23',
          version: '1.0.0',
          studentName: 'Alex Johnson',
          content: 'Amazing teacher!',
          rating: 5,
          date: '2024-08-20',
          featured: true,
          studentLevel: 'intermediate'
        },
        {
          id: 'testimonial-2',
          lastUpdated: '2024-08-23',
          version: '1.0.0',
          studentName: 'Sarah Wilson',
          content: 'Great lessons!',
          rating: 5,
          date: '2024-08-15',
          featured: false,
          studentLevel: 'beginner'
        }
      ]
    }
  },
  contact: {
    id: 'contact-1',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    methods: [
      { type: 'email', value: 'rrish@example.com', label: 'Email', primary: true },
      { type: 'phone', value: '+1-555-0123', label: 'Phone' },
      { type: 'instagram', value: '@rrish_music', label: 'Instagram' }
    ]
  },
  seo: {
    id: 'seo-1',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    defaultTitle: 'Rrish Music - Professional Music Teacher',
    defaultDescription: 'Learn music with professional instruction',
    keywords: ['music teacher', 'guitar lessons', 'piano lessons'],
    canonicalUrl: 'https://www.rrishmusic.com',
    openGraph: {
      title: 'Rrish Music',
      description: 'Professional Music Teacher',
      image: '/images/og-image.jpg',
      type: 'website'
    }
  },
  navigation: {
    id: 'nav-1',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    items: [
      { id: 'home', label: 'Home', href: '/', order: 1 },
      { id: 'about', label: 'About', href: '/about', order: 2 },
      { id: 'lessons', label: 'Lessons', href: '/lessons', order: 3 }
    ]
  }
};

const mockLessonsData: LessonPackage[] = [
  {
    id: 'lesson-1',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    name: 'Blues Guitar Mastery',
    description: 'Learn blues guitar from beginner to advanced',
    duration: 60,
    price: 75,
    currency: 'USD',
    targetAudience: ['beginner', 'intermediate'],
    instruments: ['guitar'],
    features: ['One-on-one instruction', 'Practice materials']
  },
  {
    id: 'lesson-2',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    name: 'Piano Fundamentals',
    description: 'Master piano basics',
    duration: 45,
    price: 60,
    currency: 'USD',
    targetAudience: ['beginner'],
    instruments: ['piano'],
    features: ['Beginner friendly', 'Theory included']
  }
];

describe('Content Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any cached content
    localStorage.clear();
    // Reset timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useContent Hook', () => {
    it('should initialize with loading state', async () => {
      const { result } = renderHook(() => useContent());

      expect(result.current.loading).toBe(true);
      expect(result.current.content).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should load content successfully', async () => {
      const { result } = renderHook(() => useContent());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.content).toEqual(mockSiteContent);
      expect(result.current.error).toBeNull();
      expect(result.current.validationResult?.valid).toBe(true);
    });

    it('should handle content loading errors', async () => {
      // Mock validation to throw an error
      const { validateSiteContent } = await import('../utils/validation');
      (validateSiteContent as Mock).mockImplementation(() => {
        throw new Error('Validation failed');
      });

      const { result } = renderHook(() => useContent());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Validation failed');
      expect(result.current.content).toBeNull();
    });

    it('should implement retry mechanism', async () => {
      let callCount = 0;
      const { validateSiteContent } = await import('../utils/validation');
      (validateSiteContent as Mock).mockImplementation(() => {
        callCount++;
        if (callCount < 2) {
          throw new Error('Temporary failure');
        }
        return { valid: true, errors: [], warnings: [] };
      });

      const { result } = renderHook(() => useContent());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.error).toBe('Temporary failure');
      });

      // Trigger retry
      act(() => {
        result.current.retry();
      });

      await waitFor(() => {
        expect(result.current.content).toEqual(mockSiteContent);
        expect(result.current.error).toBeNull();
      });

      expect(callCount).toBe(2);
    });

    it('should refresh content', async () => {
      const { result } = renderHook(() => useContent());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Trigger refresh
      act(() => {
        result.current.refresh();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.content).toEqual(mockSiteContent);
    });

    it('should handle hot reload in development', async () => {
      // Mock development environment
      vi.stubEnv('NODE_ENV', 'development');

      const { result } = renderHook(() => useContent());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Simulate hot reload event
      act(() => {
        window.dispatchEvent(new Event('vite:beforeUpdate'));
      });

      expect(result.current.loading).toBe(true);
    });
  });

  describe('useSectionContent Hook', () => {
    it('should return section content', async () => {
      const { result } = renderHook(() => useSectionContent('hero'));

      await waitFor(() => {
        expect(result.current.sectionData).toEqual(mockSiteContent.hero);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return null for non-existent section', async () => {
      const { result } = renderHook(() => useSectionContent('nonexistent' as ContentSection));

      await waitFor(() => {
        expect(result.current.sectionData).toBeNull();
      });
    });

    it('should return section-specific validation errors', async () => {
      const mockValidation = {
        valid: false,
        errors: [
          { field: 'hero.title', message: 'Title required', severity: 'error' as const, code: 'REQUIRED' },
          { field: 'about.bio', message: 'Bio required', severity: 'error' as const, code: 'REQUIRED' }
        ],
        warnings: []
      };

      const { validateSiteContent } = await import('../utils/validation');
      (validateSiteContent as Mock).mockReturnValue(mockValidation);

      const { result } = renderHook(() => useSectionContent('hero'));

      await waitFor(() => {
        expect(result.current.sectionErrors).toHaveLength(1);
        expect(result.current.sectionErrors[0].field).toBe('hero.title');
      });
    });
  });

  describe('useLessonPackages Hook', () => {
    it('should return all lesson packages', async () => {
      const { result } = renderHook(() => useLessonPackages());

      await waitFor(() => {
        expect(result.current.packages).toHaveLength(2);
      });

      expect(result.current.packages[0].name).toBe('Blues Guitar Mastery');
      expect(result.current.packages[1].name).toBe('Piano Fundamentals');
    });

    it('should filter packages by target audience', async () => {
      const { result } = renderHook(() => 
        useLessonPackages({ 
          targetAudience: ['beginner'] 
        })
      );

      await waitFor(() => {
        expect(result.current.packages).toHaveLength(2); // Both packages support beginners
      });
    });

    it('should filter packages by instruments', async () => {
      const { result } = renderHook(() => 
        useLessonPackages({ 
          instruments: ['guitar'] 
        })
      );

      await waitFor(() => {
        expect(result.current.packages).toHaveLength(1);
        expect(result.current.packages[0].name).toBe('Blues Guitar Mastery');
      });
    });

    it('should filter packages by price range', async () => {
      const { result } = renderHook(() => 
        useLessonPackages({ 
          priceRange: { min: 70, max: 100 } 
        })
      );

      await waitFor(() => {
        expect(result.current.packages).toHaveLength(1);
        expect(result.current.packages[0].price).toBe(75);
      });
    });

    it('should calculate package statistics', async () => {
      const { result } = renderHook(() => useLessonPackages());

      await waitFor(() => {
        expect(result.current.stats.total).toBe(2);
        expect(result.current.stats.averagePrice).toBe(67.5); // (75 + 60) / 2
        expect(result.current.stats.priceRange.min).toBe(60);
        expect(result.current.stats.priceRange.max).toBe(75);
      });
    });

    it('should handle validation errors in packages', async () => {
      const { validateLessonPackage } = await import('../utils/validation');
      (validateLessonPackage as Mock).mockReturnValue({
        valid: false,
        errors: [{ field: 'price', message: 'Invalid price', severity: 'error', code: 'INVALID' }],
        warnings: []
      });

      const { result } = renderHook(() => useLessonPackages());

      await waitFor(() => {
        expect(result.current.packages).toHaveLength(0); // Invalid packages filtered out
      });
    });
  });

  describe('useTestimonials Hook', () => {
    it('should return all testimonials', async () => {
      const { result } = renderHook(() => useTestimonials());

      await waitFor(() => {
        expect(result.current.testimonials).toHaveLength(2);
      });
    });

    it('should filter testimonials by rating', async () => {
      const { result } = renderHook(() => 
        useTestimonials({ 
          minRating: 5 
        })
      );

      await waitFor(() => {
        expect(result.current.testimonials).toHaveLength(2);
        expect(result.current.testimonials.every(t => t.rating >= 5)).toBe(true);
      });
    });

    it('should filter featured testimonials', async () => {
      const { result } = renderHook(() => 
        useTestimonials({ 
          featured: true 
        })
      );

      await waitFor(() => {
        expect(result.current.testimonials).toHaveLength(1);
        expect(result.current.testimonials[0].featured).toBe(true);
      });
    });

    it('should filter by student level', async () => {
      const { result } = renderHook(() => 
        useTestimonials({ 
          studentLevel: 'beginner' 
        })
      );

      await waitFor(() => {
        expect(result.current.testimonials).toHaveLength(1);
        expect(result.current.testimonials[0].studentLevel).toBe('beginner');
      });
    });

    it('should calculate testimonial statistics', async () => {
      const { result } = renderHook(() => useTestimonials());

      await waitFor(() => {
        expect(result.current.stats.total).toBe(2);
        expect(result.current.stats.averageRating).toBe(5);
        expect(result.current.stats.featuredCount).toBe(1);
      });
    });

    it('should sort testimonials by date', async () => {
      const { result } = renderHook(() => useTestimonials());

      await waitFor(() => {
        const dates = result.current.testimonials.map(t => new Date(t.date).getTime());
        const sortedDates = [...dates].sort((a, b) => b - a);
        expect(dates).toEqual(sortedDates);
      });
    });
  });

  describe('useContactMethods Hook', () => {
    it('should return all contact methods', async () => {
      const { result } = renderHook(() => useContactMethods());

      await waitFor(() => {
        expect(result.current.contactMethods).toHaveLength(3);
      });
    });

    it('should filter contact methods by type', async () => {
      const { result } = renderHook(() => 
        useContactMethods({ 
          types: ['email', 'phone'] 
        })
      );

      await waitFor(() => {
        expect(result.current.contactMethods).toHaveLength(2);
      });
    });

    it('should return primary contact method', async () => {
      const { result } = renderHook(() => useContactMethods());

      await waitFor(() => {
        expect(result.current.primaryContact?.type).toBe('email');
        expect(result.current.primaryContact?.primary).toBe(true);
      });
    });

    it('should handle missing primary contact', async () => {
      // Mock contact data without primary
      const mockContentNoPrimary = {
        ...mockSiteContent,
        contact: {
          ...mockSiteContent.contact,
          methods: mockSiteContent.contact.methods.map(m => ({ ...m, primary: false }))
        }
      };

      // We need to mock the import differently for this test
      vi.doMock('../data/site-content.json', () => ({
        default: mockContentNoPrimary
      }));

      const { result } = renderHook(() => useContactMethods());

      await waitFor(() => {
        expect(result.current.primaryContact).toBeNull();
      });
    });
  });

  describe('useSEO Hook', () => {
    it('should return default SEO data', async () => {
      const { result } = renderHook(() => useSEO());

      await waitFor(() => {
        expect(result.current.seoData.title).toBe('Rrish Music - Professional Music Teacher');
        expect(result.current.seoData.description).toBe('Learn music with professional instruction');
      });
    });

    it('should generate page-specific titles', async () => {
      const { result } = renderHook(() => useSEO('lessons'));

      const pageTitle = result.current.generatePageTitle('Guitar Lessons');
      expect(pageTitle).toBe('Guitar Lessons | Rrish Music - Professional Music Teacher');
    });

    it('should merge custom SEO data', async () => {
      const { result } = renderHook(() => 
        useSEO('about', { 
          title: 'About Rrish',
          description: 'Learn about my teaching background' 
        })
      );

      await waitFor(() => {
        expect(result.current.seoData.title).toBe('About Rrish');
        expect(result.current.seoData.description).toBe('Learn about my teaching background');
      });
    });
  });

  describe('useNavigation Hook', () => {
    it('should return navigation items', async () => {
      const { result } = renderHook(() => useNavigation());

      await waitFor(() => {
        expect(result.current.navigation).toHaveLength(3);
      });
    });

    it('should sort navigation by order', async () => {
      const { result } = renderHook(() => useNavigation());

      await waitFor(() => {
        const orders = result.current.sortedNavigation.map(item => item.order);
        expect(orders).toEqual([1, 2, 3]);
      });
    });
  });

  describe('useContentSearch Hook', () => {
    it('should search across content', async () => {
      const { result } = renderHook(() => useContentSearch());

      await waitFor(() => {
        expect(result.current.search).toBeDefined();
      });

      const searchResults = result.current.search('guitar');
      
      expect(searchResults.items.length).toBeGreaterThan(0);
      expect(searchResults.totalCount).toBeGreaterThan(0);
      expect(searchResults.query).toBe('guitar');
    });

    it('should filter search results', async () => {
      const { result } = renderHook(() => useContentSearch());

      await waitFor(() => {
        expect(result.current.search).toBeDefined();
      });

      const searchResults = result.current.search('music', {
        sections: ['hero'],
        maxResults: 5
      });

      expect(searchResults.items.length).toBeLessThanOrEqual(5);
    });

    it('should return empty results for no matches', async () => {
      const { result } = renderHook(() => useContentSearch());

      await waitFor(() => {
        expect(result.current.search).toBeDefined();
      });

      const searchResults = result.current.search('nonexistentterm');
      
      expect(searchResults.items).toHaveLength(0);
      expect(searchResults.totalCount).toBe(0);
    });
  });

  describe('useContentPath Hook', () => {
    it('should get nested content by path', async () => {
      const { result } = renderHook(() => useContentPath('hero.title'));

      await waitFor(() => {
        expect(result.current.value).toBe('Professional Music Teacher');
      });
    });

    it('should return undefined for invalid paths', async () => {
      const { result } = renderHook(() => useContentPath('invalid.path'));

      await waitFor(() => {
        expect(result.current.value).toBeUndefined();
      });
    });

    it('should handle deep nested paths', async () => {
      const { result } = renderHook(() => useContentPath('hero.socialProof.studentsCount'));

      await waitFor(() => {
        expect(result.current.value).toBe(150);
      });
    });
  });

  describe('Content Utils', () => {
    it('should calculate package discounts', () => {
      const discount = contentUtils.calculatePackageDiscount(4, 75);
      expect(discount.savings).toBeGreaterThan(0);
      expect(discount.discountPercentage).toBeGreaterThan(0);
    });

    it('should calculate lesson pricing', () => {
      const pricing = contentUtils.calculateLessonPricing(75, 4);
      expect(pricing.total).toBeLessThan(75 * 4); // Should include discount
      expect(pricing.savings).toBeGreaterThan(0);
    });

    it('should get content statistics', async () => {
      const stats = contentUtils.getContentStats(mockSiteContent);
      
      expect(stats.sections.total).toBeGreaterThan(0);
      expect(stats.lastUpdated).toBeDefined();
    });

    it('should validate content structure', () => {
      const isValid = contentUtils.validateContentStructure(mockSiteContent);
      expect(isValid).toBe(true);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed JSON data', async () => {
      vi.doMock('../data/site-content.json', () => {
        throw new SyntaxError('Malformed JSON');
      });

      const { result } = renderHook(() => useContent());

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle network failures gracefully', async () => {
      // Simulate network error
      const { validateSiteContent } = await import('../utils/validation');
      (validateSiteContent as Mock).mockImplementation(() => {
        throw new Error('Network error');
      });

      const { result } = renderHook(() => useContent());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      // Should allow retry
      expect(result.current.retry).toBeDefined();
    });

    it('should handle empty content gracefully', async () => {
      vi.doMock('../data/site-content.json', () => ({
        default: null
      }));

      const { result } = renderHook(() => useContent());

      await waitFor(() => {
        expect(result.current.content).toBeNull();
      });
    });
  });
});