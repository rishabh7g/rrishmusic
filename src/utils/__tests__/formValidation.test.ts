import { describe, it, expect } from 'vitest';

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Check for US phone number (10 digits)
  return cleaned.length === 10;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

// Form-specific validation
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
  packageType?: string;
  eventDate?: string;
  budget?: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  service?: string;
  packageType?: string;
  eventDate?: string;
  budget?: string;
}

export const validateContactForm = (data: ContactFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Required field validation
  if (!validateRequired(data.name)) {
    errors.name = 'Name is required';
  } else if (!validateMinLength(data.name, 2)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!validateRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!validateRequired(data.message)) {
    errors.message = 'Message is required';
  } else if (!validateMinLength(data.message, 10)) {
    errors.message = 'Message must be at least 10 characters';
  } else if (!validateMaxLength(data.message, 1000)) {
    errors.message = 'Message must be less than 1000 characters';
  }

  // Service-specific validation
  if (data.service === 'performance' && data.eventDate) {
    const eventDate = new Date(data.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      errors.eventDate = 'Event date must be in the future';
    }
  }

  if (data.service === 'teaching' && !data.packageType) {
    errors.packageType = 'Please select a lesson package';
  }

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// Tests
describe('Form Validation Utilities - Business Logic Testing', () => {
  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.com',
        'firstname+lastname@domain.co.uk',
        'user123@domain123.org'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        '',
        'invalid',
        '@domain.com',
        'user@',
        'user@domain',
        'user.domain.com',
        'user@domain..com',
        'user name@domain.com'
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('Phone Validation', () => {
    it('should validate correct phone numbers', () => {
      const validPhones = [
        '1234567890',
        '(123) 456-7890',
        '123-456-7890',
        '123.456.7890',
        '+1 123 456 7890'
      ];

      validPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '',
        '123',
        '12345678901', // too long
        'abc123defg',
        '123456789' // too short
      ];

      invalidPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(false);
      });
    });
  });

  describe('Required Field Validation', () => {
    it('should validate required fields correctly', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired('  test  ')).toBe(true);
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });
  });

  describe('Length Validation', () => {
    it('should validate minimum length correctly', () => {
      expect(validateMinLength('hello', 3)).toBe(true);
      expect(validateMinLength('hello', 5)).toBe(true);
      expect(validateMinLength('hi', 3)).toBe(false);
      expect(validateMinLength('  hi  ', 2)).toBe(true); // trims whitespace
    });

    it('should validate maximum length correctly', () => {
      expect(validateMaxLength('hello', 10)).toBe(true);
      expect(validateMaxLength('hello', 5)).toBe(true);
      expect(validateMaxLength('hello world', 5)).toBe(false);
    });
  });

  describe('Contact Form Validation', () => {
    const validFormData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      message: 'I am interested in guitar lessons.',
      service: 'teaching',
      packageType: 'standard'
    };

    it('should pass validation with valid data', () => {
      const errors = validateContactForm(validFormData);
      expect(hasValidationErrors(errors)).toBe(false);
    });

    it('should require name field', () => {
      const invalidData = { ...validFormData, name: '' };
      const errors = validateContactForm(invalidData);
      expect(errors.name).toBe('Name is required');
    });

    it('should require minimum name length', () => {
      const invalidData = { ...validFormData, name: 'J' };
      const errors = validateContactForm(invalidData);
      expect(errors.name).toBe('Name must be at least 2 characters');
    });

    it('should require email field', () => {
      const invalidData = { ...validFormData, email: '' };
      const errors = validateContactForm(invalidData);
      expect(errors.email).toBe('Email is required');
    });

    it('should validate email format', () => {
      const invalidData = { ...validFormData, email: 'invalid-email' };
      const errors = validateContactForm(invalidData);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('should validate phone format when provided', () => {
      const invalidData = { ...validFormData, phone: '123' };
      const errors = validateContactForm(invalidData);
      expect(errors.phone).toBe('Please enter a valid phone number');
    });

    it('should allow empty phone number', () => {
      const validData = { ...validFormData, phone: '' };
      const errors = validateContactForm(validData);
      expect(errors.phone).toBeUndefined();
    });

    it('should require message field', () => {
      const invalidData = { ...validFormData, message: '' };
      const errors = validateContactForm(invalidData);
      expect(errors.message).toBe('Message is required');
    });

    it('should enforce minimum message length', () => {
      const invalidData = { ...validFormData, message: 'Too short' };
      const errors = validateContactForm(invalidData);
      expect(errors.message).toBe('Message must be at least 10 characters');
    });

    it('should enforce maximum message length', () => {
      const longMessage = 'a'.repeat(1001);
      const invalidData = { ...validFormData, message: longMessage };
      const errors = validateContactForm(invalidData);
      expect(errors.message).toBe('Message must be less than 1000 characters');
    });
  });

  describe('Service-Specific Validation', () => {
    it('should validate performance inquiry event dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const performanceData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I need live music for my event',
        service: 'performance',
        eventDate: yesterday.toISOString().split('T')[0]
      };

      const errors = validateContactForm(performanceData);
      expect(errors.eventDate).toBe('Event date must be in the future');
    });

    it('should accept future event dates for performance inquiries', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const performanceData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I need live music for my event',
        service: 'performance',
        eventDate: tomorrow.toISOString().split('T')[0]
      };

      const errors = validateContactForm(performanceData);
      expect(errors.eventDate).toBeUndefined();
    });

    it('should require package selection for teaching inquiries', () => {
      const teachingData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I want to learn guitar',
        service: 'teaching'
        // packageType missing
      };

      const errors = validateContactForm(teachingData);
      expect(errors.packageType).toBe('Please select a lesson package');
    });

    it('should accept teaching inquiries with package selection', () => {
      const teachingData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I want to learn guitar',
        service: 'teaching',
        packageType: 'beginner'
      };

      const errors = validateContactForm(teachingData);
      expect(errors.packageType).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values gracefully', () => {
      const incompleteData: Partial<ContactFormData> = {
        name: 'John Doe'
      };

      expect(() => {
        validateContactForm(incompleteData as ContactFormData);
      }).not.toThrow();
    });

    it('should trim whitespace from required fields', () => {
      const dataWithWhitespace: ContactFormData = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        message: '  I am interested in lessons  '
      };

      const errors = validateContactForm(dataWithWhitespace);
      expect(hasValidationErrors(errors)).toBe(false);
    });

    it('should handle special characters in names', () => {
      const specialNameData: ContactFormData = {
        name: "O'Connor-Smith",
        email: 'test@example.com',
        message: 'Test message with sufficient length'
      };

      const errors = validateContactForm(specialNameData);
      expect(errors.name).toBeUndefined();
    });
  });

  describe('Real-World Scenarios', () => {
    it('should validate complete teaching inquiry form', () => {
      const teachingInquiry: ContactFormData = {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567',
        message: 'I am a complete beginner and would like to start learning acoustic guitar. I am available for lessons on weekends.',
        service: 'teaching',
        packageType: 'beginner-monthly'
      };

      const errors = validateContactForm(teachingInquiry);
      expect(hasValidationErrors(errors)).toBe(false);
    });

    it('should validate complete performance inquiry form', () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 2);

      const performanceInquiry: ContactFormData = {
        name: 'Michael Davis',
        email: 'mike.davis@company.com',
        phone: '555.987.6543',
        message: 'We need acoustic guitar music for our corporate event. The venue is outdoors and we expect about 100 guests.',
        service: 'performance',
        eventDate: futureDate.toISOString().split('T')[0],
        budget: '500-1000'
      };

      const errors = validateContactForm(performanceInquiry);
      expect(hasValidationErrors(errors)).toBe(false);
    });

    it('should validate complete collaboration inquiry form', () => {
      const collaborationInquiry: ContactFormData = {
        name: 'Alex Rodriguez',
        email: 'alex.r.music@gmail.com',
        message: 'I am working on an indie folk album and need guitar tracks for 5 songs. Looking for both rhythm and lead guitar parts.',
        service: 'collaboration'
      };

      const errors = validateContactForm(collaborationInquiry);
      expect(hasValidationErrors(errors)).toBe(false);
    });
  });
});