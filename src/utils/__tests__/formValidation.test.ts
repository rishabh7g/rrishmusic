import { describe, it, expect } from 'vitest';

// Validation utilities
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  // Simpler, more reliable email validation
  const trimmedEmail = email.trim();
  
  // Basic format check: must contain @ and have text before/after
  if (!trimmedEmail.includes('@')) return false;
  
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) return false;
  
  const [localPart, domainPart] = parts;
  
  // Local part validation
  if (!localPart || localPart.length === 0) return false;
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  if (localPart.includes('..')) return false;
  if (localPart.includes(' ')) return false;
  
  // Domain part validation  
  if (!domainPart || domainPart.length === 0) return false;
  if (domainPart.startsWith('.') || domainPart.endsWith('.')) return false;
  if (domainPart.includes('..')) return false;
  if (domainPart.includes(' ')) return false;
  if (!domainPart.includes('.')) return false; // Must have at least one dot
  
  // Check for valid characters (basic check)
  const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+$/;
  return validEmailRegex.test(trimmedEmail);
};

export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Accept US phone numbers (10 digits) or international formats (7-15 digits)
  return cleaned.length >= 7 && cleaned.length <= 15;
};

export const validateRequired = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  if (!value || typeof value !== 'string') return true; // Optional field
  return value.trim().length <= maxLength;
};

// Data types for testing
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface TeachingInquiryData {
  name: string;
  email: string;
  phone?: string;
  package: string;
  experience?: string;
}

