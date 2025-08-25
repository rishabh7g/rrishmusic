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
      image: '/images/teaching.jpg',
      link: '/teaching',
      features: ['Beginner to Advanced', '1-on-1 Instruction', 'Flexible Scheduling']
    };

    it('should render service information correctly', () => {
      renderWithRouter(
        <ServiceCard {...mockServiceData} />
      );

      expect(screen.getByText('Guitar Lessons')).toBeInTheDocument();
      expect(screen.getByText('Professional guitar instruction for all levels')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('alt', expect.stringContaining('Guitar Lessons'));
    });

    it('should handle click events and navigation', async () => {
      const mockOnClick = vi.fn();
      renderWithRouter(
        <ServiceCard {...mockServiceData} onClick={mockOnClick} />
      );

      const card = screen.getByRole('article') || screen.getByTestId('service-card');
      await user.click(card);

      expect(mockOnClick).toHaveBeenCalledWith('teaching');
    });

    it('should display service features when provided', () => {
      renderWithRouter(
        <ServiceCard {...mockServiceData} />
      );

      mockServiceData.features.forEach(feature => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });
  });

  describe('Visual Priority System', () => {
    it('should apply primary styling for main services', () => {
      const primaryService = {
        id: 'performance',
        title: 'Live Performances',
        description: 'Professional live music',
        priority: 'primary' as const
      };

      renderWithRouter(<ServiceCard {...primaryService} />);

      const card = screen.getByRole('article') || screen.getByTestId('service-card');
      expect(card).toHaveClass(/primary|featured|highlight/);
    });

    it('should apply secondary styling for secondary services', () => {
      const secondaryService = {
        id: 'teaching',
        title: 'Guitar Lessons',
        description: 'Professional instruction',
        priority: 'secondary' as const
      };

      renderWithRouter(<ServiceCard {...secondaryService} />);

      const card = screen.getByRole('article') || screen.getByTestId('service-card');
      expect(card).toHaveClass(/secondary|standard/);
    });
  });

  describe('CTA Button Behavior', () => {
    it('should render appropriate CTA text based on service type', () => {
      const teachingService = {
        id: 'teaching',
        title: 'Guitar Lessons',
        description: 'Professional instruction',
        ctaText: 'Book Lesson'
      };

      renderWithRouter(<ServiceCard {...teachingService} />);

      expect(screen.getByText('Book Lesson')).toBeInTheDocument();
    });

    it('should handle CTA clicks independently from card clicks', async () => {
      const mockCardClick = vi.fn();
      const mockCtaClick = vi.fn();

      renderWithRouter(
        <ServiceCard 
          id="teaching"
          title="Guitar Lessons"
          description="Professional instruction"
          onClick={mockCardClick}
          onCtaClick={mockCtaClick}
          ctaText="Book Now"
        />
      );

      const ctaButton = screen.getByRole('button', { name: /book now/i });
      await user.click(ctaButton);

      expect(mockCtaClick).toHaveBeenCalledWith('teaching');
      expect(mockCardClick).not.toHaveBeenCalled();
    });
  });

  describe('Responsive Design Testing', () => {
    it('should adapt to mobile viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithRouter(
        <ServiceCard 
          id="performance"
          title="Live Performances"
          description="Professional live music for your event"
        />
      );

      const card = screen.getByRole('article') || screen.getByTestId('service-card');
      expect(card).toBeInTheDocument();

      // Should have mobile-friendly layout
      expect(card).toHaveClass(/flex-col|stack|mobile/);
    });

    it('should maintain touch-friendly interactions on mobile', async () => {
      const mockClick = vi.fn();
      renderWithRouter(
        <ServiceCard 
          id="collaboration"
          title="Music Collaboration"
          description="Professional recording services"
          onClick={mockClick}
        />
      );

      const card = screen.getByRole('article') || screen.getByTestId('service-card');
      
      // Simulate touch interaction
      fireEvent.touchStart(card);
      fireEvent.touchEnd(card);

      // Should still be clickable
      await user.click(card);
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have proper ARIA attributes', () => {
      renderWithRouter(
        <ServiceCard 
          id="teaching"
          title="Guitar Lessons"
          description="Professional guitar instruction"
        />
      );

      const card = screen.getByRole('article') || screen.getByTestId('service-card');
      expect(card).toHaveAttribute('role', 'article');
      expect(card).toHaveAttribute('aria-label', expect.stringContaining('Guitar Lessons'));
    });

    it('should support keyboard navigation', async () => {
      const mockClick = vi.fn();
      renderWithRouter(
        <ServiceCard 
          id="performance"
          title="Live Performances"
          description="Professional live music"
          onClick={mockClick}
        />
      );

      const card = screen.getByRole('article') || screen.getByTestId('service-card');
      
      // Tab to card
      await user.tab();
      expect(card).toHaveFocus();

      // Press Enter to activate
      await user.keyboard('{Enter}');
      expect(mockClick).toHaveBeenCalled();
    });

    it('should provide screen reader friendly content', () => {
      renderWithRouter(
        <ServiceCard 
          id="collaboration"
          title="Music Collaboration"
          description="Recording and production services"
          features={['Studio Recording', 'Audio Mixing', 'Music Production']}
        />
      );

      // Title should be a heading
      expect(screen.getByRole('heading')).toHaveTextContent('Music Collaboration');

      // Features should be in a list
      const features = screen.getAllByRole('listitem');
      expect(features).toHaveLength(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing image gracefully', () => {
      renderWithRouter(
        <ServiceCard 
          id="teaching"
          title="Guitar Lessons"
          description="Professional instruction"
          image="/nonexistent.jpg"
        />
      );

      const img = screen.getByRole('img');
      
      // Simulate image error
      fireEvent.error(img);

      // Should still display other content
      expect(screen.getByText('Guitar Lessons')).toBeInTheDocument();
    });

    it('should handle missing props gracefully', () => {
      expect(() => 
        renderWithRouter(
          <ServiceCard 
            id="test"
            title="Test Service"
            description="Test description"
          />
        )
      ).not.toThrow();
    });
  });

  describe('Performance Optimization', () => {
    it('should optimize image loading', () => {
      renderWithRouter(
        <ServiceCard 
          id="performance"
          title="Live Performances"
          description="Professional live music"
          image="/images/performance.jpg"
        />
      );

      const img = screen.getByRole('img');
      
      // Should have loading optimization attributes
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('decoding', 'async');
    });
  });

  describe('Business Logic Integration', () => {
    it('should integrate with service routing correctly', () => {
      renderWithRouter(
        <ServiceCard 
          id="teaching"
          title="Guitar Lessons"
          description="Professional instruction"
          link="/teaching"
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/teaching');
    });

    it('should track analytics events on interactions', async () => {
      const mockAnalytics = vi.fn();
      // Mock window.gtag or analytics
      (window as unknown as { gtag: typeof mockAnalytics }).gtag = mockAnalytics;

      renderWithRouter(
        <ServiceCard 
          id="performance"
          title="Live Performances"
          description="Professional live music"
        />
      );

      const card = screen.getByRole('article') || screen.getByTestId('service-card');
      await user.click(card);

      // Should track service card click
      expect(mockAnalytics).toHaveBeenCalledWith('event', 'service_card_click', {
        service_type: 'performance'
      });
    });

    it('should handle service-specific call-to-action logic', () => {
      const services = [
        { id: 'teaching', expectedCta: 'Book Lesson' },
        { id: 'performance', expectedCta: 'Book Performance' },
        { id: 'collaboration', expectedCta: 'Start Project' }
      ];

      services.forEach(({ id, expectedCta }) => {
        renderWithRouter(
          <ServiceCard 
            id={id}
            title={`${id} Service`}
            description="Test description"
          />
        );

        expect(screen.getByText(expectedCta)).toBeInTheDocument();
      });
    });
  });
});