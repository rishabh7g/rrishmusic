/**
 * User Journey Integration Tests
 * 
 * End-to-end user journey tests across different service paths.
 * Tests complete user flows from landing to form submission and beyond.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Page components
import App from '@/App';

// Test data
import { 
  validTeachingData,
  validPerformanceData,
  validCollaborationData
} from '@/test/mocks/formData';

// Mock services
global.fetch = vi.fn();
const mockFetch = vi.mocked(fetch);

// Mock IntersectionObserver for animations
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: []
}));

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

// Helper function to render app with routing
const renderAppWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('User Journey Integration Tests', () => {
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

  describe('Teaching Service Journey', () => {
    it('completes full teaching inquiry journey from homepage', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/']);

      // 1. User lands on homepage
      await waitFor(() => {
        expect(screen.getByText(/guitar lessons/i)).toBeInTheDocument();
      });

      // 2. User clicks on teaching/lessons CTA
      const teachingCTA = screen.getByRole('button', { name: /start learning|book lesson/i });
      await user.click(teachingCTA);

      // 3. User navigates to teaching page or modal opens
      await waitFor(() => {
        expect(screen.getByText(/teaching/i) || screen.getByText(/lessons/i)).toBeInTheDocument();
      });

      // 4. User reviews teaching information
      expect(screen.getByText(/\$50/)).toBeInTheDocument(); // Price display

      // 5. User clicks inquiry CTA
      const inquiryCTA = screen.getByRole('button', { name: /get started|inquiry/i });
      await user.click(inquiryCTA);

      // 6. Form opens
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      });

      // 7. User fills form
      await user.type(screen.getByLabelText(/name/i), validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      await user.selectOptions(screen.getByLabelText(/experience level/i), validTeachingData.experienceLevel);
      await user.type(screen.getByLabelText(/musical goals/i), validTeachingData.musicalGoals);
      await user.selectOptions(screen.getByLabelText(/package type/i), validTeachingData.packageType);

      // 8. User submits form
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // 9. Success confirmation
      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
        expect(mockFetch).toHaveBeenCalled();
      });

      // 10. Verify correct service context in API call
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const payload = JSON.parse(lastCall[1]?.body as string);
      expect(payload.serviceType).toBe('teaching');
    });

    it('handles teaching journey from direct service page visit', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/teaching']);

      // User lands directly on teaching page
      await waitFor(() => {
        expect(screen.getByText(/guitar lessons/i)).toBeInTheDocument();
        expect(screen.getByText(/\$50/)).toBeInTheDocument();
      });

      // Follow similar steps from CTA click onwards...
      const inquiryCTA = screen.getByRole('button', { name: /get started|inquiry/i });
      await user.click(inquiryCTA);

      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      });

      // Complete form submission
      await user.type(screen.getByLabelText(/name/i), validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      await user.selectOptions(screen.getByLabelText(/experience level/i), validTeachingData.experienceLevel);
      await user.type(screen.getByLabelText(/musical goals/i), validTeachingData.musicalGoals);
      
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    });

    it('tracks user engagement throughout teaching journey', async () => {
      const user = userEvent.setup();
      const mockAnalytics = vi.fn();
      (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag = mockAnalytics;

      renderAppWithRouter(['/']);

      // Track page view
      await waitFor(() => {
        expect(mockAnalytics).toHaveBeenCalledWith('config', expect.any(String), {
          page_title: expect.any(String),
          page_location: expect.any(String)
        });
      });

      // Track CTA click
      const teachingCTA = screen.getByRole('button', { name: /start learning|book lesson/i });
      await user.click(teachingCTA);

      await waitFor(() => {
        expect(mockAnalytics).toHaveBeenCalledWith('event', 'cta_click', {
          service_type: 'teaching',
          cta_location: 'homepage',
          cta_text: expect.any(String)
        });
      });
    });

    it('handles teaching journey with form abandonment and recovery', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/teaching']);

      const inquiryCTA = screen.getByRole('button', { name: /get started|inquiry/i });
      await user.click(inquiryCTA);

      // Start filling form
      await user.type(screen.getByLabelText(/name/i), 'John');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');

      // Simulate form abandonment (close form)
      const closeButton = screen.getByRole('button', { name: /close|cancel/i });
      await user.click(closeButton);

      // Form should close
      await waitFor(() => {
        expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
      });

      // User returns and opens form again
      await user.click(inquiryCTA);

      // Form should be empty (or optionally pre-filled if using localStorage)
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      });

      // Complete form properly this time
      await user.type(screen.getByLabelText(/name/i), validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      await user.selectOptions(screen.getByLabelText(/experience level/i), validTeachingData.experienceLevel);
      await user.type(screen.getByLabelText(/musical goals/i), validTeachingData.musicalGoals);
      
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance Service Journey', () => {
    it('completes full performance inquiry journey', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/']);

      // Navigate to performance service
      const performanceCTA = screen.getByRole('button', { name: /book performance|hire/i });
      await user.click(performanceCTA);

      await waitFor(() => {
        expect(screen.getByText(/performance/i)).toBeInTheDocument();
        expect(screen.getByText(/events/i) || screen.getByText(/wedding/i)).toBeInTheDocument();
      });

      // Open inquiry form
      const inquiryCTA = screen.getByRole('button', { name: /get quote|inquiry/i });
      await user.click(inquiryCTA);

      // Fill performance-specific form
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/event type/i)).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/name/i), validPerformanceData.name);
      await user.type(screen.getByLabelText(/email/i), validPerformanceData.email);
      await user.selectOptions(screen.getByLabelText(/event type/i), validPerformanceData.eventType);
      await user.selectOptions(screen.getByLabelText(/performance format/i), validPerformanceData.performanceFormat);
      await user.selectOptions(screen.getByLabelText(/budget range/i), validPerformanceData.budgetRange);
      await user.type(screen.getByLabelText(/duration/i), validPerformanceData.duration);

      // Submit form
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });

      // Verify performance context
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const payload = JSON.parse(lastCall[1]?.body as string);
      expect(payload.serviceType).toBe('performance');
    });

    it('handles performance journey with event details', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/performance']);

      const inquiryCTA = screen.getByRole('button', { name: /get quote|inquiry/i });
      await user.click(inquiryCTA);

      // Fill form with detailed event information
      await user.type(screen.getByLabelText(/name/i), validPerformanceData.name);
      await user.type(screen.getByLabelText(/email/i), validPerformanceData.email);
      await user.selectOptions(screen.getByLabelText(/event type/i), 'wedding');
      
      // Fill event date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);
      const eventDate = futureDate.toISOString().split('T')[0];
      await user.type(screen.getByLabelText(/event date/i), eventDate);

      // Fill venue information
      await user.type(screen.getByLabelText(/venue name/i), 'Grand Ballroom');
      await user.type(screen.getByLabelText(/venue address/i), '123 Main St');
      
      await user.selectOptions(screen.getByLabelText(/performance format/i), validPerformanceData.performanceFormat);
      await user.selectOptions(screen.getByLabelText(/budget range/i), '1000-2000');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });

      // Verify detailed event data was captured
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const payload = JSON.parse(lastCall[1]?.body as string);
      expect(payload.eventType).toBe('wedding');
      expect(payload.venueName).toBe('Grand Ballroom');
    });
  });

  describe('Collaboration Service Journey', () => {
    it('completes full collaboration inquiry journey', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/']);

      // Navigate to collaboration
      const collaborationCTA = screen.getByRole('button', { name: /collaborate|partnership/i });
      await user.click(collaborationCTA);

      await waitFor(() => {
        expect(screen.getByText(/collaboration/i)).toBeInTheDocument();
      });

      // Open inquiry form
      const inquiryCTA = screen.getByRole('button', { name: /start project|inquiry/i });
      await user.click(inquiryCTA);

      // Fill collaboration form
      await user.type(screen.getByLabelText(/name/i), validCollaborationData.name);
      await user.type(screen.getByLabelText(/email/i), validCollaborationData.email);
      await user.selectOptions(screen.getByLabelText(/project type/i), validCollaborationData.projectType);
      await user.type(screen.getByLabelText(/creative vision/i), validCollaborationData.creativeVision);
      await user.selectOptions(screen.getByLabelText(/timeline/i), validCollaborationData.timeline);
      await user.selectOptions(screen.getByLabelText(/project scope/i), validCollaborationData.projectScope);
      await user.selectOptions(screen.getByLabelText(/budget range/i), validCollaborationData.budgetRange);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });

      // Verify collaboration context
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const payload = JSON.parse(lastCall[1]?.body as string);
      expect(payload.serviceType).toBe('collaboration');
    });

    it('handles collaboration journey with file upload', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/collaboration']);

      const inquiryCTA = screen.getByRole('button', { name: /start project|inquiry/i });
      await user.click(inquiryCTA);

      // Fill basic form
      await user.type(screen.getByLabelText(/name/i), validCollaborationData.name);
      await user.type(screen.getByLabelText(/email/i), validCollaborationData.email);
      await user.selectOptions(screen.getByLabelText(/project type/i), 'studio');
      await user.type(screen.getByLabelText(/creative vision/i), validCollaborationData.creativeVision);

      // Handle file upload
      const fileInput = screen.getByLabelText(/portfolio files/i);
      const testFile = new File(['test audio content'], 'demo.mp3', { type: 'audio/mpeg' });
      await user.upload(fileInput, testFile);

      await user.selectOptions(screen.getByLabelText(/timeline/i), validCollaborationData.timeline);
      await user.selectOptions(screen.getByLabelText(/project scope/i), validCollaborationData.projectScope);
      await user.selectOptions(screen.getByLabelText(/budget range/i), validCollaborationData.budgetRange);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });

      // Verify FormData was used for file upload
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      expect(lastCall[1]?.body).toBeInstanceOf(FormData);
    });
  });

  describe('Cross-Service User Journeys', () => {
    it('handles user exploring multiple services before inquiring', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/']);

      // User explores teaching first
      const teachingNav = screen.getByRole('link', { name: /teaching|lessons/i });
      await user.click(teachingNav);

      await waitFor(() => {
        expect(screen.getByText(/guitar lessons/i)).toBeInTheDocument();
      });

      // User then explores performance
      const performanceNav = screen.getByRole('link', { name: /performance/i });
      await user.click(performanceNav);

      await waitFor(() => {
        expect(screen.getByText(/events/i) || screen.getByText(/wedding/i)).toBeInTheDocument();
      });

      // User decides on performance service
      const inquiryCTA = screen.getByRole('button', { name: /get quote|inquiry/i });
      await user.click(inquiryCTA);

      // Complete performance inquiry
      await user.type(screen.getByLabelText(/name/i), validPerformanceData.name);
      await user.type(screen.getByLabelText(/email/i), validPerformanceData.email);
      await user.selectOptions(screen.getByLabelText(/event type/i), validPerformanceData.eventType);
      await user.selectOptions(screen.getByLabelText(/performance format/i), validPerformanceData.performanceFormat);
      await user.selectOptions(screen.getByLabelText(/budget range/i), validPerformanceData.budgetRange);
      await user.type(screen.getByLabelText(/duration/i), validPerformanceData.duration);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });

      // Verify final service selection was tracked
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const payload = JSON.parse(lastCall[1]?.body as string);
      expect(payload.serviceType).toBe('performance');
    });

    it('suggests cross-service opportunities during inquiry', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/teaching']);

      // User submits teaching inquiry
      const inquiryCTA = screen.getByRole('button', { name: /get started|inquiry/i });
      await user.click(inquiryCTA);

      await user.type(screen.getByLabelText(/name/i), validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      await user.selectOptions(screen.getByLabelText(/experience level/i), 'advanced');
      await user.type(screen.getByLabelText(/musical goals/i), 'Want to perform at events');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });

      // Check for cross-service suggestion
      await waitFor(() => {
        expect(screen.getByText(/performance opportunities/i) || 
               screen.getByText(/book a performance/i)).toBeInTheDocument();
      });
    });

    it('handles user switching between services during form completion', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/teaching']);

      // Start teaching inquiry
      const teachingInquiryCTA = screen.getByRole('button', { name: /get started|inquiry/i });
      await user.click(teachingInquiryCTA);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');

      // User realizes they want performance instead
      const closeButton = screen.getByRole('button', { name: /close|cancel/i });
      await user.click(closeButton);

      // Navigate to performance
      const performanceNav = screen.getByRole('link', { name: /performance/i });
      await user.click(performanceNav);

      await waitFor(() => {
        expect(screen.getByText(/events/i) || screen.getByText(/wedding/i)).toBeInTheDocument();
      });

      // Complete performance inquiry
      const performanceInquiryCTA = screen.getByRole('button', { name: /get quote|inquiry/i });
      await user.click(performanceInquiryCTA);

      // Form should be fresh (or pre-filled with basic info if using localStorage)
      await user.type(screen.getByLabelText(/name/i), validPerformanceData.name);
      await user.type(screen.getByLabelText(/email/i), validPerformanceData.email);
      await user.selectOptions(screen.getByLabelText(/event type/i), validPerformanceData.eventType);
      await user.selectOptions(screen.getByLabelText(/performance format/i), validPerformanceData.performanceFormat);
      await user.selectOptions(screen.getByLabelText(/budget range/i), validPerformanceData.budgetRange);
      await user.type(screen.getByLabelText(/duration/i), validPerformanceData.duration);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });

      // Verify correct final service type
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const payload = JSON.parse(lastCall[1]?.body as string);
      expect(payload.serviceType).toBe('performance');
    });
  });

  describe('Error Recovery Journeys', () => {
    it('handles network error during submission with user recovery', async () => {
      const user = userEvent.setup();

      // First submission fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      renderAppWithRouter(['/teaching']);

      const inquiryCTA = screen.getByRole('button', { name: /get started|inquiry/i });
      await user.click(inquiryCTA);

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      await user.selectOptions(screen.getByLabelText(/experience level/i), validTeachingData.experienceLevel);
      await user.type(screen.getByLabelText(/musical goals/i), validTeachingData.musicalGoals);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Error message appears
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });

      // Mock successful retry
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      } as Response);

      // User retries
      const retryButton = screen.getByRole('button', { name: /try again|retry/i });
      await user.click(retryButton);

      // Success message appears
      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    });

    it('preserves form data during error recovery', async () => {
      const user = userEvent.setup();

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      renderAppWithRouter(['/performance']);

      const inquiryCTA = screen.getByRole('button', { name: /get quote|inquiry/i });
      await user.click(inquiryCTA);

      // Fill complex form
      await user.type(screen.getByLabelText(/name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.selectOptions(screen.getByLabelText(/event type/i), 'wedding');
      await user.selectOptions(screen.getByLabelText(/performance format/i), 'band');
      await user.type(screen.getByLabelText(/venue name/i), 'City Hall');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Error occurs
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      // Verify form data is preserved
      expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
      expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('City Hall')).toBeInTheDocument();

      // Mock success for retry
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      } as Response);

      const retryButton = screen.getByRole('button', { name: /try again|retry/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    });
  });

  describe('Mobile User Journey Experience', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });
    });

    it('completes mobile teaching journey with touch interactions', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/']);

      // Mobile navigation
      const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(mobileMenuButton);

      const teachingLink = screen.getByRole('link', { name: /teaching/i });
      await user.click(teachingLink);

      await waitFor(() => {
        expect(screen.getByText(/guitar lessons/i)).toBeInTheDocument();
      });

      // Mobile form interaction
      const inquiryCTA = screen.getByRole('button', { name: /get started|inquiry/i });
      await user.click(inquiryCTA);

      // Form should be mobile-optimized
      const nameField = screen.getByLabelText(/name/i);
      expect(nameField).toHaveAttribute('type', 'text');
      
      // Complete mobile form submission
      await user.type(nameField, validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      
      // Mobile select interactions
      const experienceSelect = screen.getByLabelText(/experience level/i);
      await user.selectOptions(experienceSelect, validTeachingData.experienceLevel);
      
      await user.type(screen.getByLabelText(/musical goals/i), validTeachingData.musicalGoals);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility-Focused User Journeys', () => {
    it('completes journey using only keyboard navigation', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/']);

      // Tab through navigation
      await user.tab();
      await user.tab();
      
      // Activate teaching link with Enter
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText(/guitar lessons/i)).toBeInTheDocument();
      });

      // Tab to inquiry CTA
      await user.tab();
      await user.keyboard('{Enter}');

      // Navigate form with keyboard
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveFocus();
      });

      await user.type(screen.getByLabelText(/name/i), validTeachingData.name);
      await user.tab();
      
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      await user.tab();

      // Use arrow keys for select elements
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
      
      await user.tab();
      await user.type(screen.getByLabelText(/musical goals/i), validTeachingData.musicalGoals);
      
      // Tab to submit and activate
      await user.tab();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    });

    it('provides screen reader friendly journey experience', async () => {
      const user = userEvent.setup();

      renderAppWithRouter(['/teaching']);

      // Check for proper heading structure
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      const inquiryCTA = screen.getByRole('button', { name: /get started|inquiry/i });
      await user.click(inquiryCTA);

      // Form should have proper labels and ARIA attributes
      const nameField = screen.getByLabelText(/name/i);
      expect(nameField).toHaveAttribute('id');
      expect(nameField).toHaveAttribute('aria-required', 'true');

      // Submit invalid form to test error announcements
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
      });

      // Complete form properly
      await user.type(nameField, validTeachingData.name);
      await user.type(screen.getByLabelText(/email/i), validTeachingData.email);
      await user.selectOptions(screen.getByLabelText(/experience level/i), validTeachingData.experienceLevel);
      await user.type(screen.getByLabelText(/musical goals/i), validTeachingData.musicalGoals);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        const successMessage = screen.getByRole('alert');
        expect(successMessage).toHaveTextContent(/thank you/i);
      });
    });
  });
});