export interface PerformanceInquiryData {
  name: string;
  email: string;
  phone?: string;
  eventDate: string;
  eventType: string;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export const validateContactForm = (data: ContactFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Safely handle undefined/null data
  const safeData = {
    name: data?.name || '',
    email: data?.email || '',
    phone: data?.phone || '',
    message: data?.message || '',
  };

  // Required field validation with trimming
  if (!validateRequired(safeData.name)) {
    errors.name = 'Name is required';
  } else if (!validateMinLength(safeData.name, 2)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!validateRequired(safeData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(safeData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone is optional, but if provided, must be valid
  if (safeData.phone && !validatePhone(safeData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!validateRequired(safeData.message)) {
    errors.message = 'Message is required';
  } else if (!validateMinLength(safeData.message, 10)) {
    errors.message = 'Message must be at least 10 characters';
  } else if (!validateMaxLength(safeData.message, 1000)) {
    errors.message = 'Message must be less than 1000 characters';
  }

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.values(errors).some(error => error !== undefined && error !== '');
};

// Service-specific validation
export const validatePerformanceInquiry = (data: PerformanceInquiryData): ValidationErrors => {
  const errors: ValidationErrors = {};

  const safeData = {
    name: data?.name || '',
    email: data?.email || '',
    phone: data?.phone || '',
    eventDate: data?.eventDate || '',
    eventType: data?.eventType || '',
  };

  // Basic contact validation
  if (!validateRequired(safeData.name)) {
    errors.name = 'Name is required';
  }

  if (!validateRequired(safeData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(safeData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Performance-specific validation
  if (!validateRequired(safeData.eventDate)) {
    errors.eventDate = 'Event date is required';
  } else {
    const eventDate = new Date(safeData.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      errors.eventDate = 'Event date must be in the future';
    }
  }

  if (!validateRequired(safeData.eventType)) {
    errors.eventType = 'Event type is required';
  }

  return errors;
};

export const validateTeachingInquiry = (data: TeachingInquiryData): ValidationErrors => {
  const errors: ValidationErrors = {};

  const safeData = {
    name: data?.name || '',
    email: data?.email || '',
    phone: data?.phone || '',
    package: data?.package || '',
    experience: data?.experience || '',
  };

  // Basic contact validation
  if (!validateRequired(safeData.name)) {
    errors.name = 'Name is required';
  }

  if (!validateRequired(safeData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(safeData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Teaching-specific validation
  if (!validateRequired(safeData.package)) {
    errors.package = 'Please select a lesson package';
  }

  return errors;
};

describe('Form Validation Utilities - Business Logic Testing', () => {
  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org',
        'firstname.lastname@company.com',
        'user@sub.domain.com',
        'test@example-domain.com',
        'user123@example.com',
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        '',
        'notanemail',
        '@example.com',
        'user@',
        'user@.com',
        'user.@example.com',
        '.user@example.com',
        'user..name@example.com',
        'user@example.',
        'user spaces@example.com',
        'user@exam ple.com',
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('Phone Validation', () => {
    it('should validate correct phone numbers', () => {
      const validPhones = [
        '555-123-4567',
        '(555) 123-4567',
        '555.123.4567',
        '5551234567',
        '+1 555 123 4567',
        '1234567', // Minimum 7 digits
        '+44 20 7123 4567', // UK format
        '+61 2 1234 5678', // Australia format
      ];

      validPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '',
        '123',
        '12345',
        'abc',
        'phone',
        '1234567890123456', // Too long (16 digits)
        "12345678901234567", // Too long (17 digits)
      ];

      invalidPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(false);
      });
    });
  });

  describe('Required Field Validation', () => {
    it('should validate required fields correctly', () => {
      expect(validateRequired('Hello')).toBe(true);
      expect(validateRequired('  Valid  ')).toBe(true);
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired(null as unknown)).toBe(false);
      expect(validateRequired(undefined as unknown)).toBe(false);
    });
  });

  describe('Length Validation', () => {
    it('should validate minimum length correctly', () => {
      expect(validateMinLength('Hello', 3)).toBe(true);
      expect(validateMinLength('Hi', 3)).toBe(false);
      expect(validateMinLength('  Hi  ', 2)).toBe(true);
      expect(validateMinLength('', 1)).toBe(false);
      expect(validateMinLength(null as unknown, 1)).toBe(false);
    });

    it('should validate maximum length correctly', () => {
      expect(validateMaxLength('Hello', 10)).toBe(true);
      expect(validateMaxLength('This is too long', 5)).toBe(false);
      expect(validateMaxLength('  Hi  ', 2)).toBe(true);
      expect(validateMaxLength('', 5)).toBe(true);
      expect(validateMaxLength(null as unknown, 5)).toBe(true); // Optional field
    });
  });

  describe('Contact Form Validation', () => {
    it('should pass validation with valid data', () => {
      const validData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        message: 'This is a test message.',
      };

      const errors = validateContactForm(validData);
      expect(hasValidationErrors(errors)).toBe(false);
    });

    it('should require name field', () => {
      const invalidData: ContactFormData = {
        name: '',
        email: 'john@example.com',
        message: 'This is a test message.',
      };

      const errors = validateContactForm(invalidData);
      expect(errors.name).toBe('Name is required');
    });

    it('should require minimum name length', () => {
      const invalidData: ContactFormData = {
        name: 'J',
        email: 'john@example.com',
        message: 'This is a test message.',
      };

      const errors = validateContactForm(invalidData);
      expect(errors.name).toBe('Name must be at least 2 characters');
    });

    it('should require email field', () => {
      const invalidData: ContactFormData = {
        name: 'John Doe',
        email: '',
        message: 'This is a test message.',
      };

      const errors = validateContactForm(invalidData);
      expect(errors.email).toBe('Email is required');
    });

    it('should validate email format', () => {
      const invalidData: ContactFormData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a test message.',
      };

      const errors = validateContactForm(invalidData);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('should validate phone format when provided', () => {
      const invalidData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123',
        message: 'This is a test message.',
      };

      const errors = validateContactForm(invalidData);
      expect(errors.phone).toBe('Please enter a valid phone number');
    });

    it('should allow empty phone number', () => {
      const validData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        message: 'This is a test message.',
      };

      const errors = validateContactForm(validData);
      expect(errors.phone).toBeUndefined();
    });

    it('should require message field', () => {
      const invalidData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: '',
      };

      const errors = validateContactForm(invalidData);
      expect(errors.message).toBe('Message is required');
    });

    it('should enforce minimum message length', () => {
      const invalidData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
      };

      const errors = validateContactForm(invalidData);
      expect(errors.message).toBe('Message must be at least 10 characters');
    });

    it('should enforce maximum message length', () => {
      const invalidData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'x'.repeat(1001),
      };

      const errors = validateContactForm(invalidData);
      expect(errors.message).toBe('Message must be less than 1000 characters');
    });
  });

  describe('Service-Specific Validation', () => {
    it('should validate performance inquiry event dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const invalidData: PerformanceInquiryData = {
        name: 'John Doe',
        email: 'john@example.com',
        eventDate: pastDate.toISOString().split('T')[0],
        eventType: 'wedding',
      };

      const errors = validatePerformanceInquiry(invalidData);
      expect(errors.eventDate).toBe('Event date must be in the future');
    });

    it('should accept future event dates for performance inquiries', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const validData: PerformanceInquiryData = {
        name: 'John Doe',
        email: 'john@example.com',
        eventDate: futureDate.toISOString().split('T')[0],
        eventType: 'wedding',
      };

      const errors = validatePerformanceInquiry(validData);
      expect(hasValidationErrors(errors)).toBe(false);
    });

    it('should require package selection for teaching inquiries', () => {
      const invalidData: TeachingInquiryData = {
        name: 'John Doe',
        email: 'john@example.com',
        package: '',
      };

      const errors = validateTeachingInquiry(invalidData);
      expect(errors.package).toBe('Please select a lesson package');
    });

    it('should accept teaching inquiries with package selection', () => {
      const validData: TeachingInquiryData = {
        name: 'John Doe',
        email: 'john@example.com',
        package: 'single-lesson',
      };

      const errors = validateTeachingInquiry(validData);
      expect(hasValidationErrors(errors)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values gracefully', () => {
      const incompleteData = {
        name: undefined,
        email: undefined,
        message: undefined,
      };

      expect(() => {
        validateContactForm(incompleteData as ContactFormData);
      }).not.toThrow();
    });

    it('should trim whitespace from required fields', () => {
      const dataWithWhitespace: ContactFormData = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        phone: '  555-123-4567  ',
        message: '  This is a test message.  ',
      };

      const errors = validateContactForm(dataWithWhitespace);
      expect(hasValidationErrors(errors)).toBe(false);
    });

    it('should handle special characters in names', () => {
      const validData: ContactFormData = {
        name: "O'Connor-Smith Jr.",
        email: 'john@example.com',
        message: 'This is a test message.',
      };

      const errors = validateContactForm(validData);
      expect(errors.name).toBeUndefined();
    });
  });

