/**
 * Content Validation Utilities for RrishMusic
 * 
 * Provides comprehensive validation functions for all content types
 * with detailed error reporting and type safety.
 */

import type {
  SiteContent,
  HeroContent,
  AboutContent,
  ApproachContent,
  LessonContent,
  CommunityContent,
  ContactContent,
  SEOContent,
  LessonPackage,
  Testimonial,
  ContactMethod,
  TeachingPrinciple,
  NavigationItem,
  ContentValidationError,
  ContentValidationResult,
  MediaItem,
  BlogPost,
  Skill,
  Achievement,
  BusinessHours
} from '../types';

/**
 * Validation error codes for consistent error handling
 */
export const ValidationErrorCodes = {
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_TYPE: 'INVALID_TYPE',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_LENGTH: 'INVALID_LENGTH',
  INVALID_RANGE: 'INVALID_RANGE',
  INVALID_URL: 'INVALID_URL',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_DATE: 'INVALID_DATE',
  DUPLICATE_VALUE: 'DUPLICATE_VALUE',
  REFERENCE_ERROR: 'REFERENCE_ERROR'
} as const;

/**
 * Utility functions for common validations
 */
export const validators = {
  /**
   * Check if value is non-empty string
   */
  isNonEmptyString: (value: unknown): value is string => {
    return typeof value === 'string' && value.trim().length > 0;
  },

  /**
   * Validate URL format
   */
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate date format (ISO string or Date object)
   */
  isValidDate: (date: unknown): boolean => {
    if (typeof date === 'string') {
      return !isNaN(Date.parse(date));
    }
    return date instanceof Date && !isNaN(date.getTime());
  },

  /**
   * Validate rating range (1-5)
   */
  isValidRating: (rating: unknown): rating is 1 | 2 | 3 | 4 | 5 => {
    return typeof rating === 'number' && rating >= 1 && rating <= 5 && Number.isInteger(rating);
  },

  /**
   * Validate positive number
   */
  isPositiveNumber: (value: unknown): value is number => {
    return typeof value === 'number' && value > 0 && !isNaN(value);
  },

  /**
   * Validate non-negative number
   */
  isNonNegativeNumber: (value: unknown): value is number => {
    return typeof value === 'number' && value >= 0 && !isNaN(value);
  },

  /**
   * Validate array with minimum length
   */
  isNonEmptyArray: <T>(value: unknown): value is T[] => {
    return Array.isArray(value) && value.length > 0;
  },

  /**
   * Validate social media handle format
   */
  isValidHandle: (handle: string): boolean => {
    return /^@?[a-zA-Z0-9._]{1,30}$/.test(handle);
  },

  /**
   * Validate phone number format (basic validation)
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },

  /**
   * Validate text length
   */
  hasValidLength: (text: string, min: number = 0, max: number = Infinity): boolean => {
    const length = text.trim().length;
    return length >= min && length <= max;
  }
};

/**
 * Create validation error object
 */
function createValidationError(
  field: string,
  message: string,
  code: keyof typeof ValidationErrorCodes,
  severity: ContentValidationError['severity'] = 'error'
): ContentValidationError {
  return {
    field,
    message,
    code,
    severity
  };
}

/**
 * Hero content validation
 */
