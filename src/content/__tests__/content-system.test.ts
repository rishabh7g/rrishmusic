/**
 * Content Management System Tests
 * 
 * Comprehensive tests for the RrishMusic content management system
 * including validation, hooks, and utilities.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { 
  validateSiteContent,
  validateHeroContent,
  validateLessonPackage,
  validateTestimonial,
  validateContactMethod,
  validationUtils,
  contentUtils,
  ValidationErrorCodes
} from '../utils/validation';
import type {
  SiteContent,
  HeroContent,
  LessonPackage,
  Testimonial,
  ContactMethod
} from '../types';

describe('Content Validation System', () => {
  describe('Hero Content Validation', () => {
    it('should validate complete hero content', () => {
      const validHero: HeroContent = {
        id: 'hero-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        title: 'Professional Music Teacher',
        subtitle: 'Learn guitar, piano, and blues improvisation with personalized instruction',
        ctaText: 'Start Your Musical Journey',
        instagramHandle: '@rrish_music',
        instagramUrl: 'https://instagram.com/rrish_music',
        description: 'Experienced music teacher specializing in blues and improvisation',
        socialProof: {
          studentsCount: 150,
          yearsExperience: 10,
          successStories: 50
        }
      };

      const result = validateHeroContent(validHero);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for missing required fields', () => {
      const invalidHero = {
        id: 'hero-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0'
        // Missing required fields
      };

      const result = validateHeroContent(invalidHero);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      const titleError = result.errors.find(e => e.field === 'hero.title');
      expect(titleError).toBeDefined();
      expect(titleError?.code).toBe(ValidationErrorCodes.REQUIRED_FIELD);
    });

    it('should warn about suboptimal content length', () => {
      const heroWithShortTitle: Partial<HeroContent> = {
        id: 'hero-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        title: 'Hi', // Too short
        subtitle: 'Learn music with me',
        ctaText: 'Start',
        instagramHandle: '@rrish',
        instagramUrl: 'https://instagram.com/rrish'
      };

      const result = validateHeroContent(heroWithShortTitle);
      expect(result.warnings.length).toBeGreaterThan(0);
      
      const titleWarning = result.warnings.find(w => w.field === 'hero.title');
      expect(titleWarning?.severity).toBe('warning');
    });

    it('should validate URL formats', () => {
      const heroWithBadUrls: Partial<HeroContent> = {
        id: 'hero-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        title: 'Music Teacher',
        subtitle: 'Learn music',
        ctaText: 'Start',
        instagramHandle: '@rrish',
        instagramUrl: 'not-a-valid-url',
        ctaLink: 'also-not-valid'
      };

      const result = validateHeroContent(heroWithBadUrls);
      expect(result.valid).toBe(false);
      
      const urlErrors = result.errors.filter(e => e.code === ValidationErrorCodes.INVALID_URL);
      expect(urlErrors.length).toBeGreaterThan(0);
    });
  });

  describe('Lesson Package Validation', () => {
    it('should validate complete lesson package', () => {
      const validPackage: LessonPackage = {
        id: 'pkg-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        name: 'Beginner Guitar Package',
        description: 'Perfect for those starting their guitar journey',
        price: 120,
        originalPrice: 150,
        sessions: 4,
        duration: 60,
        validity: 90,
        features: ['1-on-1 instruction', 'Practice materials', 'Progress tracking'],
        popular: true,
        targetAudience: ['beginner'],
        instruments: ['guitar'],
        included: ['Sheet music', 'Online resources', 'Recording of lessons']
      };

      const result = validateLessonPackage(validPackage);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate price logic', () => {
      const packageWithBadPricing: Partial<LessonPackage> = {
        id: 'pkg-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        name: 'Test Package',
        description: 'Test description',
        price: 150,
        originalPrice: 120, // Should be higher than current price
        sessions: 4,
        duration: 60,
        features: ['Feature 1'],
        popular: false,
        targetAudience: ['beginner'],
        instruments: ['guitar'],
        included: ['Item 1']
      };

      const result = validateLessonPackage(packageWithBadPricing);
      expect(result.warnings.length).toBeGreaterThan(0);
      
      const pricingWarning = result.warnings.find(w => 
        w.field === 'package.originalPrice'
      );
      expect(pricingWarning).toBeDefined();
    });

    it('should validate target audience values', () => {
      const packageWithInvalidAudience: Partial<LessonPackage> = {
        id: 'pkg-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        name: 'Test Package',
        description: 'Test description',
        price: 120,
        sessions: 4,
        duration: 60,
        features: ['Feature 1'],
        popular: false,
        targetAudience: ['expert' as any], // Invalid level
        instruments: ['guitar'],
        included: ['Item 1']
      };

      const result = validateLessonPackage(packageWithInvalidAudience);
      expect(result.valid).toBe(false);
      
      const audienceError = result.errors.find(e => 
        e.field.includes('targetAudience')
      );
      expect(audienceError).toBeDefined();
    });
  });

  describe('Testimonial Validation', () => {
    it('should validate complete testimonial', () => {
      const validTestimonial: Testimonial = {
        id: 'test-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        name: 'Sarah Johnson',
        text: 'Rrish is an amazing teacher who helped me master blues guitar techniques I never thought I could learn.',
        rating: 5,
        date: '2024-08-01',
        instrument: 'Guitar',
        level: 'intermediate',
        age: 28,
        location: 'Melbourne, Australia',
        featured: true,
        verified: true,
        achievements: ['Performed at local venue', 'Completed advanced course']
      };

      const result = validateTestimonial(validTestimonial);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate rating range', () => {
      const testimonialWithBadRating: Partial<Testimonial> = {
        id: 'test-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        name: 'John Doe',
        text: 'Great teacher!',
        rating: 6 as any, // Invalid rating
        date: '2024-08-01',
        featured: false,
        verified: true
      };

      const result = validateTestimonial(testimonialWithBadRating);
      expect(result.valid).toBe(false);
      
      const ratingError = result.errors.find(e => 
        e.field === 'testimonial.rating'
      );
      expect(ratingError?.code).toBe(ValidationErrorCodes.INVALID_RANGE);
    });

    it('should warn about testimonial length', () => {
      const shortTestimonial: Partial<Testimonial> = {
        id: 'test-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        name: 'Jane Doe',
        text: 'Good!', // Too short
        rating: 5,
        date: '2024-08-01',
        featured: false,
        verified: true
      };

      const result = validateTestimonial(shortTestimonial);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Contact Method Validation', () => {
    it('should validate email contact method', () => {
      const emailContact: ContactMethod = {
        type: 'email',
        label: 'Email',
        value: 'rrish@example.com',
        href: 'mailto:rrish@example.com',
        primary: true,
        description: 'Best way to reach me'
      };

      const result = validateContactMethod(emailContact);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate email format', () => {
      const badEmailContact: ContactMethod = {
        type: 'email',
        label: 'Email',
        value: 'not-an-email',
        href: 'mailto:not-an-email',
        primary: true
      };

      const result = validateContactMethod(badEmailContact);
      expect(result.valid).toBe(false);
      
      const emailError = result.errors.find(e => 
        e.code === ValidationErrorCodes.INVALID_EMAIL
      );
      expect(emailError).toBeDefined();
    });

    it('should validate phone contact method', () => {
      const phoneContact: ContactMethod = {
        type: 'phone',
        label: 'Phone',
        value: '+61 4 1234 5678',
        href: 'tel:+61412345678',
        primary: false
      };

      const result = validateContactMethod(phoneContact);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});

describe('Validation Utilities', () => {
  describe('validationUtils', () => {
    it('should provide validation summary', () => {
      const result = {
        valid: false,
        errors: [
          { field: 'test', message: 'Error 1', code: ValidationErrorCodes.REQUIRED_FIELD, severity: 'error' as const },
          { field: 'test2', message: 'Error 2', code: ValidationErrorCodes.INVALID_TYPE, severity: 'warning' as const }
        ],
        warnings: [
          { field: 'test3', message: 'Warning 1', code: ValidationErrorCodes.INVALID_LENGTH, severity: 'warning' as const }
        ]
      };

      const summary = validationUtils.getValidationSummary(result);
      
      expect(summary.isValid).toBe(false);
      expect(summary.errorCount).toBe(2);
      expect(summary.warningCount).toBe(1);
      expect(summary.hasErrors).toBe(true);
      expect(summary.hasWarnings).toBe(true);
      expect(summary.criticalErrors).toHaveLength(1);
    });

    it('should format validation errors', () => {
      const errors = [
        { field: 'hero.title', message: 'Title is required', code: ValidationErrorCodes.REQUIRED_FIELD, severity: 'error' as const },
        { field: 'hero.subtitle', message: 'Subtitle is required', code: ValidationErrorCodes.REQUIRED_FIELD, severity: 'error' as const }
      ];

      const formatted = validationUtils.formatValidationErrors(errors);
      
      expect(formatted).toContain('hero.title: Title is required');
      expect(formatted).toContain('hero.subtitle: Subtitle is required');
    });

    it('should group errors by field', () => {
      const errors = [
        { field: 'hero.title', message: 'Error 1', code: ValidationErrorCodes.REQUIRED_FIELD, severity: 'error' as const },
        { field: 'hero.subtitle', message: 'Error 2', code: ValidationErrorCodes.REQUIRED_FIELD, severity: 'error' as const },
        { field: 'about.title', message: 'Error 3', code: ValidationErrorCodes.REQUIRED_FIELD, severity: 'error' as const }
      ];

      const grouped = validationUtils.groupErrorsByField(errors);
      
      expect(grouped.hero).toHaveLength(2);
      expect(grouped.about).toHaveLength(1);
    });
  });
});

describe('Content Utilities', () => {
  describe('contentUtils', () => {
    it('should format prices correctly', () => {
      expect(contentUtils.formatPrice(150)).toBe('$150');
      expect(contentUtils.formatPrice(99.50)).toBe('$100');
      expect(contentUtils.formatPrice(1000)).toBe('$1,000');
    });

    it('should calculate savings correctly', () => {
      // 4 sessions at $40 each = $160, package price $120
      // Savings: (160 - 120) / 160 * 100 = 25%
      expect(contentUtils.calculateSavings(120, 4, 40)).toBe(25);
      
      // Unlimited sessions should return 0
      expect(contentUtils.calculateSavings(200, 0, 50)).toBe(0);
    });

    it('should generate valid slugs', () => {
      expect(contentUtils.generateSlug('Advanced Guitar Lessons')).toBe('advanced-guitar-lessons');
      expect(contentUtils.generateSlug('Blues & Jazz Improvisation!')).toBe('blues-jazz-improvisation');
      expect(contentUtils.generateSlug('  Multiple   Spaces   ')).toBe('multiple-spaces');
    });

    it('should truncate text properly', () => {
      const longText = 'This is a very long text that should be truncated properly without cutting words in the middle.';
      const truncated = contentUtils.truncateText(longText, 50);
      
      expect(truncated.length).toBeLessThanOrEqual(54); // 50 + '...'
      expect(truncated.endsWith('...')).toBe(true);
      expect(truncated).not.toMatch(/\s\S+\.\.\.$/); // Should not cut words
    });

    it('should return original text if under limit', () => {
      const shortText = 'Short text';
      expect(contentUtils.truncateText(shortText, 50)).toBe(shortText);
    });

    it('should get content preview', () => {
      const content = 'This is some content for preview testing. It should be truncated appropriately.';
      const preview = contentUtils.getPreview(content, 30);
      
      expect(preview.length).toBeLessThanOrEqual(33); // 30 + '...'
      expect(preview.endsWith('...')).toBe(true);
    });
  });
});

describe('Integration Tests', () => {
  it('should validate complete site content structure', () => {
    const mockSiteContent: Partial<SiteContent> = {
      id: 'site-1',
      lastUpdated: '2024-08-23',
      version: '1.0.0',
      hero: {
        id: 'hero-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        title: 'Professional Music Teacher',
        subtitle: 'Learn music with personalized instruction',
        ctaText: 'Start Learning',
        instagramHandle: '@rrish_music',
        instagramUrl: 'https://instagram.com/rrish_music'
      },
      about: {
        id: 'about-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        title: 'About Rrish',
        content: ['Experienced music teacher', 'Specializing in blues and jazz'],
        skills: [
          { name: 'Guitar', level: 'expert' },
          { name: 'Piano', level: 'advanced' }
        ]
      }
      // Add other required sections for complete validation
    };

    // This will fail because not all sections are included
    const result = validateSiteContent(mockSiteContent);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    
    // Should contain errors for missing sections
    const missingSectionErrors = result.errors.filter(e => 
      e.code === ValidationErrorCodes.REQUIRED_FIELD &&
      ['approach', 'lessons', 'community', 'contact', 'seo'].some(section =>
        e.field.includes(section)
      )
    );
    expect(missingSectionErrors.length).toBeGreaterThan(0);
  });
});

describe('Error Code Coverage', () => {
  it('should cover all validation error codes', () => {
    const codes = Object.values(ValidationErrorCodes);
    expect(codes).toContain('REQUIRED_FIELD');
    expect(codes).toContain('INVALID_TYPE');
    expect(codes).toContain('INVALID_FORMAT');
    expect(codes).toContain('INVALID_LENGTH');
    expect(codes).toContain('INVALID_RANGE');
    expect(codes).toContain('INVALID_URL');
    expect(codes).toContain('INVALID_EMAIL');
    expect(codes).toContain('INVALID_DATE');
    expect(codes).toContain('DUPLICATE_VALUE');
    expect(codes).toContain('REFERENCE_ERROR');
  });
});

describe('Type Safety Tests', () => {
  it('should enforce TypeScript interfaces at compile time', () => {
    // These would fail at compile time if types are wrong
    const hero: HeroContent = {
      id: 'hero-1',
      lastUpdated: '2024-08-23',
      version: '1.0.0',
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      ctaText: 'Test CTA',
      instagramHandle: '@test',
      instagramUrl: 'https://instagram.com/test'
    };

    expect(typeof hero.title).toBe('string');
    expect(typeof hero.subtitle).toBe('string');
    expect(typeof hero.instagramHandle).toBe('string');
  });
});

describe('Performance Tests', () => {
  it('should validate content efficiently', () => {
    const largeContent = {
      // Create large content object for performance testing
      skills: Array.from({ length: 100 }, (_, i) => ({
        name: `Skill ${i}`,
        level: 'beginner' as const,
        yearsExperience: i
      }))
    };

    const start = performance.now();
    // Run validation multiple times
    for (let i = 0; i < 100; i++) {
      validateSiteContent(largeContent);
    }
    const duration = performance.now() - start;

    // Should complete 100 validations in under 1 second
    expect(duration).toBeLessThan(1000);
  });
});