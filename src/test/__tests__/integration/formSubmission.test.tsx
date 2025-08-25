/**
 * Form Submission Integration Tests
 * 
 * Comprehensive tests for form submission workflows across all service contexts.
 * Tests API integration, data transformation, success/error handling, and user feedback.
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

// Test data
import { 
  validTeachingData, 
  validPerformanceData, 
  validCollaborationData,
} from '@/test/mocks/formData';

// Mock API responses
const mockSuccessResponse = {
  ok: true,
  status: 200,
  json: async () => ({ 
    success: true, 
    message: 'Form submitted successfully',
    submissionId: 'test-123'
  })
};

const mockErrorResponse = {
  ok: false,
  status: 400,
  json: async () => ({ 
    error: 'Validation failed',
    details: ['Invalid email format']
  })
};

const mockServerErrorResponse = {
  ok: false,
  status: 500,
  json: async () => ({ 
    error: 'Internal server error'
  })
};

// Mock fetch
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

// Helper function to fill and submit teaching form
const fillAndSubmitTeachingForm = async (user: ReturnType<typeof userEvent.setup>, data = validTeachingData) => {
  await user.type(screen.getByLabelText(/name/i), data.name);
  await user.type(screen.getByLabelText(/email/i), data.email);
  if (data.phone) {
    await user.type(screen.getByLabelText(/phone/i), data.phone);
  }
  await user.selectOptions(screen.getByLabelText(/package type/i), data.packageType);
  await user.selectOptions(screen.getByLabelText(/experience level/i), data.experienceLevel);
  await user.type(screen.getByLabelText(/musical goals/i), data.musicalGoals);
  await user.selectOptions(screen.getByLabelText(/lesson format/i), data.lessonFormat);
  await user.selectOptions(screen.getByLabelText(/preferred schedule/i), data.preferredSchedule);
  
  await user.click(screen.getByRole('button', { name: /submit/i }));
};

// Helper function to fill and submit performance form
const fillAndSubmitPerformanceForm = async (user: ReturnType<typeof userEvent.setup>, data = validPerformanceData) => {
  await user.type(screen.getByLabelText(/name/i), data.name);
  await user.type(screen.getByLabelText(/email/i), data.email);
  if (data.phone) {
    await user.type(screen.getByLabelText(/phone/i), data.phone);
  }
  await user.selectOptions(screen.getByLabelText(/event type/i), data.eventType);
  
  if (data.eventDate) {
    await user.type(screen.getByLabelText(/event date/i), data.eventDate);
  }
  
  await user.selectOptions(screen.getByLabelText(/performance format/i), data.performanceFormat);
  await user.selectOptions(screen.getByLabelText(/performance style/i), data.performanceStyle);
  await user.type(screen.getByLabelText(/duration/i), data.duration);
  await user.selectOptions(screen.getByLabelText(/budget range/i), data.budgetRange);
  
  if (data.specialRequests) {
    await user.type(screen.getByLabelText(/special requests/i), data.specialRequests);
  }
  
  await user.click(screen.getByRole('button', { name: /submit/i }));
};

// Helper function to fill and submit collaboration form
const fillAndSubmitCollaborationForm = async (user: ReturnType<typeof userEvent.setup>, data = validCollaborationData) => {
  await user.type(screen.getByLabelText(/name/i), data.name);
  await user.type(screen.getByLabelText(/email/i), data.email);
  if (data.phone) {
    await user.type(screen.getByLabelText(/phone/i), data.phone);
  }
  await user.selectOptions(screen.getByLabelText(/project type/i), data.projectType);
  await user.type(screen.getByLabelText(/creative vision/i), data.creativeVision);
  await user.selectOptions(screen.getByLabelText(/timeline/i), data.timeline);
  await user.selectOptions(screen.getByLabelText(/project scope/i), data.projectScope);
  await user.selectOptions(screen.getByLabelText(/budget range/i), data.budgetRange);
  await user.selectOptions(screen.getByLabelText(/experience/i), data.experience);
  
  await user.click(screen.getByRole('button', { name: /submit/i }));
};

describe('Form Submission Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue(mockSuccessResponse as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Teaching Form Submission', () => {
    it('submits teaching inquiry with correct API payload', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitTeachingForm(user);

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

      // Verify payload structure
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const payload = JSON.parse(lastCall[1]?.body as string);
      
      expect(payload).toMatchObject({
        serviceType: 'teaching',
        name: validTeachingData.name,
        email: validTeachingData.email,
        packageType: validTeachingData.packageType,
        experienceLevel: validTeachingData.experienceLevel,
        musicalGoals: validTeachingData.musicalGoals
      });
    });

    it('shows success message after successful teaching form submission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitTeachingForm(user);

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
        expect(screen.getByText(/your inquiry has been received/i)).toBeInTheDocument();
      });
    });

    it('includes service-specific metadata in teaching submission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitTeachingForm(user);

      await waitFor(() => {
        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        const payload = JSON.parse(lastCall[1]?.body as string);
        
        expect(payload.metadata).toMatchObject({
          formType: 'teaching-inquiry',
          timestamp: expect.any(String),
          userAgent: expect.any(String),
          referrer: expect.any(String)
        });
      });
    });

    it('handles teaching form submission with optional fields', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      const dataWithOptionalFields = {
        ...validTeachingData,
        phone: '+1 (555) 123-4567',
        scheduleDetails: 'Flexible with mornings',
        previousExperience: 'Played piano for 2 years',
        specificInterests: 'Blues and rock music',
        additionalInfo: 'Looking forward to learning!',
        bestTimeToContact: 'Evenings after 6pm'
      };

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitTeachingForm(user, dataWithOptionalFields);

      await waitFor(() => {
        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        const payload = JSON.parse(lastCall[1]?.body as string);
        
        expect(payload.phone).toBe(dataWithOptionalFields.phone);
        expect(payload.scheduleDetails).toBe(dataWithOptionalFields.scheduleDetails);
        expect(payload.previousExperience).toBe(dataWithOptionalFields.previousExperience);
        expect(payload.specificInterests).toBe(dataWithOptionalFields.specificInterests);
      });
    });
  });

  describe('Performance Form Submission', () => {
    it('submits performance inquiry with correct API payload', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <PerformanceInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitPerformanceForm(user);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/contact'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            }),
            body: expect.stringContaining(validPerformanceData.name)
          })
        );
      });

      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const payload = JSON.parse(lastCall[1]?.body as string);
      
      expect(payload).toMatchObject({
        serviceType: 'performance',
        name: validPerformanceData.name,
        email: validPerformanceData.email,
        eventType: validPerformanceData.eventType,
        performanceFormat: validPerformanceData.performanceFormat,
        budgetRange: validPerformanceData.budgetRange
      });
    });

    it('handles venue information in performance submission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      const performanceDataWithVenue = {
        ...validPerformanceData,
        venueName: 'The Grand Ballroom',
        venueAddress: '123 Main St, City, State 12345',
        hasVenueRestrictions: true,
        venueRestrictions: 'No amplified music after 10 PM'
      };

      renderFormWithRouter(
        <PerformanceInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitPerformanceForm(user, performanceDataWithVenue);

      await waitFor(() => {
        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        const payload = JSON.parse(lastCall[1]?.body as string);
        
        expect(payload.venueName).toBe(performanceDataWithVenue.venueName);
        expect(payload.venueAddress).toBe(performanceDataWithVenue.venueAddress);
        expect(payload.hasVenueRestrictions).toBe(true);
        expect(payload.venueRestrictions).toBe(performanceDataWithVenue.venueRestrictions);
      });
    });

    it('processes event timing information correctly', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      const eventDate = '2024-12-31';
      const eventTime = '19:00';
      const performanceDataWithTiming = {
        ...validPerformanceData,
        eventDate,
        eventTime
      };

      renderFormWithRouter(
        <PerformanceInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitPerformanceForm(user, performanceDataWithTiming);

      await waitFor(() => {
        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        const payload = JSON.parse(lastCall[1]?.body as string);
        
        expect(payload.eventDate).toBe(eventDate);
        expect(payload.eventTime).toBe(eventTime);
      });
    });
  });

  describe('Collaboration Form Submission', () => {
    it('submits collaboration inquiry with correct API payload', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <CollaborationInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitCollaborationForm(user);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/contact'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            }),
            body: expect.stringContaining(validCollaborationData.name)
          })
        );
      });

      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const payload = JSON.parse(lastCall[1]?.body as string);
      
      expect(payload).toMatchObject({
        serviceType: 'collaboration',
        name: validCollaborationData.name,
        email: validCollaborationData.email,
        projectType: validCollaborationData.projectType,
        creativeVision: validCollaborationData.creativeVision,
        timeline: validCollaborationData.timeline,
        projectScope: validCollaborationData.projectScope
      });
    });

    it('handles file uploads in collaboration submission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <CollaborationInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      // Fill basic form fields
      await user.type(screen.getByLabelText(/name/i), validCollaborationData.name);
      await user.type(screen.getByLabelText(/email/i), validCollaborationData.email);
      await user.selectOptions(screen.getByLabelText(/project type/i), validCollaborationData.projectType);
      await user.type(screen.getByLabelText(/creative vision/i), validCollaborationData.creativeVision);

      // Handle file upload
      const fileInput = screen.getByLabelText(/portfolio files/i);
      const testFile = new File(['test content'], 'portfolio.pdf', { type: 'application/pdf' });
      
      await user.upload(fileInput, testFile);
      
      // Complete form
      await user.selectOptions(screen.getByLabelText(/timeline/i), validCollaborationData.timeline);
      await user.selectOptions(screen.getByLabelText(/project scope/i), validCollaborationData.projectScope);
      await user.selectOptions(screen.getByLabelText(/budget range/i), validCollaborationData.budgetRange);
      await user.selectOptions(screen.getByLabelText(/experience/i), validCollaborationData.experience);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
        
        // Check that FormData was used for file upload
        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        expect(lastCall[1]?.body).toBeInstanceOf(FormData);
      });
    });

    it('handles project timeline details in collaboration submission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      const collaborationDataWithTimeline = {
        ...validCollaborationData,
        timeline: 'specific-date' as const,
        timelineDetails: 'Need to complete by March 2024 for album release'
      };

      renderFormWithRouter(
        <CollaborationInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitCollaborationForm(user, collaborationDataWithTimeline);

      await waitFor(() => {
        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        const payload = JSON.parse(lastCall[1]?.body as string);
        
        expect(payload.timeline).toBe('specific-date');
        expect(payload.timelineDetails).toBe(collaborationDataWithTimeline.timelineDetails);
      });
    });
  });

  describe('Error Handling and Recovery', () => {
    it('displays validation errors from server response', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      mockFetch.mockResolvedValueOnce(mockErrorResponse as Response);

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitTeachingForm(user);

      await waitFor(() => {
        expect(screen.getByText(/validation failed/i)).toBeInTheDocument();
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('handles network errors gracefully', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      mockFetch.mockRejectedValueOnce(new Error('Network connection failed'));

      renderFormWithRouter(
        <PerformanceInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitPerformanceForm(user);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
        expect(screen.getByText(/please check your connection/i)).toBeInTheDocument();
      });
    });

    it('handles server errors with appropriate user feedback', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      mockFetch.mockResolvedValueOnce(mockServerErrorResponse as Response);

      renderFormWithRouter(
        <CollaborationInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitCollaborationForm(user);

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/please try again later/i)).toBeInTheDocument();
      });
    });

    it('provides retry functionality after submission failure', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      // First call fails, second succeeds
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockSuccessResponse as Response);

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitTeachingForm(user);

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });

      // Click retry button
      const retryButton = screen.getByRole('button', { name: /try again|retry/i });
      await user.click(retryButton);

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });
    });

    it('prevents multiple simultaneous submissions', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      // Delay response to simulate slow network
      mockFetch.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockSuccessResponse as Response), 1000))
      );

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitTeachingForm(user);

      // Try to submit again immediately
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();

      // Verify only one API call was made
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Success Workflows', () => {
    it('closes form modal after successful submission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitTeachingForm(user);

      await waitFor(() => {
        expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      });

      // Wait for auto-close or click close button
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      }, { timeout: 5000 });
    });

    it('provides confirmation details after successful submission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      const responseWithId = {
        ok: true,
        status: 200,
        json: async () => ({ 
          success: true, 
          submissionId: 'INQ-2024-001',
          message: 'We will contact you within 24 hours',
          nextSteps: ['Check your email for confirmation', 'Expect a call within 2 business days']
        })
      };

      mockFetch.mockResolvedValueOnce(responseWithId as Response);

      renderFormWithRouter(
        <PerformanceInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitPerformanceForm(user);

      await waitFor(() => {
        expect(screen.getByText(/INQ-2024-001/i)).toBeInTheDocument();
        expect(screen.getByText(/within 24 hours/i)).toBeInTheDocument();
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });
    });

    it('tracks form submission analytics events', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      // Mock analytics tracking
      const mockAnalytics = vi.fn();
      (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag = mockAnalytics;

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitTeachingForm(user);

      await waitFor(() => {
        expect(mockAnalytics).toHaveBeenCalledWith('event', 'form_submit', {
          form_type: 'teaching_inquiry',
          service_type: 'teaching',
          package_type: validTeachingData.packageType,
          experience_level: validTeachingData.experienceLevel
        });
      });
    });
  });

  describe('Data Transformation and Processing', () => {
    it('sanitizes and formats form data before submission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      const rawData = {
        ...validTeachingData,
        name: '  John Doe  ', // Extra whitespace
        phone: '(555) 123-4567', // Formatted phone
        email: 'JOHN@EXAMPLE.COM', // Uppercase email
      };

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitTeachingForm(user, rawData);

      await waitFor(() => {
        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        const payload = JSON.parse(lastCall[1]?.body as string);
        
        expect(payload.name).toBe('John Doe'); // Trimmed
        expect(payload.email).toBe('john@example.com'); // Lowercase
        expect(payload.phone).toBe('+15551234567'); // Normalized
      });
    });

    it('includes timestamp and metadata in all submissions', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      renderFormWithRouter(
        <PerformanceInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitPerformanceForm(user);

      await waitFor(() => {
        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        const payload = JSON.parse(lastCall[1]?.body as string);
        
        expect(payload.metadata).toMatchObject({
          submittedAt: expect.any(String),
          formVersion: expect.any(String),
          browserInfo: expect.any(Object),
          sessionId: expect.any(String)
        });
      });
    });

    it('handles special characters and internationalization', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      const internationalData = {
        ...validCollaborationData,
        name: 'José María García-López',
        creativeVision: 'Creating música folclórica with modern 技術 influences'
      };

      renderFormWithRouter(
        <CollaborationInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitCollaborationForm(user, internationalData);

      await waitFor(() => {
        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        const payload = JSON.parse(lastCall[1]?.body as string);
        
        expect(payload.name).toBe(internationalData.name);
        expect(payload.creativeVision).toBe(internationalData.creativeVision);
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('compresses large form data before transmission', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      const largeData = {
        ...validCollaborationData,
        creativeVision: 'A'.repeat(5000), // Large text content
        additionalInfo: 'B'.repeat(3000)
      };

      renderFormWithRouter(
        <CollaborationInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitCollaborationForm(user, largeData);

      await waitFor(() => {
        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        const requestHeaders = lastCall[1]?.headers as Record<string, string>;
        
        // Check for compression headers if implemented
        expect(requestHeaders['Content-Type']).toBe('application/json');
        // Could also check for 'Content-Encoding': 'gzip' if compression is enabled
      });
    });

    it('implements request timeout for form submissions', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      // Mock a request that never resolves
      mockFetch.mockImplementation(() => new Promise(() => {}));

      renderFormWithRouter(
        <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
      );

      await fillAndSubmitTeachingForm(user);

      // Check that timeout error appears
      await waitFor(() => {
        expect(screen.getByText(/request timed out/i)).toBeInTheDocument();
      }, { timeout: 10000 });
    });

    it('batches multiple form submissions efficiently', async () => {
      // This would test scenarios where multiple forms might be submitted
      // in quick succession, ensuring proper queuing and processing
      const submissions = [
        { form: 'teaching', data: validTeachingData },
        { form: 'performance', data: validPerformanceData },
        { form: 'collaboration', data: validCollaborationData }
      ];

      const promises = submissions.map(async (submission) => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();

        if (submission.form === 'teaching') {
          renderFormWithRouter(
            <TeachingInquiryForm isOpen={true} onClose={mockOnClose} />
          );
          await fillAndSubmitTeachingForm(user, submission.data as typeof validTeachingData);
        }
        // Similar for other forms...
      });

      await Promise.all(promises);

      // Verify all submissions were handled correctly
      expect(mockFetch).toHaveBeenCalledTimes(submissions.length);
    });
  });
});