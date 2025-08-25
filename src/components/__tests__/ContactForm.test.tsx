import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Import the components we'll test
import { TeachingInquiryForm } from '@/components/forms/TeachingInquiryForm';
import { PerformanceInquiryForm } from '@/components/forms/PerformanceInquiryForm';
import { CollaborationInquiryForm } from '@/components/forms/CollaborationInquiryForm';

// Test wrapper with Router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Contact Forms - Business Logic Testing', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Teaching Inquiry Form', () => {
    it('should validate required fields before submission', async () => {
      const mockOnSubmit = vi.fn();
      renderWithRouter(<TeachingInquiryForm onSubmit={mockOnSubmit} />);

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /submit|send|contact/i });
      await user.click(submitButton);

      // Should not call onSubmit if validation fails
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate email format correctly', async () => {
      const mockOnSubmit = vi.fn();
      renderWithRouter(<TeachingInquiryForm onSubmit={mockOnSubmit} />);

      // Find email input
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      
      // Test invalid email
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur event for validation

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it('should accept valid form data and call onSubmit', async () => {
      const mockOnSubmit = vi.fn();
      renderWithRouter(<TeachingInquiryForm onSubmit={mockOnSubmit} />);

      // Fill required fields
      const nameInput = screen.getByRole('textbox', { name: /name/i });
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit|send|contact/i });
      await user.click(submitButton);

      // Should call onSubmit with form data
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          // ... other expected fields
        });
      });
    });

    it('should handle package selection correctly', async () => {
      renderWithRouter(<TeachingInquiryForm />);

      // Find package options
      const packageOptions = screen.getAllByRole('radio');
      expect(packageOptions.length).toBeGreaterThan(0);

      // Select a package
      const firstPackage = packageOptions[0];
      await user.click(firstPackage);

      // Should be selected
      expect(firstPackage).toBeChecked();
    });
  });

  describe('Performance Inquiry Form', () => {
    it('should validate event details for performance inquiries', async () => {
      renderWithRouter(<PerformanceInquiryForm />);

      // Event-specific fields should be present
      expect(screen.getByText(/event/i)).toBeInTheDocument();
      expect(screen.getByText(/date/i)).toBeInTheDocument();
    });

    it('should handle event type selection', async () => {
      renderWithRouter(<PerformanceInquiryForm />);

      // Should have event type options
      const eventTypeSelect = screen.getByRole('combobox', { name: /event.*type/i });
      expect(eventTypeSelect).toBeInTheDocument();
    });
  });

  describe('Collaboration Inquiry Form', () => {
    it('should handle collaboration service selection', async () => {
      renderWithRouter(<CollaborationInquiryForm />);

      // Should have service options
      const serviceCheckboxes = screen.getAllByRole('checkbox');
      expect(serviceCheckboxes.length).toBeGreaterThan(0);
    });

    it('should validate project timeline requirements', async () => {
      renderWithRouter(<CollaborationInquiryForm />);

      // Should have timeline selection
      expect(screen.getByText(/timeline/i)).toBeInTheDocument();
    });
  });

  describe('Cross-Form Behavior', () => {
    it('should maintain consistent validation patterns', async () => {
      const forms = [
        <TeachingInquiryForm key="teaching" />,
        <PerformanceInquiryForm key="performance" />,
        <CollaborationInquiryForm key="collaboration" />
      ];

      for (const form of forms) {
        renderWithRouter(form);
        
        // All forms should have email validation
        const emailInput = screen.getByRole('textbox', { name: /email/i });
        await user.type(emailInput, 'invalid');
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/valid email/i)).toBeInTheDocument();
        });

        // Clean up for next iteration
        screen.getByTestId('root')?.remove?.();
      }
    });

    it('should handle form submission states consistently', () => {
      const forms = [
        <TeachingInquiryForm key="teaching" />,
        <PerformanceInquiryForm key="performance" />,
        <CollaborationInquiryForm key="collaboration" />
      ];

      forms.forEach(form => {
        renderWithRouter(form);
        
        // Should have a submit button
        const submitButton = screen.getByRole('button', { name: /submit|send|contact/i });
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
      renderWithRouter(<TeachingInquiryForm onSubmit={mockOnSubmit} />);

      // Fill and submit form
      const nameInput = screen.getByRole('textbox', { name: /name/i });
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      const submitButton = screen.getByRole('button', { name: /submit|send|contact/i });
      await user.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/error|failed|try again/i)).toBeInTheDocument();
      });
    });

    it('should handle validation errors appropriately', async () => {
      renderWithRouter(<TeachingInquiryForm />);

      // Try submitting empty form
      const submitButton = screen.getByRole('button', { name: /submit|send|contact/i });
      await user.click(submitButton);

      // Should show required field errors
      await waitFor(() => {
        const errorMessages = screen.getAllByText(/required|field.*required/i);
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility Testing', () => {
    it('should have proper form labels and ARIA attributes', () => {
      renderWithRouter(<TeachingInquiryForm />);

      // All form inputs should have labels
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });

      // Form should have proper structure
      const form = screen.getByRole('form') || screen.getByTestId('form');
      expect(form).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      renderWithRouter(<TeachingInquiryForm />);

      const inputs = screen.getAllByRole('textbox');
      
      // Tab through form elements
      for (let i = 0; i < inputs.length; i++) {
        await user.tab();
        expect(document.activeElement).toBe(inputs[i]);
      }
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should render appropriately on mobile viewports', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithRouter(<TeachingInquiryForm />);

      // Form should still be functional
      expect(screen.getByRole('form') || screen.getByTestId('form')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    });
  });
});