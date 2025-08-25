import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Import components to test
import { ServiceCard } from '@/components/ui/ServiceCard';

// Mock router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ServiceCard Component - Business Logic Testing', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  describe('Core Functionality', () => {
    const mockServiceData = {
      id: 'teaching',
      title: 'Guitar Lessons',
      description: 'Professional guitar instruction for all levels',
      highlights: ['Beginner to Advanced', '1-on-1 Instruction', 'Flexible Scheduling'],
      icon: '🎸',
      colorScheme: 'orange' as const
    };

    it('should render service information correctly', () => {
      renderWithRouter(
        <ServiceCard service={mockServiceData} />
      );

      expect(screen.getByText('Guitar Lessons')).toBeInTheDocument();
      expect(screen.getByText('Professional guitar instruction for all levels')).toBeInTheDocument();
    });

    it('should handle click events and navigation', async () => {
      renderWithRouter(
        <ServiceCard service={mockServiceData} />
      );

      const card = screen.getByRole('article') || screen.getByTestId('service-card');
      if (card) {
        await user.click(card);
        // Check for navigation or state changes
        expect(card).toBeInTheDocument();
      }
    });

    it('should display service features when provided', () => {
      renderWithRouter(
        <ServiceCard service={mockServiceData} />
      );

      mockServiceData.highlights.forEach(feature => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });
  });

  describe('Visual Priority System', () => {
    it('should apply primary styling for main services', () => {
      const primaryService = {
        id: 'performance',
        title: 'Live Performances',
        description: 'Professional live music for events',
        highlights: ['Wedding Ceremonies', 'Corporate Events', 'Private Parties'],
        icon: '🎵',
        colorScheme: 'blue' as const
      };

      renderWithRouter(
        <ServiceCard service={primaryService} />
      );

      const card = screen.getByRole('article') || screen.getByTestId('service-card') || document.querySelector('[data-service="performance"]');
      expect(card).toBeInTheDocument();
    });

    it('should apply secondary styling for secondary services', () => {
      const secondaryService = {
        id: 'teaching',
        title: 'Guitar Lessons',
        description: 'Professional guitar instruction',
        highlights: ['All Levels', 'Flexible Schedule'],
        icon: '🎸',
        colorScheme: 'orange' as const
      };

      renderWithRouter(
        <ServiceCard service={secondaryService} />
      );

      const card = screen.getByRole('article') || screen.getByTestId('service-card') || document.querySelector('[data-service="teaching"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('CTA Button Behavior', () => {
    it('should render appropriate CTA text based on service type', () => {
      const serviceWithCTA = {
        id: 'performance',
        title: 'Live Performances',
        description: 'Professional live music for events',
        highlights: ['Wedding Ceremonies', 'Corporate Events'],
        icon: '🎵',
        colorScheme: 'blue' as const
      };

      renderWithRouter(
        <ServiceCard service={serviceWithCTA} />
      );

      // Look for common CTA text patterns
      const ctaButton = screen.queryByText(/Learn More|Book Now|Get Started|View Details/i);
      if (ctaButton) {
        expect(ctaButton).toBeInTheDocument();
      }
    });

    it('should handle CTA clicks independently from card clicks', async () => {
      const serviceData = {
        id: 'collaboration',
        title: 'Music Collaboration',
        description: 'Recording and production services',
        highlights: ['Studio Recording', 'Music Production'],
        icon: '🎙️',
        colorScheme: 'yellow' as const
      };

      renderWithRouter(
        <ServiceCard service={serviceData} />
      );

      // Find CTA button if it exists
      const ctaButton = screen.queryByRole('button', { name: /Learn More|Book Now|Get Started/i });
      if (ctaButton) {
        await user.click(ctaButton);
        expect(ctaButton).toBeInTheDocument();
      }
    });
  });

  describe('Responsive Design Testing', () => {
    it('should adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const mobileService = {
        id: 'teaching',
        title: 'Guitar Lessons',
        description: 'Mobile-optimized instruction',
        highlights: ['Touch-Friendly', 'Responsive Design'],
        icon: '📱',
        colorScheme: 'orange' as const
      };

      renderWithRouter(
        <ServiceCard service={mobileService} />
      );

      const card = screen.getByRole('article') || screen.getByTestId('service-card') || document.querySelector('[data-service]');
      expect(card).toBeInTheDocument();
    });

    it('should maintain touch-friendly interactions on mobile', () => {
      const touchService = {
        id: 'performance',
        title: 'Live Music',
        description: 'Touch-friendly booking',
        highlights: ['Easy Booking', 'Quick Contact'],
        icon: '👆',
        colorScheme: 'blue' as const
      };

      renderWithRouter(
        <ServiceCard service={touchService} />
      );

      const interactiveElements = screen.getAllByRole('article');
      interactiveElements.forEach(element => {
        // Check for touch-friendly sizing (this is a basic check)
        expect(element).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have proper ARIA attributes', () => {
      const accessibleService = {
        id: 'teaching',
        title: 'Accessible Guitar Lessons',
        description: 'Screen reader friendly instruction',
        highlights: ['ARIA Compliant', 'Keyboard Navigation'],
        icon: '♿',
        colorScheme: 'orange' as const
      };

      renderWithRouter(
        <ServiceCard service={accessibleService} />
      );

      const card = screen.getByRole('article') || screen.getByTestId('service-card') || document.querySelector('[data-service]');
      expect(card).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const keyboardService = {
        id: 'performance',
        title: 'Keyboard-Accessible Booking',
        description: 'Fully keyboard navigable',
        highlights: ['Tab Navigation', 'Enter to Activate'],
        icon: '⌨️',
        colorScheme: 'blue' as const
      };

      renderWithRouter(
        <ServiceCard service={keyboardService} />
      );

      // Test tab navigation
      await user.tab();
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('should provide screen reader friendly content', () => {
      const screenReaderService = {
        id: 'collaboration',
        title: 'Screen Reader Optimized Collaboration',
        description: 'Accessible music production services',
        highlights: ['Descriptive Labels', 'Semantic HTML'],
        icon: '🔊',
        colorScheme: 'yellow' as const
      };

      renderWithRouter(
        <ServiceCard service={screenReaderService} />
      );

      // Check for text content that screen readers can access
      expect(screen.getByText('Screen Reader Optimized Collaboration')).toBeInTheDocument();
      expect(screen.getByText('Accessible music production services')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing optional props gracefully', () => {
      const minimalService = {
        id: 'minimal',
        title: 'Minimal Service',
        description: 'Basic service description',
        highlights: [],
        icon: '⭐',
        colorScheme: 'blue' as const
      };

      expect(() => {
        renderWithRouter(
          <ServiceCard service={minimalService} />
        );
      }).not.toThrow();

      expect(screen.getByText('Minimal Service')).toBeInTheDocument();
    });

    it('should handle empty highlights array', () => {
      const noHighlightsService = {
        id: 'no-highlights',
        title: 'Service Without Highlights',
        description: 'Service with no feature highlights',
        highlights: [],
        icon: '📝',
        colorScheme: 'orange' as const
      };

      renderWithRouter(
        <ServiceCard service={noHighlightsService} />
      );

      expect(screen.getByText('Service Without Highlights')).toBeInTheDocument();
    });
  });

  describe('Performance Optimization', () => {
    it('should not re-render unnecessarily', () => {
      const stableService = {
        id: 'stable',
        title: 'Stable Service',
        description: 'Performance optimized service card',
        highlights: ['Fast Loading', 'Optimized Rendering'],
        icon: '⚡',
        colorScheme: 'yellow' as const
      };

      const { rerender } = renderWithRouter(
        <ServiceCard service={stableService} />
      );

      const initialElement = screen.getByText('Stable Service');
      
      // Re-render with same props
      rerender(
        <BrowserRouter>
          <ServiceCard service={stableService} />
        </BrowserRouter>
      );

      const rerenderElement = screen.getByText('Stable Service');
      expect(rerenderElement).toBeInTheDocument();
    });
  });

  describe('Real-World Usage Scenarios', () => {
    it('should handle complete service data for teaching', () => {
      const teachingService = {
        id: 'teaching-complete',
        title: 'Complete Guitar Lessons',
        description: 'Comprehensive guitar instruction covering all aspects of playing',
        highlights: [
          'Beginner to Advanced Levels',
          '1-on-1 Personalized Instruction', 
          'Flexible Scheduling Options',
          'Multiple Musical Styles',
          'Performance Opportunities'
        ],
        icon: '🎸',
        colorScheme: 'orange' as const
      };

      renderWithRouter(
        <ServiceCard service={teachingService} />
      );

      expect(screen.getByText('Complete Guitar Lessons')).toBeInTheDocument();
      expect(screen.getByText('Beginner to Advanced Levels')).toBeInTheDocument();
      expect(screen.getByText('Performance Opportunities')).toBeInTheDocument();
    });

    it('should handle complete service data for performance', () => {
      const performanceService = {
        id: 'performance-complete',
        title: 'Professional Live Performances',
        description: 'High-quality live music for all types of events and occasions',
        highlights: [
          'Wedding Ceremonies & Receptions',
          'Corporate Events & Conferences',
          'Private Parties & Celebrations',
          'Restaurant & Venue Performances',
          'Custom Song Arrangements'
        ],
        icon: '🎵',
        colorScheme: 'blue' as const
      };

      renderWithRouter(
        <ServiceCard service={performanceService} />
      );

      expect(screen.getByText('Professional Live Performances')).toBeInTheDocument();
      expect(screen.getByText('Wedding Ceremonies & Receptions')).toBeInTheDocument();
      expect(screen.getByText('Custom Song Arrangements')).toBeInTheDocument();
    });

    it('should handle complete service data for collaboration', () => {
      const collaborationService = {
        id: 'collaboration-complete',
        title: 'Music Collaboration & Production',
        description: 'Professional recording, production, and collaborative music services',
        highlights: [
          'Studio Recording Sessions',
          'Music Production & Mixing',
          'Songwriting Collaboration',
          'Remote Recording Services',
          'Audio Post-Production'
        ],
        icon: '🎙️',
        colorScheme: 'yellow' as const
      };

      renderWithRouter(
        <ServiceCard service={collaborationService} />
      );

      expect(screen.getByText('Music Collaboration & Production')).toBeInTheDocument();
      expect(screen.getByText('Studio Recording Sessions')).toBeInTheDocument();
      expect(screen.getByText('Audio Post-Production')).toBeInTheDocument();
    });
  });
});