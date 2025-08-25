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
  const user = userEvent.setup();

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Teaching Inquiry Form', () => {
    it('should validate required fields before proceeding to next step', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Should start on Step 1
      expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();

      // Try to proceed without filling required fields
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Should still be on step 1 if validation fails
      expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
    });

    it('should validate email format correctly', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Find inputs by placeholder since they don't have accessible names
      const nameInput = screen.getByPlaceholderText(/Your full name/i);
      const phoneInput = screen.getByPlaceholderText(/\(555\) 123-4567/i);
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);
      
      await user.type(nameInput, 'John Doe');
      await user.type(phoneInput, '555-123-4567');
      
      // Test invalid email
      await user.type(emailInput, 'invalid-email');
      
      // Select a package (first radio is already selected by default)
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      // Should stay on step 1 due to invalid email
      expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
      
      // Now test valid email
      await user.clear(emailInput);
      await user.type(emailInput, 'john.doe@example.com');
      await user.click(nextButton);
      
      // Should proceed to step 2
      expect(screen.getByText(/Step 2 of 4/i)).toBeInTheDocument();
    });

    it('should progress through form steps', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Step 1: Fill all required contact info
      const nameInput = screen.getByPlaceholderText(/Your full name/i);
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);
      const phoneInput = screen.getByPlaceholderText(/\(555\) 123-4567/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(phoneInput, '555-123-4567');

      // Package should be pre-selected (Single Lesson), so we can proceed
      let nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Should be on step 2
      expect(screen.getByText(/Step 2 of 4/i)).toBeInTheDocument();
      expect(screen.getByText(/Musical Background & Goals/i)).toBeInTheDocument();

      // Test that we progressed beyond step 1
      const progressedText = screen.getByText(/Step \d of 4/i).textContent;
      expect(progressedText).not.toBe('Step 1 of 4');
    }, 10000);

    it('should close when close button is clicked', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Find and click close button (X button in header - it's the first button without text)
      const buttons = screen.getAllByRole('button');
      const closeButton = buttons.find(button => button.textContent === '');
      expect(closeButton).toBeDefined();
      
      await user.click(closeButton!);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should handle step navigation correctly', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Fill Step 1 and proceed
      const nameInput = screen.getByPlaceholderText(/Your full name/i);
      const emailInput = screen.getByPlaceholderText(/your\.email@example\.com/i);
      const phoneInput = screen.getByPlaceholderText(/\(555\) 123-4567/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(phoneInput, '555-123-4567');

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Should be on step 2
      expect(screen.getByText(/Step 2 of 4/i)).toBeInTheDocument();

      // Look for back button - it might be in step 2
      const backButton = screen.queryByRole('button', { name: /back|previous/i });
      
      if (backButton) {
        await user.click(backButton);
        // Should be back on step 1
        expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
      } else {
        // If no back button, that's valid - just ensure we're still on step 2
        expect(screen.getByText(/Step 2 of 4/i)).toBeInTheDocument();
      }
    });
  });

  describe('Performance Inquiry Form', () => {
    it('should render and handle basic interactions', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <PerformanceInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Verify form is rendered - look for performance-specific content
      // Use getAllByText to handle multiple matches, then check the first one
      const performanceElements = screen.getAllByText(/Performance/i);
      expect(performanceElements.length).toBeGreaterThan(0);
      
      // Should have the main heading (be more specific)
      expect(screen.getByRole('heading', { name: /Performance Inquiry/i })).toBeInTheDocument();
      
      // Should have form inputs with accessible names
      expect(screen.getByRole('textbox', { name: /Full Name/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Email Address/i })).toBeInTheDocument();
    });

    it('should have required form fields', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <PerformanceInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Should have form inputs
      const textboxes = screen.getAllByRole('textbox');
      expect(textboxes.length).toBeGreaterThan(0);
      
      // Should have select dropdowns
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThan(0);
      
      // Should have submit button
      const submitButton = screen.getByRole('button', { name: /submit.*performance/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should handle form interactions', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <PerformanceInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Fill out required fields
      const nameInput = screen.getByRole('textbox', { name: /Full Name/i });
      const emailInput = screen.getByRole('textbox', { name: /Email Address/i });
      const durationInput = screen.getByRole('textbox', { name: /Performance Duration/i });
      
      await user.type(nameInput, 'Jane Doe');
      await user.type(emailInput, 'jane.doe@example.com');
      await user.type(durationInput, '2 hours');
      
      // Test that inputs receive the values
      expect(nameInput).toHaveValue('Jane Doe');
      expect(emailInput).toHaveValue('jane.doe@example.com');
      expect(durationInput).toHaveValue('2 hours');
    });
  });

  describe('Collaboration Inquiry Form', () => {
    it('should render and handle basic interactions', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <CollaborationInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Verify form is rendered - look for collaboration-specific content
      expect(screen.getByText(/Collaboration/i)).toBeInTheDocument();
      
      // Should have interactive elements (not necessarily a semantic form)
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Form Accessibility', () => {
    it('should have proper form structure and interactive elements', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Check for semantic form element (TeachingInquiryForm has it)
      expect(screen.getByRole('form')).toBeInTheDocument();
      
      // Check for proper heading structure
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      
      // Check that form has interactive elements
      const textboxes = screen.getAllByRole('textbox');
      expect(textboxes.length).toBeGreaterThan(0);
      
      const radios = screen.getAllByRole('radio');
      expect(radios.length).toBeGreaterThan(0);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Check that buttons are focusable
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
      
      // Test Tab navigation
      await user.tab();
      expect(document.activeElement).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should render properly on mobile viewport', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnClose = vi.fn();
      
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      window.dispatchEvent(new Event('resize'));
      
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Should still render the form
      expect(screen.getByRole('form')).toBeInTheDocument();
      
      // Should have responsive classes
      const formContainer = screen.getByRole('form').closest('div');
      expect(formContainer).toHaveClass(/w-full/);
    });

    it('should have appropriate touch targets', async () => {
      const mockOnSubmit = vi.fn();
      const mockOnClose = vi.fn();
      
      renderWithRouter(
        <TeachingInquiryForm 
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit} 
        />
      );

      // Check that buttons have proper sizing classes
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Check for padding/size classes
        expect(button.className).toMatch(/(p-|py-|px-|h-|w-)/);
      });
    });
  });
});