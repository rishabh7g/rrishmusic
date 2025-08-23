/**
 * Content Validation Tests
 * 
 * Tests for content validation utilities used in the RrishMusic content management system.
 * Tests validation functions, error handling, and utility functions.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  ValidationErrorCodes,
  validators,
  validateHeroContent,
  validateAboutContent,
  validateLessonPackage,
  validateTestimonial,
  validateContactMethod,
  validateSiteContent,
  validationUtils
} from '../utils/validation';
import type {
  HeroContent,
  AboutContent,
  LessonPackage,
  Testimonial,
  ContactMethod,
  SiteContent,
  Skill,
  Achievement,
  ContentValidationResult,
  ContentValidationError
} from '../types';

describe('Content Validation System', () => {

  describe('ValidationErrorCodes', () => {
    it('should define all required error codes', () => {
      expect(ValidationErrorCodes.REQUIRED_FIELD).toBe('REQUIRED_FIELD');
      expect(ValidationErrorCodes.INVALID_FORMAT).toBe('INVALID_FORMAT');
      expect(ValidationErrorCodes.INVALID_TYPE).toBe('INVALID_TYPE');
      expect(ValidationErrorCodes.INVALID_VALUE).toBe('INVALID_VALUE');
      expect(ValidationErrorCodes.MISSING_PROPERTY).toBe('MISSING_PROPERTY');
      expect(ValidationErrorCodes.INVALID_LENGTH).toBe('INVALID_LENGTH');
      expect(ValidationErrorCodes.INVALID_RANGE).toBe('INVALID_RANGE');
      expect(ValidationErrorCodes.INVALID_URL).toBe('INVALID_URL');
      expect(ValidationErrorCodes.INVALID_EMAIL).toBe('INVALID_EMAIL');
      expect(ValidationErrorCodes.INVALID_PHONE).toBe('INVALID_PHONE');
      expect(ValidationErrorCodes.DEPRECATED_FIELD).toBe('DEPRECATED_FIELD');
    });
  });

  describe('Utility Validators', () => {
    describe('validators.required', () => {
      it('should validate required values', () => {
        expect(validators.required('test')).toBe(true);
        expect(validators.required(123)).toBe(true);
        expect(validators.required([])).toBe(true);
        expect(validators.required({})).toBe(true);
        
        expect(validators.required(null)).toBe(false);
        expect(validators.required(undefined)).toBe(false);
        expect(validators.required('')).toBe(false);
        expect(validators.required('   ')).toBe(false);
      });
    });

    describe('validators.isString', () => {
      it('should validate string values', () => {
        expect(validators.isString('test')).toBe(true);
        expect(validators.isString('')).toBe(true);
        
        expect(validators.isString(123)).toBe(false);
        expect(validators.isString(null)).toBe(false);
        expect(validators.isString(undefined)).toBe(false);
        expect(validators.isString({})).toBe(false);
      });
    });

    describe('validators.isNumber', () => {
      it('should validate number values', () => {
        expect(validators.isNumber(123)).toBe(true);
        expect(validators.isNumber(0)).toBe(true);
        expect(validators.isNumber(-456)).toBe(true);
        expect(validators.isNumber(3.14)).toBe(true);
        
        expect(validators.isNumber('123')).toBe(false);
        expect(validators.isNumber(NaN)).toBe(false);
        expect(validators.isNumber(null)).toBe(false);
        expect(validators.isNumber(undefined)).toBe(false);
      });
    });

    describe('validators.isArray', () => {
      it('should validate array values', () => {
        expect(validators.isArray([])).toBe(true);
        expect(validators.isArray([1, 2, 3])).toBe(true);
        expect(validators.isArray(['a', 'b'])).toBe(true);
        
        expect(validators.isArray({})).toBe(false);
        expect(validators.isArray('array')).toBe(false);
        expect(validators.isArray(null)).toBe(false);
        expect(validators.isArray(undefined)).toBe(false);
      });
    });

    describe('validators.isEmail', () => {
      it('should validate email formats', () => {
        expect(validators.isEmail('test@example.com')).toBe(true);
        expect(validators.isEmail('user+tag@domain.co.uk')).toBe(true);
        expect(validators.isEmail('user.name@domain.com')).toBe(true);
        
        expect(validators.isEmail('invalid-email')).toBe(false);
        expect(validators.isEmail('user@')).toBe(false);
        expect(validators.isEmail('@domain.com')).toBe(false);
        expect(validators.isEmail('user @domain.com')).toBe(false);
        expect(validators.isEmail('')).toBe(false);
      });
    });

    describe('validators.isUrl', () => {
      it('should validate URL formats', () => {
        expect(validators.isUrl('https://example.com')).toBe(true);
        expect(validators.isUrl('http://example.com')).toBe(true);
        expect(validators.isUrl('https://www.example.com/path')).toBe(true);
        expect(validators.isUrl('https://example.com/path?query=1')).toBe(true);
        
        expect(validators.isUrl('invalid-url')).toBe(false);
        expect(validators.isUrl('ftp://example.com')).toBe(false);
        expect(validators.isUrl('//example.com')).toBe(false);
        expect(validators.isUrl('')).toBe(false);
      });
    });

    describe('validators.isInstagramHandle', () => {
      it('should validate Instagram handle formats', () => {
        expect(validators.isInstagramHandle('@username')).toBe(true);
        expect(validators.isInstagramHandle('@user_name')).toBe(true);
        expect(validators.isInstagramHandle('@user.name')).toBe(true);
        expect(validators.isInstagramHandle('@user123')).toBe(true);
        
        expect(validators.isInstagramHandle('username')).toBe(false);
        expect(validators.isInstagramHandle('@')).toBe(false);
        expect(validators.isInstagramHandle('@u')).toBe(false); // Too short
        expect(validators.isInstagramHandle('@' + 'a'.repeat(31))).toBe(false); // Too long
        expect(validators.isInstagramHandle('')).toBe(false);
      });
    });

    describe('validators.isPhoneNumber', () => {
      it('should validate phone number formats', () => {
        expect(validators.isPhoneNumber('+1234567890')).toBe(true);
        expect(validators.isPhoneNumber('+15551234567')).toBe(true);
        expect(validators.isPhoneNumber('+447911123456')).toBe(true);
        
        expect(validators.isPhoneNumber('1234567890')).toBe(false);
        expect(validators.isPhoneNumber('+123')).toBe(false); // Too short
        expect(validators.isPhoneNumber('+' + '1'.repeat(20))).toBe(false); // Too long
        expect(validators.isPhoneNumber('')).toBe(false);
      });
    });

    describe('validators.isValidLength', () => {
      it('should validate string length constraints', () => {
        expect(validators.isValidLength('hello', { min: 3, max: 10 })).toBe(true);
        expect(validators.isValidLength('hi', { min: 2, max: 5 })).toBe(true);
        expect(validators.isValidLength('test', { min: 4 })).toBe(true);
        expect(validators.isValidLength('test', { max: 10 })).toBe(true);
        
        expect(validators.isValidLength('hi', { min: 5 })).toBe(false);
        expect(validators.isValidLength('toolongtext', { max: 5 })).toBe(false);
        expect(validators.isValidLength('test', { min: 10, max: 20 })).toBe(false);
      });

      it('should handle empty strings and whitespace', () => {
        expect(validators.isValidLength('', { min: 1 })).toBe(false);
        expect(validators.isValidLength('   ', { min: 1 })).toBe(false);
        expect(validators.isValidLength('  hello  ', { min: 5 })).toBe(true); // Trimmed length
      });
    });
  });

  describe('Hero Content Validation', () => {
    const validHero: HeroContent = {
      id: 'hero-1',
      lastUpdated: '2024-08-23',
      version: '1.0.0',
      title: 'Professional Music Teacher',
      subtitle: 'Learn guitar, piano, and blues improvisation'
    };

    it('should validate complete hero content', () => {
      const result = validateHeroContent(validHero);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require title and subtitle', () => {
      const invalidHero = {
        ...validHero,
        title: '',
        subtitle: ''
      };

      const result = validateHeroContent(invalidHero);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'hero.title')).toBe(true);
      expect(result.errors.some(e => e.field === 'hero.subtitle')).toBe(true);
    });

    it('should validate Instagram handle format', () => {
      const heroWithInvalidHandle = {
        ...validHero,
        instagramHandle: 'invalid-handle'
      };

      const result = validateHeroContent(heroWithInvalidHandle);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'hero.instagramHandle')).toBe(true);
    });

    it('should validate Instagram URL format', () => {
      const heroWithInvalidUrl = {
        ...validHero,
        instagramUrl: 'not-a-url'
      };

      const result = validateHeroContent(heroWithInvalidUrl);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'hero.instagramUrl')).toBe(true);
    });

    it('should validate social proof numbers', () => {
      const heroWithInvalidSocialProof = {
        ...validHero,
        socialProof: {
          studentsCount: -5,
          yearsExperience: 0,
          successStories: -10
        }
      };

      const result = validateHeroContent(heroWithInvalidSocialProof);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should generate warnings for missing optional fields', () => {
      const minimalHero = {
        ...validHero
        // Missing optional fields
      };

      const result = validateHeroContent(minimalHero);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('About Content Validation', () => {
    const validAbout: AboutContent = {
      id: 'about-1',
      lastUpdated: '2024-08-23',
      version: '1.0.0',
      biography: 'Passionate music teacher with years of experience',
      profileImage: {
        src: '/images/profile.jpg',
        alt: 'Profile photo',
        width: 400,
        height: 400
      }
    };

    it('should validate complete about content', () => {
      const result = validateAboutContent(validAbout);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require biography and profile image', () => {
      const invalidAbout = {
        ...validAbout,
        biography: '',
        profileImage: null
      };

      const result = validateAboutContent(invalidAbout);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'about.biography')).toBe(true);
      expect(result.errors.some(e => e.field === 'about.profileImage')).toBe(true);
    });

    it('should validate skills array', () => {
      const invalidSkill: Skill = {
        name: '', // Invalid: empty name
        level: 'invalid' as any, // Invalid: not a valid level
        yearsExperience: -5 // Invalid: negative experience
      };

      const aboutWithInvalidSkill = {
        ...validAbout,
        skills: [invalidSkill]
      };

      const result = validateAboutContent(aboutWithInvalidSkill);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate achievements array', () => {
      const invalidAchievement: Achievement = {
        title: '', // Invalid: empty title
        year: 1800, // Invalid: too old
        organization: '', // Invalid: empty organization
        category: 'invalid' as any // Invalid: not a valid category
      };

      const aboutWithInvalidAchievement = {
        ...validAbout,
        achievements: [invalidAchievement]
      };

      const result = validateAboutContent(aboutWithInvalidAchievement);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate profile image properties', () => {
      const aboutWithInvalidImage = {
        ...validAbout,
        profileImage: {
          src: '', // Invalid: empty src
          alt: '', // Invalid: empty alt
          width: 0, // Invalid: zero width
          height: -100 // Invalid: negative height
        }
      };

      const result = validateAboutContent(aboutWithInvalidImage);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Lesson Package Validation', () => {
    const validPackage: LessonPackage = {
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
    };

    it('should validate complete lesson package', () => {
      const result = validateLessonPackage(validPackage);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require essential package fields', () => {
      const invalidPackage = {
        ...validPackage,
        name: '',
        description: '',
        duration: 0,
        price: -10
      };

      const result = validateLessonPackage(invalidPackage);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('name'))).toBe(true);
      expect(result.errors.some(e => e.field.includes('description'))).toBe(true);
      expect(result.errors.some(e => e.field.includes('duration'))).toBe(true);
      expect(result.errors.some(e => e.field.includes('price'))).toBe(true);
    });

    it('should validate target audience levels', () => {
      const packageWithInvalidAudience = {
        ...validPackage,
        targetAudience: ['invalid-level' as any]
      };

      const result = validateLessonPackage(packageWithInvalidAudience);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('targetAudience'))).toBe(true);
    });

    it('should require non-empty arrays', () => {
      const packageWithEmptyArrays = {
        ...validPackage,
        targetAudience: [],
        instruments: [],
        features: []
      };

      const result = validateLessonPackage(packageWithEmptyArrays);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate reasonable price and duration ranges', () => {
      const packageWithUnreasonableValues = {
        ...validPackage,
        duration: 300, // Too long
        price: 10000 // Too expensive
      };

      const result = validateLessonPackage(packageWithUnreasonableValues);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Testimonial Validation', () => {
    const validTestimonial: Testimonial = {
      id: 'testimonial-1',
      lastUpdated: '2024-08-23',
      version: '1.0.0',
      studentName: 'Alex Johnson',
      content: 'Amazing teacher who helped me master blues guitar!',
      rating: 5,
      date: '2024-08-20'
    };

    it('should validate complete testimonial', () => {
      const result = validateTestimonial(validTestimonial);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require essential testimonial fields', () => {
      const invalidTestimonial = {
        ...validTestimonial,
        studentName: '',
        content: '',
        rating: 0
      };

      const result = validateTestimonial(invalidTestimonial);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('studentName'))).toBe(true);
      expect(result.errors.some(e => e.field.includes('content'))).toBe(true);
      expect(result.errors.some(e => e.field.includes('rating'))).toBe(true);
    });

    it('should validate rating range', () => {
      const testimonialWithInvalidRating = {
        ...validTestimonial,
        rating: 6 // Invalid: above maximum
      };

      const result = validateTestimonial(testimonialWithInvalidRating);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('rating'))).toBe(true);
    });

    it('should validate student level if provided', () => {
      const testimonialWithInvalidLevel = {
        ...validTestimonial,
        studentLevel: 'invalid-level' as any
      };

      const result = validateTestimonial(testimonialWithInvalidLevel);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('studentLevel'))).toBe(true);
    });

    it('should validate date format', () => {
      const testimonialWithInvalidDate = {
        ...validTestimonial,
        date: 'invalid-date'
      };

      const result = validateTestimonial(testimonialWithInvalidDate);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('date'))).toBe(true);
    });

    it('should validate content length', () => {
      const testimonialWithShortContent = {
        ...validTestimonial,
        content: 'Ok' // Too short
      };

      const testimonialWithLongContent = {
        ...validTestimonial,
        content: 'x'.repeat(2000) // Too long
      };

      const shortResult = validateTestimonial(testimonialWithShortContent);
      const longResult = validateTestimonial(testimonialWithLongContent);

      expect(shortResult.warnings.length).toBeGreaterThan(0);
      expect(longResult.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Contact Method Validation', () => {
    it('should validate email contact method', () => {
      const emailContact: ContactMethod = {
        type: 'email',
        value: 'rrish@example.com',
        label: 'Email Me'
      };

      const result = validateContactMethod(emailContact);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate phone contact method', () => {
      const phoneContact: ContactMethod = {
        type: 'phone',
        value: '+1-555-0123',
        label: 'Call Me'
      };

      const result = validateContactMethod(phoneContact);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require essential contact fields', () => {
      const invalidContact = {
        type: 'email' as const,
        value: '',
        label: ''
      };

      const result = validateContactMethod(invalidContact);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('value'))).toBe(true);
      expect(result.errors.some(e => e.field.includes('label'))).toBe(true);
    });

    it('should validate email format for email type', () => {
      const invalidEmailContact: ContactMethod = {
        type: 'email',
        value: 'invalid-email',
        label: 'Email'
      };

      const result = validateContactMethod(invalidEmailContact);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('value'))).toBe(true);
    });

    it('should validate URL format for website type', () => {
      const invalidWebsiteContact: ContactMethod = {
        type: 'website',
        value: 'not-a-url',
        label: 'Website'
      };

      const result = validateContactMethod(invalidWebsiteContact);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('value'))).toBe(true);
    });

    it('should validate phone format for phone type', () => {
      const invalidPhoneContact: ContactMethod = {
        type: 'phone',
        value: '123', // Too short
        label: 'Phone'
      };

      const result = validateContactMethod(invalidPhoneContact);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('value'))).toBe(true);
    });

    it('should validate Instagram handle format for Instagram type', () => {
      const invalidInstagramContact: ContactMethod = {
        type: 'instagram',
        value: 'no-at-symbol',
        label: 'Instagram'
      };

      const result = validateContactMethod(invalidInstagramContact);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('value'))).toBe(true);
    });
  });

  describe('Site Content Validation', () => {
    const validSiteContent: SiteContent = {
      id: 'site-1',
      lastUpdated: '2024-08-23',
      version: '1.0.0',
      hero: {
        id: 'hero-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        title: 'Music Teacher',
        subtitle: 'Learn with me'
      },
      about: {
        id: 'about-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        biography: 'Experienced teacher',
        profileImage: {
          src: '/images/profile.jpg',
          alt: 'Profile',
          width: 400,
          height: 400
        }
      },
      contact: {
        id: 'contact-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        methods: [
          {
            type: 'email',
            value: 'test@example.com',
            label: 'Email'
          }
        ]
      }
    };

    it('should validate complete site content', () => {
      const result = validateSiteContent(validSiteContent);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate required sections', () => {
      const incompleteSiteContent = {
        id: 'site-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0'
        // Missing required sections
      };

      const result = validateSiteContent(incompleteSiteContent);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should aggregate validation errors from all sections', () => {
      const siteWithInvalidSections = {
        ...validSiteContent,
        hero: {
          ...validSiteContent.hero,
          title: '' // Invalid
        },
        contact: {
          ...validSiteContent.contact,
          methods: [] // Invalid: empty array
        }
      };

      const result = validateSiteContent(siteWithInvalidSections);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('hero'))).toBe(true);
      expect(result.errors.some(e => e.field.includes('contact'))).toBe(true);
    });

    it('should handle null or undefined content', () => {
      const result1 = validateSiteContent(null);
      const result2 = validateSiteContent(undefined);

      expect(result1.valid).toBe(false);
      expect(result2.valid).toBe(false);
      expect(result1.errors.length).toBeGreaterThan(0);
      expect(result2.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Validation Utils', () => {
    const mockValidationResult: ContentValidationResult = {
      valid: false,
      errors: [
        { field: 'hero.title', message: 'Title required', severity: 'error', code: 'REQUIRED' },
        { field: 'about.bio', message: 'Bio required', severity: 'error', code: 'REQUIRED' },
        { field: 'hero.subtitle', message: 'Subtitle recommended', severity: 'warning', code: 'RECOMMENDED' }
      ],
      warnings: [
        { field: 'hero.subtitle', message: 'Subtitle recommended', severity: 'warning', code: 'RECOMMENDED' }
      ]
    };

    describe('groupErrorsBySection', () => {
      it('should group errors by section', () => {
        const grouped = validationUtils.groupErrorsBySection(mockValidationResult);
        
        expect(grouped.hero).toHaveLength(2); // 1 error + 1 warning
        expect(grouped.about).toHaveLength(1); // 1 error
        expect(grouped.hero.some(e => e.field === 'hero.title')).toBe(true);
        expect(grouped.about.some(e => e.field === 'about.bio')).toBe(true);
      });

      it('should handle empty validation result', () => {
        const emptyResult: ContentValidationResult = {
          valid: true,
          errors: [],
          warnings: []
        };

        const grouped = validationUtils.groupErrorsBySection(emptyResult);
        expect(Object.keys(grouped)).toHaveLength(0);
      });
    });

    describe('hasValidationIssues', () => {
      it('should detect validation issues', () => {
        expect(validationUtils.hasValidationIssues(mockValidationResult)).toBe(true);
        
        const validResult: ContentValidationResult = {
          valid: true,
          errors: [],
          warnings: []
        };
        expect(validationUtils.hasValidationIssues(validResult)).toBe(false);
      });

      it('should handle only warnings', () => {
        const warningsOnlyResult: ContentValidationResult = {
          valid: true,
          errors: [],
          warnings: [
            { field: 'test', message: 'Warning', severity: 'warning', code: 'TEST' }
          ]
        };

        expect(validationUtils.hasValidationIssues(warningsOnlyResult)).toBe(true);
      });
    });

    describe('formatValidationSummary', () => {
      it('should format validation summary', () => {
        const summary = validationUtils.formatValidationSummary(mockValidationResult);
        
        expect(summary).toContain('2 errors');
        expect(summary).toContain('1 warnings');
        expect(typeof summary).toBe('string');
      });

      it('should handle valid content', () => {
        const validResult: ContentValidationResult = {
          valid: true,
          errors: [],
          warnings: []
        };

        const summary = validationUtils.formatValidationSummary(validResult);
        expect(summary).toContain('valid');
        expect(summary).toContain('0 errors');
        expect(summary).toContain('0 warnings');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed data gracefully', () => {
      const malformedData = 'not-an-object';
      const result = validateHeroContent(malformedData);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle circular references', () => {
      const circularData: any = { id: 'test' };
      circularData.self = circularData;
      
      const result = validateHeroContent(circularData);
      expect(result.valid).toBe(false);
    });

    it('should handle very large data sets', () => {
      const largeTestimonial = {
        id: 'large-testimonial',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        studentName: 'Test Student',
        content: 'x'.repeat(5000), // Very long content
        rating: 5,
        date: '2024-08-23'
      };

      const result = validateTestimonial(largeTestimonial);
      // Should handle gracefully, possibly with warnings
      expect(result.errors.length).toBeLessThan(10);
    });

    it('should validate array bounds correctly', () => {
      const aboutWithManySkills = {
        id: 'about-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        biography: 'Test biography',
        profileImage: {
          src: '/test.jpg',
          alt: 'Test',
          width: 400,
          height: 400
        },
        skills: Array(50).fill({
          name: 'Skill',
          level: 'beginner',
          yearsExperience: 1
        })
      };

      const result = validateAboutContent(aboutWithManySkills);
      expect(result).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe('Performance and Optimization', () => {
    it('should validate content efficiently', () => {
      const startTime = performance.now();
      
      const largeContent = {
        id: 'large-content',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        hero: {
          id: 'hero-1',
          lastUpdated: '2024-08-23',
          version: '1.0.0',
          title: 'Title',
          subtitle: 'Subtitle'
        }
      };

      validateSiteContent(largeContent);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Validation should complete within reasonable time
      expect(duration).toBeLessThan(100); // 100ms threshold
    });

    it('should handle concurrent validations', async () => {
      const validationPromises = Array(10).fill(null).map(() => 
        Promise.resolve(validateHeroContent({
          id: 'hero-concurrent',
          lastUpdated: '2024-08-23',
          version: '1.0.0',
          title: 'Concurrent Test',
          subtitle: 'Testing concurrent validation'
        }))
      );

      const results = await Promise.all(validationPromises);
      
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result.valid).toBe(true);
      });
    });
  });
});