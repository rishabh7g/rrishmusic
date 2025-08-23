/**
 * Content Types Tests
 * 
 * Tests for TypeScript interfaces, type guards, and utility types
 * used in the RrishMusic content management system.
 */

import { describe, it, expect } from 'vitest';
import type {
  BaseContent,
  HeroContent,
  AboutContent,
  LessonPackage,
  Testimonial,
  ContactMethod,
  SiteContent,
  ContentValidationError,
  ContentLoadingState,
  ContentCache,
  Skill,
  Achievement,
  ContentSection,
  ValidationSeverity,
  MediaType,
  ContactType,
  SkillLevel,
  DeepPartial
} from '../types';

describe('Content Types and Interfaces', () => {
  
  describe('Base Content Interface', () => {
    it('should define required base content fields', () => {
      const baseContent: BaseContent = {
        id: 'test-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0'
      };

      expect(baseContent.id).toBe('test-1');
      expect(baseContent.lastUpdated).toBe('2024-08-23');
      expect(baseContent.version).toBe('1.0.0');
    });

    it('should allow optional metadata field', () => {
      const contentWithMetadata: BaseContent = {
        id: 'test-2',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        metadata: {
          author: 'Rrish',
          tags: ['music', 'teaching']
        }
      };

      expect(contentWithMetadata.metadata).toEqual({
        author: 'Rrish',
        tags: ['music', 'teaching']
      });
    });
  });

  describe('Hero Content Interface', () => {
    it('should extend BaseContent with hero-specific fields', () => {
      const heroContent: HeroContent = {
        id: 'hero-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        title: 'Professional Music Teacher',
        subtitle: 'Learn guitar, piano, and blues improvisation',
        ctaText: 'Start Your Journey',
        instagramHandle: '@rrish_music',
        instagramUrl: 'https://instagram.com/rrish_music',
        description: 'Experienced music teacher',
        socialProof: {
          studentsCount: 150,
          yearsExperience: 10,
          successStories: 50
        }
      };

      expect(heroContent.title).toBe('Professional Music Teacher');
      expect(heroContent.socialProof.studentsCount).toBe(150);
      expect(heroContent.instagramHandle).toBe('@rrish_music');
    });

    it('should allow optional hero fields', () => {
      const minimalHero: HeroContent = {
        id: 'hero-2',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        title: 'Music Teacher',
        subtitle: 'Learn music with me'
      };

      expect(minimalHero.ctaText).toBeUndefined();
      expect(minimalHero.description).toBeUndefined();
      expect(minimalHero.socialProof).toBeUndefined();
    });
  });

  describe('About Content Interface', () => {
    it('should contain required about fields', () => {
      const aboutContent: AboutContent = {
        id: 'about-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        biography: 'Passionate music teacher with 10 years experience',
        profileImage: {
          src: '/images/profile.jpg',
          alt: 'Rrish profile photo',
          width: 400,
          height: 400
        }
      };

      expect(aboutContent.biography).toBe('Passionate music teacher with 10 years experience');
      expect(aboutContent.profileImage.src).toBe('/images/profile.jpg');
    });

    it('should allow optional skills and achievements arrays', () => {
      const skill: Skill = {
        name: 'Guitar Teaching',
        level: 'expert',
        yearsExperience: 10,
        description: 'Expert in blues and improvisation'
      };

      const achievement: Achievement = {
        title: 'Certified Music Educator',
        year: 2020,
        organization: 'Music Teachers Association',
        category: 'education',
        description: 'Professional certification in music education'
      };

      const aboutWithDetails: AboutContent = {
        id: 'about-2',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        biography: 'Music teacher',
        profileImage: {
          src: '/images/profile.jpg',
          alt: 'Profile',
          width: 400,
          height: 400
        },
        skills: [skill],
        achievements: [achievement]
      };

      expect(aboutWithDetails.skills).toHaveLength(1);
      expect(aboutWithDetails.achievements).toHaveLength(1);
      expect(aboutWithDetails.skills?.[0].level).toBe('expert');
    });
  });

  describe('Lesson Package Interface', () => {
    it('should define complete lesson package structure', () => {
      const lessonPackage: LessonPackage = {
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
        features: [
          'One-on-one instruction',
          'Customized lesson plans',
          'Practice materials included'
        ]
      };

      expect(lessonPackage.name).toBe('Blues Guitar Mastery');
      expect(lessonPackage.price).toBe(75);
      expect(lessonPackage.targetAudience).toContain('beginner');
      expect(lessonPackage.instruments).toContain('guitar');
    });

    it('should allow optional lesson package fields', () => {
      const basicPackage: LessonPackage = {
        id: 'lesson-2',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        name: 'Basic Piano',
        description: 'Learn piano basics',
        duration: 30,
        price: 50,
        currency: 'USD',
        targetAudience: ['beginner'],
        instruments: ['piano'],
        features: []
      };

      expect(basicPackage.category).toBeUndefined();
      expect(basicPackage.groupSize).toBeUndefined();
      expect(basicPackage.prerequisites).toBeUndefined();
    });
  });

  describe('Testimonial Interface', () => {
    it('should define testimonial structure', () => {
      const testimonial: Testimonial = {
        id: 'testimonial-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        studentName: 'Alex Johnson',
        content: 'Rrish is an amazing teacher who helped me master blues guitar',
        rating: 5,
        date: '2024-08-15',
        featured: true
      };

      expect(testimonial.studentName).toBe('Alex Johnson');
      expect(testimonial.rating).toBe(5);
      expect(testimonial.featured).toBe(true);
    });

    it('should allow optional testimonial fields', () => {
      const basicTestimonial: Testimonial = {
        id: 'testimonial-2',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        studentName: 'Sarah Wilson',
        content: 'Great teacher!',
        rating: 5,
        date: '2024-08-20'
      };

      expect(basicTestimonial.featured).toBeUndefined();
      expect(basicTestimonial.studentLevel).toBeUndefined();
      expect(basicTestimonial.lessonType).toBeUndefined();
    });
  });

  describe('Contact Method Interface', () => {
    it('should define contact method structure', () => {
      const emailContact: ContactMethod = {
        type: 'email',
        value: 'rrish@example.com',
        label: 'Email Me',
        primary: true
      };

      const phoneContact: ContactMethod = {
        type: 'phone',
        value: '+1-555-0123',
        label: 'Call Me'
      };

      expect(emailContact.type).toBe('email');
      expect(emailContact.primary).toBe(true);
      expect(phoneContact.type).toBe('phone');
      expect(phoneContact.primary).toBeUndefined();
    });

    it('should support all contact types', () => {
      const contactTypes: ContactType[] = [
        'email', 'phone', 'instagram', 'whatsapp', 
        'facebook', 'linkedin', 'website'
      ];

      contactTypes.forEach(type => {
        const contact: ContactMethod = {
          type,
          value: 'test-value',
          label: 'Test Label'
        };
        expect(contact.type).toBe(type);
      });
    });
  });

  describe('Content Validation Types', () => {
    it('should define validation error structure', () => {
      const validationError: ContentValidationError = {
        field: 'hero.title',
        message: 'Title is required',
        severity: 'error',
        code: 'REQUIRED_FIELD'
      };

      expect(validationError.field).toBe('hero.title');
      expect(validationError.severity).toBe('error');
      expect(validationError.code).toBe('REQUIRED_FIELD');
    });

    it('should support different validation severities', () => {
      const severities: ValidationSeverity[] = ['error', 'warning', 'info'];
      
      severities.forEach(severity => {
        const error: ContentValidationError = {
          field: 'test.field',
          message: 'Test message',
          severity,
          code: 'TEST_CODE'
        };
        expect(error.severity).toBe(severity);
      });
    });
  });

  describe('Content Loading State', () => {
    it('should define loading state structure', () => {
      const loadingState: ContentLoadingState = {
        loading: true,
        error: null,
        retryCount: 0
      };

      expect(loadingState.loading).toBe(true);
      expect(loadingState.error).toBeNull();
      expect(loadingState.retryCount).toBe(0);
    });

    it('should allow error state', () => {
      const errorState: ContentLoadingState = {
        loading: false,
        error: 'Failed to load content',
        retryCount: 2
      };

      expect(errorState.loading).toBe(false);
      expect(errorState.error).toBe('Failed to load content');
      expect(errorState.retryCount).toBe(2);
    });
  });

  describe('Content Cache Interface', () => {
    it('should define cache structure', () => {
      const cache: ContentCache = {
        data: { id: 'test', lastUpdated: '2024-08-23', version: '1.0.0' },
        timestamp: Date.now(),
        ttl: 300000
      };

      expect(cache.data.id).toBe('test');
      expect(typeof cache.timestamp).toBe('number');
      expect(cache.ttl).toBe(300000);
    });
  });

  describe('Utility Types', () => {
    it('should support DeepPartial type', () => {
      const partialHero: DeepPartial<HeroContent> = {
        id: 'partial-hero',
        socialProof: {
          studentsCount: 100
          // other socialProof fields are optional
        }
      };

      expect(partialHero.id).toBe('partial-hero');
      expect(partialHero.socialProof?.studentsCount).toBe(100);
    });

    it('should define content section types', () => {
      const sections: ContentSection[] = [
        'hero', 'about', 'approach', 'lessons', 
        'community', 'contact', 'seo', 'navigation'
      ];

      sections.forEach(section => {
        expect(typeof section).toBe('string');
      });
    });

    it('should define media types', () => {
      const mediaTypes: MediaType[] = ['image', 'video', 'audio', 'document'];
      
      mediaTypes.forEach(type => {
        expect(typeof type).toBe('string');
      });
    });

    it('should define skill levels', () => {
      const skillLevels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
      
      skillLevels.forEach(level => {
        expect(typeof level).toBe('string');
      });
    });
  });

  describe('Type Compatibility', () => {
    it('should allow proper type assignments', () => {
      const siteContent: Partial<SiteContent> = {
        id: 'site-1',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        hero: {
          id: 'hero-1',
          lastUpdated: '2024-08-23',
          version: '1.0.0',
          title: 'Music Teacher',
          subtitle: 'Learn with me'
        }
      };

      expect(siteContent.hero?.title).toBe('Music Teacher');
    });

    it('should maintain type safety with nested objects', () => {
      const skill: Skill = {
        name: 'Piano',
        level: 'intermediate',
        yearsExperience: 5
      };

      // This should compile without errors
      const skillLevel: SkillLevel = skill.level;
      expect(skillLevel).toBe('intermediate');
    });
  });

  describe('Interface Extensions', () => {
    it('should properly extend BaseContent', () => {
      const heroContent: HeroContent = {
        // BaseContent fields
        id: 'hero-test',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        // HeroContent specific fields
        title: 'Test Title',
        subtitle: 'Test Subtitle'
      };

      // Should have both base and extended properties
      expect(heroContent.id).toBe('hero-test');
      expect(heroContent.title).toBe('Test Title');
    });

    it('should handle optional extended fields', () => {
      const testimonial: Testimonial = {
        // BaseContent fields
        id: 'testimonial-test',
        lastUpdated: '2024-08-23',
        version: '1.0.0',
        // Required Testimonial fields
        studentName: 'Test Student',
        content: 'Great lesson!',
        rating: 5,
        date: '2024-08-23'
        // Optional fields omitted
      };

      expect(testimonial.featured).toBeUndefined();
      expect(testimonial.studentLevel).toBeUndefined();
    });
  });
});