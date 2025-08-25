import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Import form components
import { TeachingInquiryForm } from '@/components/contact/TeachingInquiryForm';
import { PerformanceInquiryForm } from '@/components/contact/PerformanceInquiryForm';
import { CollaborationInquiryForm } from '@/components/contact/CollaborationInquiryForm';

// Mock required dependencies
vi.mock('@/hooks/useContent', () => ({
  useContent: () => ({
    teaching: {
      title: 'Guitar Lessons',
      description: 'Professional guitar instruction'
    },
    performance: {
      title: 'Live Performances',
      description: 'Professional live music'
    },
    collaboration: {
      title: 'Music Collaboration',
      description: 'Recording and production'
    }
  })
}));

// Test wrapper with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Contact Forms - Business Logic Testing', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  describe('Teaching Inquiry Form', () => {
    it('should render teaching form with required elements', () => {
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      expect(screen.getByText('Guitar Lesson Inquiry')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Your full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your\.email@example\.com/i)).toBeInTheDocument();
    });

    it('should handle form input correctly', async () => {
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      const nameInput = screen.getByPlaceholderText(/Your full name/i);
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
    });

    it('should navigate through form steps', async () => {
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Fill required fields
      const nameInput = screen.getByPlaceholderText(/Your full name/i);
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      // Select a package
      const singleLessonRadio = screen.getByLabelText(/Single Lesson/);
      await user.click(singleLessonRadio);

      // Click next
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      // Should show next step
      await waitFor(() => {
        expect(screen.getByText(/Additional Information/i)).toBeInTheDocument();
      });
    });

    it('should validate required fields', async () => {
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Try to proceed without filling required fields
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance Inquiry Form', () => {
    it('should render performance form with required elements', () => {
      renderWithRouter(
        <PerformanceInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      expect(screen.getByText('Performance Inquiry')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Your full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your\.email@example\.com/i)).toBeInTheDocument();
    });

    it('should handle event date selection', async () => {
      renderWithRouter(
        <PerformanceInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Get date input
      const dateInput = screen.getByLabelText(/Event Date/i) || screen.getByDisplayValue('');
      
      if (dateInput) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const dateString = futureDate.toISOString().split('T')[0];

        fireEvent.change(dateInput, { target: { value: dateString } });
        expect(dateInput).toHaveValue(dateString);
      }
    });

    it('should validate future event dates', async () => {
      renderWithRouter(
        <PerformanceInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Fill required fields
      const nameInput = screen.getByPlaceholderText(/Your full name/i);
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      // Set past date
      const dateInput = screen.getByLabelText(/Event Date/i) || screen.getByDisplayValue('');
      
      if (dateInput) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        const dateString = pastDate.toISOString().split('T')[0];

        fireEvent.change(dateInput, { target: { value: dateString } });

        // Try to submit
        const submitButton = screen.getByText('Submit') || screen.getByText('Send Inquiry');
        await user.click(submitButton);

        // Should show validation error
        await waitFor(() => {
          expect(screen.getByText(/Event date must be in the future/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Collaboration Inquiry Form', () => {
    it('should render collaboration form with required elements', () => {
      renderWithRouter(
        <CollaborationInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      expect(screen.getByText('Collaboration Inquiry')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Your full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your\.email@example\.com/i)).toBeInTheDocument();
    });

    it('should handle project description input', async () => {
      renderWithRouter(
        <CollaborationInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      const projectInput = screen.getByPlaceholderText(/Describe your project/i) ||
                          screen.getByPlaceholderText(/Tell me about your project/i) ||
                          screen.getByLabelText(/Project Description/i);

      if (projectInput) {
        await user.type(projectInput, 'Looking for guitar work on indie rock album');
        expect(projectInput).toHaveValue('Looking for guitar work on indie rock album');
      }
    });
  });

  describe('Form Accessibility', () => {
    it('should have proper form structure and interactive elements', () => {
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Check for form element (using querySelector instead of getByRole)
      const formElement = document.querySelector('form');
      expect(formElement).toBeInTheDocument();
      
      // Check for input elements
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);

      // Check for buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', async () => {
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      const nameInput = screen.getByPlaceholderText(/Your full name/i);
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);

      // Tab navigation
      await user.tab();
      expect(nameInput).toHaveFocus();

      await user.tab();
      expect(emailInput).toHaveFocus();
    });

    it('should handle form submission', async () => {
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Fill form completely
      const nameInput = screen.getByPlaceholderText(/Your full name/i);
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      // Select package
      const singleLessonRadio = screen.getByLabelText(/Single Lesson/);
      await user.click(singleLessonRadio);

      // Navigate to next step
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      // Complete form on second step
      await waitFor(() => {
        const submitButton = screen.getByText('Submit') || screen.getByText('Send Inquiry');
        return user.click(submitButton);
      });

      // Should call onSubmit
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', async () => {
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      const nameInput = screen.getByPlaceholderText(/Your full name/i);
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'invalid-email');

      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should validate phone format when provided', async () => {
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      const nameInput = screen.getByPlaceholderText(/Your full name/i);
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);
      const phoneInput = screen.getByPlaceholderText(/\(555\) 123-4567/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(phoneInput, '123'); // Invalid phone

      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid phone number/i)).toBeInTheDocument();
      });
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should render properly on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      const formContainer = document.querySelector('form');
      expect(formContainer).toBeInTheDocument();
    });

    it('should have appropriate touch targets', () => {
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass(/p-|py-|px-|h-|w-/); // Touch-friendly sizing classes
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle submission errors gracefully', async () => {
      // Mock onSubmit to throw an error
      const mockOnSubmitError = vi.fn().mockRejectedValue(new Error('Submission failed'));

      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmitError} 
        />
      );

      // Fill and submit form
      const nameInput = screen.getByPlaceholderText(/Your full name/i);
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      const singleLessonRadio = screen.getByLabelText(/Single Lesson/);
      await user.click(singleLessonRadio);

      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      await waitFor(() => {
        const submitButton = screen.getByText('Submit') || screen.getByText('Send Inquiry');
        return user.click(submitButton);
      });

      // Should handle error without crashing
      expect(mockOnSubmitError).toHaveBeenCalled();
    });

    it('should handle form close correctly', async () => {
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});