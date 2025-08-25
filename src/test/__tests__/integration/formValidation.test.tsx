/**
 * Form Validation Integration Tests
 * 
 * Comprehensive integration tests for form validation across all service contexts.
 * Tests the interaction between form components, validation hooks, and validation utilities.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Form components
import { TeachingInquiryForm } from '@/components/forms/TeachingInquiryForm';
import { PerformanceInquiryForm } from '@/components/forms/PerformanceInquiryForm';
import { CollaborationInquiryForm } from '@/components/forms/CollaborationInquiryForm';

// Validation utilities
import { validateField, validateForm, getServiceValidationRules } from '@/utils/formValidation';

// Test data
import { 
  validTeachingData, 
  validPerformanceData, 
  validCollaborationData,
} from '@/test/mocks/formData';

// Mock fetch for form submissions
global.fetch = vi.fn();

const mockFetch = vi.mocked(fetch);

// Helper function to render form with routing context
const renderFormWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Form Validation Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Teaching Form Validation', () => {
    it('validates required fields on form submission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Submit form without filling required fields
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Check for validation errors
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/experience level is required/i)).toBeInTheDocument();
        expect(screen.getByText(/musical goals are required/i)).toBeInTheDocument();
      });

      // Verify form was not submitted
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('validates email format in real-time', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      const emailInput = screen.getByLabelText(/email/i);

      // Enter invalid email
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });

      // Enter valid email
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
      });
    });

    it('validates teaching-specific fields', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Fill in basic required fields
      await user.type(screen.getByLabelText(/name/i), validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      
      // Test package selection validation
      const packageSelect = screen.getByLabelText(/package type/i);
      expect(packageSelect).toBeInTheDocument();

      // Test experience level validation
      const experienceSelect = screen.getByLabelText(/experience level/i);
      expect(experienceSelect).toBeInTheDocument();

      // Test musical goals validation (should require minimum length)
      const goalsTextarea = screen.getByLabelText(/musical goals/i);
      await user.type(goalsTextarea, 'abc'); // Too short
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/please provide more details about your musical goals/i)).toBeInTheDocument();
      });
    });

    it('successfully submits valid teaching form data', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Fill form with valid data
      await user.type(screen.getByLabelText(/name/i), validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      await user.type(screen.getByLabelText(/phone/i), validTeachingData.phone || '');
      
      // Select package type
      await user.selectOptions(screen.getByLabelText(/package type/i), validTeachingData.packageType);
      
      // Select experience level
      await user.selectOptions(screen.getByLabelText(/experience level/i), validTeachingData.experienceLevel);
      
      // Fill musical goals
      await user.type(screen.getByLabelText(/musical goals/i), validTeachingData.musicalGoals);

      // Submit form
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/contact'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            }),
            body: expect.stringContaining(validTeachingData.name)
          })
        );
      });
    });
  });

  describe('Performance Form Validation', () => {
    it('validates performance-specific required fields', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <PerformanceInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Submit without required fields
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/event type is required/i)).toBeInTheDocument();
        expect(screen.getByText(/performance format is required/i)).toBeInTheDocument();
      });
    });

    it('validates event date format and future date requirement', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <PerformanceInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      const dateInput = screen.getByLabelText(/event date/i);

      // Test past date
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const pastDateString = pastDate.toISOString().split('T')[0];

      await user.type(dateInput, pastDateString);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/event date must be in the future/i)).toBeInTheDocument();
      });

      // Test future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateString = futureDate.toISOString().split('T')[0];

      await user.clear(dateInput);
      await user.type(dateInput, futureDateString);
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/event date must be in the future/i)).not.toBeInTheDocument();
      });
    });

    it('validates budget range selection', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <PerformanceInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Fill required fields first
      await user.type(screen.getByLabelText(/name/i), validPerformanceData.name);
      await user.type(screen.getByLabelText(/email/i), validPerformanceData.email);
      await user.selectOptions(screen.getByLabelText(/event type/i), validPerformanceData.eventType);
      await user.selectOptions(screen.getByLabelText(/performance format/i), validPerformanceData.performanceFormat);

      // Test budget range selection
      const budgetSelect = screen.getByLabelText(/budget range/i);
      await user.selectOptions(budgetSelect, validPerformanceData.budgetRange);

      expect(budgetSelect).toHaveValue(validPerformanceData.budgetRange);
    });

    it('handles performance form submission successfully', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <PerformanceInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Fill form with valid performance data
      await user.type(screen.getByLabelText(/name/i), validPerformanceData.name);
      await user.type(screen.getByLabelText(/email/i), validPerformanceData.email);
      await user.selectOptions(screen.getByLabelText(/event type/i), validPerformanceData.eventType);
      await user.selectOptions(screen.getByLabelText(/performance format/i), validPerformanceData.performanceFormat);
      await user.selectOptions(screen.getByLabelText(/budget range/i), validPerformanceData.budgetRange);
      await user.type(screen.getByLabelText(/duration/i), validPerformanceData.duration);

      // Submit form
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/contact'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining(validPerformanceData.name)
          })
        );
      });
    });
  });

  describe('Collaboration Form Validation', () => {
    it('validates collaboration-specific fields', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <CollaborationInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Submit without required fields
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/project type is required/i)).toBeInTheDocument();
        expect(screen.getByText(/creative vision is required/i)).toBeInTheDocument();
      });
    });

    it('validates creative vision minimum length', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <CollaborationInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      const visionTextarea = screen.getByLabelText(/creative vision/i);
      
      // Test minimum length validation
      await user.type(visionTextarea, 'Short');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/please provide more details about your creative vision/i)).toBeInTheDocument();
      });

      // Test valid length
      await user.clear(visionTextarea);
      await user.type(visionTextarea, validCollaborationData.creativeVision);
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/please provide more details about your creative vision/i)).not.toBeInTheDocument();
      });
    });

    it('handles file upload validation', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <CollaborationInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      const fileInput = screen.getByLabelText(/portfolio files/i);
      
      // Test file size validation (if implemented)
      const largeFile = new File(['a'.repeat(10 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
      
      await user.upload(fileInput, largeFile);

      // Note: File size validation would be implementation-specific
      // This tests the file input functionality
      expect(fileInput.files).toHaveLength(1);
    });
  });

  describe('Context-Aware Validation Rules', () => {
    it('applies different validation rules based on service context', () => {
      const teachingRules = getServiceValidationRules('teaching', {});
      const performanceRules = getServiceValidationRules('performance', {});
      const collaborationRules = getServiceValidationRules('collaboration', {});

      // Teaching should require experience and goals
      expect(teachingRules.experienceLevel?.required).toBe(true);
      expect(teachingRules.musicalGoals?.required).toBe(true);

      // Performance should require event type and format
      expect(performanceRules.eventType?.required).toBe(true);
      expect(performanceRules.performanceFormat?.required).toBe(true);

      // Collaboration should require project type and vision
      expect(collaborationRules.projectType?.required).toBe(true);
      expect(collaborationRules.creativeVision?.required).toBe(true);
    });

    it('validates fields with service-specific patterns', () => {
      // Test teaching-specific validation
      const teachingEmailResult = validateField('email', 'student@school.edu', 'teaching', {});
      expect(teachingEmailResult.isValid).toBe(true);

      // Test performance-specific validation
      const performanceBudgetResult = validateField('budgetRange', 'under-500', 'performance', {});
      expect(performanceBudgetResult.isValid).toBe(true);

      // Test collaboration-specific validation
      const collaborationProjectResult = validateField('projectType', 'studio', 'collaboration', {});
      expect(collaborationProjectResult.isValid).toBe(true);
    });
  });

  describe('Cross-Form Validation Consistency', () => {
    it('applies consistent email validation across all forms', () => {
      const validEmail = 'test@example.com';
      const invalidEmail = 'invalid-email';

      // Test across all service types
      const serviceTypes: Array<'teaching' | 'performance' | 'collaboration'> = ['teaching', 'performance', 'collaboration'];
      
      serviceTypes.forEach(serviceType => {
        const validResult = validateField('email', validEmail, serviceType, {});
        const invalidResult = validateField('email', invalidEmail, serviceType, {});

        expect(validResult.isValid).toBe(true);
        expect(invalidResult.isValid).toBe(false);
        expect(invalidResult.message).toMatch(/valid email/i);
      });
    });

    it('applies consistent phone validation across all forms', () => {
      const validPhone = '+1 (555) 123-4567';
      const invalidPhone = '123';

      const serviceTypes: Array<'teaching' | 'performance' | 'collaboration'> = ['teaching', 'performance', 'collaboration'];
      
      serviceTypes.forEach(serviceType => {
        const validResult = validateField('phone', validPhone, serviceType, {});
        const invalidResult = validateField('phone', invalidPhone, serviceType, {});

        expect(validResult.isValid).toBe(true);
        expect(invalidResult.isValid).toBe(false);
      });
    });

    it('applies consistent name validation across all forms', () => {
      const validName = 'John Doe';
      const invalidName = '';

      const serviceTypes: Array<'teaching' | 'performance' | 'collaboration'> = ['teaching', 'performance', 'collaboration'];
      
      serviceTypes.forEach(serviceType => {
        const validResult = validateField('name', validName, serviceType, {});
        const invalidResult = validateField('name', invalidName, serviceType, {});

        expect(validResult.isValid).toBe(true);
        expect(invalidResult.isValid).toBe(false);
        expect(invalidResult.message).toMatch(/required/i);
      });
    });
  });

  describe('Error Handling and Recovery', () => {
    it('handles network errors during form submission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      // Mock network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      await user.selectOptions(screen.getByLabelText(/experience level/i), validTeachingData.experienceLevel);
      await user.type(screen.getByLabelText(/musical goals/i), validTeachingData.musicalGoals);
      
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/error submitting form/i)).toBeInTheDocument();
      });
    });

    it('handles server errors during form submission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      // Mock server error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' })
      } as Response);

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      await user.selectOptions(screen.getByLabelText(/experience level/i), validTeachingData.experienceLevel);
      await user.type(screen.getByLabelText(/musical goals/i), validTeachingData.musicalGoals);
      
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/please try again/i)).toBeInTheDocument();
      });
    });

    it('allows form retry after error', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      // First call fails, second succeeds
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        } as Response);

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Fill form
      await user.type(screen.getByLabelText(/name/i), validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      await user.selectOptions(screen.getByLabelText(/experience level/i), validTeachingData.experienceLevel);
      await user.type(screen.getByLabelText(/musical goals/i), validTeachingData.musicalGoals);
      
      // First submission (fails)
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/error submitting form/i)).toBeInTheDocument();
      });

      // Retry submission (succeeds)
      await user.click(screen.getByRole('button', { name: /try again|submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Load Testing', () => {
    it('handles rapid successive validation calls efficiently', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      const emailInput = screen.getByLabelText(/email/i);

      // Simulate rapid typing
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        await user.type(emailInput, 'a');
        await act(() => new Promise(resolve => setTimeout(resolve, 10)));
      }

      const endTime = performance.now();
      
      // Validation should complete within reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('maintains performance with large form data', async () => {
      const largeFormData = {
        name: 'Test User',
        email: 'test@example.com',
        musicalGoals: 'a'.repeat(1000), // Large text field
        additionalInfo: 'b'.repeat(1000) // Another large field
      };

      const startTime = performance.now();
      
      const result = validateForm(largeFormData, 'teaching', {});
      
      const endTime = performance.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(100); // Should validate quickly
    });
  });

  describe('Accessibility Validation', () => {
    it('provides accessible error messages with proper ARIA attributes', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Submit form to trigger validation errors
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        const errorMessages = screen.getAllByRole('alert');
        expect(errorMessages.length).toBeGreaterThan(0);

        errorMessages.forEach(error => {
          expect(error).toHaveAttribute('id');
          expect(error).toHaveAttribute('aria-describedby');
        });
      });
    });

    it('associates error messages with form fields using aria-describedby', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      const emailInput = screen.getByLabelText(/email/i);
      
      // Trigger validation error
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        const errorMessage = screen.getByText(/please enter a valid email address/i);
        const errorId = errorMessage.getAttribute('id');
        
        expect(emailInput).toHaveAttribute('aria-describedby', errorId);
      });
    });
  });
});