export function validateHeroContent(content: unknown): ContentValidationResult {
  const errors: ContentValidationError[] = [];
  const warnings: ContentValidationError[] = [];

  if (!content || typeof content !== 'object') {
    errors.push(createValidationError('hero', 'Hero content must be an object', ValidationErrorCodes.INVALID_TYPE));
    return { valid: false, errors, warnings };
  }

  const hero = content as Partial<HeroContent>;

  // Required fields
  if (!validators.isNonEmptyString(hero.title)) {
    errors.push(createValidationError('hero.title', 'Title is required and must be a non-empty string', ValidationErrorCodes.REQUIRED_FIELD));
  } else if (!validators.hasValidLength(hero.title, 5, 100)) {
    warnings.push(createValidationError('hero.title', 'Title should be between 5-100 characters for optimal SEO', ValidationErrorCodes.INVALID_LENGTH, 'warning'));
  }

  if (!validators.isNonEmptyString(hero.subtitle)) {
    errors.push(createValidationError('hero.subtitle', 'Subtitle is required', ValidationErrorCodes.REQUIRED_FIELD));
  } else if (!validators.hasValidLength(hero.subtitle, 10, 200)) {
    warnings.push(createValidationError('hero.subtitle', 'Subtitle should be between 10-200 characters', ValidationErrorCodes.INVALID_LENGTH, 'warning'));
  }

  if (!validators.isNonEmptyString(hero.ctaText)) {
    errors.push(createValidationError('hero.ctaText', 'CTA text is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  if (!validators.isNonEmptyString(hero.instagramHandle)) {
    errors.push(createValidationError('hero.instagramHandle', 'Instagram handle is required', ValidationErrorCodes.REQUIRED_FIELD));
  } else if (!validators.isValidHandle(hero.instagramHandle)) {
    errors.push(createValidationError('hero.instagramHandle', 'Invalid Instagram handle format', ValidationErrorCodes.INVALID_FORMAT));
  }

  if (!validators.isNonEmptyString(hero.instagramUrl)) {
    errors.push(createValidationError('hero.instagramUrl', 'Instagram URL is required', ValidationErrorCodes.REQUIRED_FIELD));
  } else if (!validators.isValidUrl(hero.instagramUrl)) {
    errors.push(createValidationError('hero.instagramUrl', 'Invalid Instagram URL format', ValidationErrorCodes.INVALID_URL));
  }

  // Optional fields validation
  if (hero.ctaLink && !validators.isValidUrl(hero.ctaLink)) {
    errors.push(createValidationError('hero.ctaLink', 'Invalid CTA link URL', ValidationErrorCodes.INVALID_URL));
  }

  if (hero.backgroundImage && !validators.isValidUrl(hero.backgroundImage)) {
    errors.push(createValidationError('hero.backgroundImage', 'Invalid background image URL', ValidationErrorCodes.INVALID_URL));
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * About content validation
 */
export function validateAboutContent(content: unknown): ContentValidationResult {
  const errors: ContentValidationError[] = [];
  const warnings: ContentValidationError[] = [];

  if (!content || typeof content !== 'object') {
    errors.push(createValidationError('about', 'About content must be an object', ValidationErrorCodes.INVALID_TYPE));
    return { valid: false, errors, warnings };
  }

  const about = content as Partial<AboutContent>;

  // Required fields
  if (!validators.isNonEmptyString(about.title)) {
    errors.push(createValidationError('about.title', 'Title is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  if (!validators.isNonEmptyArray(about.content)) {
    errors.push(createValidationError('about.content', 'Content array is required and must not be empty', ValidationErrorCodes.REQUIRED_FIELD));
  } else {
    about.content.forEach((paragraph, index) => {
      if (!validators.isNonEmptyString(paragraph)) {
        errors.push(createValidationError(`about.content[${index}]`, 'Each content paragraph must be a non-empty string', ValidationErrorCodes.INVALID_TYPE));
      }
    });
  }

  if (!validators.isNonEmptyArray(about.skills)) {
    errors.push(createValidationError('about.skills', 'Skills array is required', ValidationErrorCodes.REQUIRED_FIELD));
  } else {
    about.skills.forEach((skill, index) => {
      const skillErrors = validateSkill(skill, `about.skills[${index}]`);
      errors.push(...skillErrors.errors);
      warnings.push(...skillErrors.warnings);
    });
  }

  // Optional fields validation
  if (about.achievements) {
    about.achievements.forEach((achievement, index) => {
      const achievementErrors = validateAchievement(achievement, `about.achievements[${index}]`);
      errors.push(...achievementErrors.errors);
      warnings.push(...achievementErrors.warnings);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Skill validation helper
 */
function validateSkill(skill: unknown, fieldPrefix: string): ContentValidationResult {
  const errors: ContentValidationError[] = [];
  const warnings: ContentValidationError[] = [];

  if (!skill || typeof skill !== 'object') {
    errors.push(createValidationError(fieldPrefix, 'Skill must be an object', ValidationErrorCodes.INVALID_TYPE));
    return { valid: false, errors, warnings };
  }

  const s = skill as Partial<Skill>;

  if (!validators.isNonEmptyString(s.name)) {
    errors.push(createValidationError(`${fieldPrefix}.name`, 'Skill name is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  if (!s.level || !validLevels.includes(s.level)) {
    errors.push(createValidationError(`${fieldPrefix}.level`, `Skill level must be one of: ${validLevels.join(', ')}`, ValidationErrorCodes.INVALID_FORMAT));
  }

  if (s.yearsExperience !== undefined && !validators.isNonNegativeNumber(s.yearsExperience)) {
    errors.push(createValidationError(`${fieldPrefix}.yearsExperience`, 'Years of experience must be a non-negative number', ValidationErrorCodes.INVALID_TYPE));
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Achievement validation helper
 */
function validateAchievement(achievement: unknown, fieldPrefix: string): ContentValidationResult {
  const errors: ContentValidationError[] = [];
  const warnings: ContentValidationError[] = [];

  if (!achievement || typeof achievement !== 'object') {
    errors.push(createValidationError(fieldPrefix, 'Achievement must be an object', ValidationErrorCodes.INVALID_TYPE));
    return { valid: false, errors, warnings };
  }

  const a = achievement as Partial<Achievement>;

  if (!validators.isNonEmptyString(a.id)) {
    errors.push(createValidationError(`${fieldPrefix}.id`, 'Achievement ID is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  if (!validators.isNonEmptyString(a.title)) {
    errors.push(createValidationError(`${fieldPrefix}.title`, 'Achievement title is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  if (!validators.isNonEmptyString(a.description)) {
    errors.push(createValidationError(`${fieldPrefix}.description`, 'Achievement description is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  if (!validators.isValidDate(a.date)) {
    errors.push(createValidationError(`${fieldPrefix}.date`, 'Achievement date must be a valid date', ValidationErrorCodes.INVALID_DATE));
  }

  const validCategories = ['education', 'performance', 'teaching', 'recognition'];
  if (!a.category || !validCategories.includes(a.category)) {
    errors.push(createValidationError(`${fieldPrefix}.category`, `Category must be one of: ${validCategories.join(', ')}`, ValidationErrorCodes.INVALID_FORMAT));
  }

  if (a.link && !validators.isValidUrl(a.link)) {
    errors.push(createValidationError(`${fieldPrefix}.link`, 'Achievement link must be a valid URL', ValidationErrorCodes.INVALID_URL));
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Lesson package validation
 */
export function validateLessonPackage(pkg: unknown): ContentValidationResult {
  const errors: ContentValidationError[] = [];
  const warnings: ContentValidationError[] = [];

  if (!pkg || typeof pkg !== 'object') {
    errors.push(createValidationError('package', 'Lesson package must be an object', ValidationErrorCodes.INVALID_TYPE));
    return { valid: false, errors, warnings };
  }

  const p = pkg as Partial<LessonPackage>;

  // Required fields
  if (!validators.isNonEmptyString(p.name)) {
    errors.push(createValidationError('package.name', 'Package name is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  if (!validators.isNonEmptyString(p.description)) {
    errors.push(createValidationError('package.description', 'Package description is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  if (!validators.isPositiveNumber(p.price)) {
    errors.push(createValidationError('package.price', 'Package price must be a positive number', ValidationErrorCodes.INVALID_TYPE));
  }

  if (p.sessions === undefined || !validators.isNonNegativeNumber(p.sessions)) {
    errors.push(createValidationError('package.sessions', 'Sessions must be a non-negative number (0 for unlimited)', ValidationErrorCodes.INVALID_TYPE));
  }

  if (!validators.isPositiveNumber(p.duration)) {
    errors.push(createValidationError('package.duration', 'Duration must be a positive number (minutes)', ValidationErrorCodes.INVALID_TYPE));
  }

  if (!validators.isNonEmptyArray(p.features)) {
    errors.push(createValidationError('package.features', 'Features array is required and must not be empty', ValidationErrorCodes.REQUIRED_FIELD));
  }

  if (typeof p.popular !== 'boolean') {
    errors.push(createValidationError('package.popular', 'Popular must be a boolean value', ValidationErrorCodes.INVALID_TYPE));
  }

  if (!validators.isNonEmptyArray(p.targetAudience)) {
    errors.push(createValidationError('package.targetAudience', 'Target audience is required', ValidationErrorCodes.REQUIRED_FIELD));
  } else {
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    p.targetAudience.forEach((level, index) => {
      if (!validLevels.includes(level)) {
        errors.push(createValidationError(`package.targetAudience[${index}]`, `Target audience level must be one of: ${validLevels.join(', ')}`, ValidationErrorCodes.INVALID_FORMAT));
      }
    });
  }

  if (!validators.isNonEmptyArray(p.instruments)) {
    errors.push(createValidationError('package.instruments', 'Instruments array is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  if (!validators.isNonEmptyArray(p.included)) {
    errors.push(createValidationError('package.included', 'Included items array is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  // Validation logic
  if (p.originalPrice && p.price && p.originalPrice <= p.price) {
    warnings.push(createValidationError('package.originalPrice', 'Original price should be higher than current price', ValidationErrorCodes.INVALID_RANGE, 'warning'));
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Testimonial validation
 */
export function validateTestimonial(testimonial: unknown): ContentValidationResult {
  const errors: ContentValidationError[] = [];
  const warnings: ContentValidationError[] = [];

  if (!testimonial || typeof testimonial !== 'object') {
    errors.push(createValidationError('testimonial', 'Testimonial must be an object', ValidationErrorCodes.INVALID_TYPE));
    return { valid: false, errors, warnings };
  }

  const t = testimonial as Partial<Testimonial>;

  // Required fields
  if (!validators.isNonEmptyString(t.name)) {
    errors.push(createValidationError('testimonial.name', 'Name is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  if (!validators.isNonEmptyString(t.text)) {
    errors.push(createValidationError('testimonial.text', 'Testimonial text is required', ValidationErrorCodes.REQUIRED_FIELD));
  } else if (!validators.hasValidLength(t.text, 10, 1000)) {
    warnings.push(createValidationError('testimonial.text', 'Testimonial text should be between 10-1000 characters', ValidationErrorCodes.INVALID_LENGTH, 'warning'));
  }

  if (!validators.isValidRating(t.rating)) {
    errors.push(createValidationError('testimonial.rating', 'Rating must be an integer between 1 and 5', ValidationErrorCodes.INVALID_RANGE));
  }

  if (!validators.isValidDate(t.date)) {
    errors.push(createValidationError('testimonial.date', 'Date must be a valid date', ValidationErrorCodes.INVALID_DATE));
  }

  if (typeof t.featured !== 'boolean') {
    errors.push(createValidationError('testimonial.featured', 'Featured must be a boolean', ValidationErrorCodes.INVALID_TYPE));
  }

  if (typeof t.verified !== 'boolean') {
    errors.push(createValidationError('testimonial.verified', 'Verified must be a boolean', ValidationErrorCodes.INVALID_TYPE));
  }

  // Optional field validation
  if (t.level) {
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(t.level)) {
      errors.push(createValidationError('testimonial.level', `Level must be one of: ${validLevels.join(', ')}`, ValidationErrorCodes.INVALID_FORMAT));
    }
  }

  if (t.age !== undefined && (!validators.isPositiveNumber(t.age) || t.age > 150)) {
    errors.push(createValidationError('testimonial.age', 'Age must be a positive number less than 150', ValidationErrorCodes.INVALID_RANGE));
  }

  if (t.videoUrl && !validators.isValidUrl(t.videoUrl)) {
    errors.push(createValidationError('testimonial.videoUrl', 'Video URL must be valid', ValidationErrorCodes.INVALID_URL));
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Contact method validation
 */
export function validateContactMethod(method: unknown): ContentValidationResult {
  const errors: ContentValidationError[] = [];
  const warnings: ContentValidationError[] = [];

  if (!method || typeof method !== 'object') {
    errors.push(createValidationError('contactMethod', 'Contact method must be an object', ValidationErrorCodes.INVALID_TYPE));
    return { valid: false, errors, warnings };
  }

  const m = method as Partial<ContactMethod>;

  const validTypes = ['email', 'phone', 'instagram', 'whatsapp', 'facebook', 'linkedin', 'website'];
  if (!m.type || !validTypes.includes(m.type)) {
    errors.push(createValidationError('contactMethod.type', `Type must be one of: ${validTypes.join(', ')}`, ValidationErrorCodes.INVALID_FORMAT));
  }

  if (!validators.isNonEmptyString(m.label)) {
    errors.push(createValidationError('contactMethod.label', 'Label is required', ValidationErrorCodes.REQUIRED_FIELD));
  }

  if (!validators.isNonEmptyString(m.value)) {
    errors.push(createValidationError('contactMethod.value', 'Value is required', ValidationErrorCodes.REQUIRED_FIELD));
  } else if (m.type === 'email' && !validators.isValidEmail(m.value)) {
    errors.push(createValidationError('contactMethod.value', 'Invalid email format', ValidationErrorCodes.INVALID_EMAIL));
  } else if (m.type === 'phone' && !validators.isValidPhone(m.value)) {
    errors.push(createValidationError('contactMethod.value', 'Invalid phone number format', ValidationErrorCodes.INVALID_FORMAT));
  }

  if (!validators.isNonEmptyString(m.href)) {
    errors.push(createValidationError('contactMethod.href', 'Href is required', ValidationErrorCodes.REQUIRED_FIELD));
  } else if (!validators.isValidUrl(m.href) && !m.href.startsWith('mailto:') && !m.href.startsWith('tel:')) {
    errors.push(createValidationError('contactMethod.href', 'Href must be a valid URL, mailto:, or tel: link', ValidationErrorCodes.INVALID_URL));
  }

  if (typeof m.primary !== 'boolean') {
    errors.push(createValidationError('contactMethod.primary', 'Primary must be a boolean', ValidationErrorCodes.INVALID_TYPE));
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Complete site content validation
 */
export function validateSiteContent(content: unknown): ContentValidationResult {
  const errors: ContentValidationError[] = [];
  const warnings: ContentValidationError[] = [];

  if (!content || typeof content !== 'object') {
    errors.push(createValidationError('siteContent', 'Site content must be an object', ValidationErrorCodes.INVALID_TYPE));
    return { valid: false, errors, warnings };
  }

  const site = content as Partial<SiteContent>;

  // Validate each section
  const sections = ['hero', 'about', 'approach', 'lessons', 'community', 'contact', 'seo'] as const;
  
  for (const section of sections) {
    if (!site[section]) {
      errors.push(createValidationError(`siteContent.${section}`, `${section} section is required`, ValidationErrorCodes.REQUIRED_FIELD));
      continue;
    }

    let sectionValidation: ContentValidationResult;

    switch (section) {
      case 'hero':
        sectionValidation = validateHeroContent(site.hero);
        break;
      case 'about':
        sectionValidation = validateAboutContent(site.about);
        break;
      // Add other section validations as needed
      default:
        continue;
    }

    errors.push(...sectionValidation.errors);
    warnings.push(...sectionValidation.warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validation utility functions for specific use cases
 */
export const validationUtils = {
  /**
   * Get validation summary
   */
  getValidationSummary: (result: ContentValidationResult) => {
    return {
      isValid: result.valid,
      errorCount: result.errors.length,
      warningCount: result.warnings.length,
      hasErrors: result.errors.length > 0,
      hasWarnings: result.warnings.length > 0,
      criticalErrors: result.errors.filter(e => e.severity === 'error'),
      nonCriticalIssues: [...result.errors.filter(e => e.severity !== 'error'), ...result.warnings]
    };
  },

  /**
   * Format validation errors for display
   */
  formatValidationErrors: (errors: ContentValidationError[]): string => {
    return errors
      .map(error => `${error.field}: ${error.message}`)
      .join('\n');
  },

  /**
   * Group errors by field
   */
  groupErrorsByField: (errors: ContentValidationError[]) => {
    return errors.reduce((groups, error) => {
      const field = error.field.split('.')[0];
      if (!groups[field]) {
        groups[field] = [];
      }
      groups[field].push(error);
      return groups;
    }, {} as Record<string, ContentValidationError[]>);
  },

  /**
   * Check if content passes minimum validation requirements
   */
  meetsMinimumRequirements: (result: ContentValidationResult): boolean => {
    const criticalErrors = result.errors.filter(e => e.severity === 'error');
    return criticalErrors.length === 0;
  }
};