  describe('Real-World Scenarios', () => {
    it('should validate complete teaching inquiry form', () => {
      const teachingData: TeachingInquiryData = {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@gmail.com',
        phone: '+1 (555) 987-6543',
        package: 'foundation-package',
        experience: 'beginner',
      };

      const errors = validateTeachingInquiry(teachingData);
      expect(hasValidationErrors(errors)).toBe(false);
    });

    it('should validate complete performance inquiry form', () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 2);

      const performanceData: PerformanceInquiryData = {
        name: 'Michael Brown',
        email: 'michael.brown@company.com',
        phone: '555-321-9876',
        eventDate: futureDate.toISOString().split('T')[0],
        eventType: 'corporate-event',
      };

      const errors = validatePerformanceInquiry(performanceData);
      expect(hasValidationErrors(errors)).toBe(false);
    });

    it('should validate complete collaboration inquiry form', () => {
      const contactData: ContactFormData = {
        name: 'Alex Rivera',
        email: 'alex.rivera@studio.com',
        phone: '+44 20 7123 4567',
        message: 'Hi Rrish, I\'d love to collaborate on a new project. I\'m a producer looking for guitar work on an indie rock album.',
      };

      const errors = validateContactForm(contactData);
      expect(hasValidationErrors(errors)).toBe(false);
    });
  });
});