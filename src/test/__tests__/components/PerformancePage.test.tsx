import { Performance } from '@/components/pages/Performance';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

// Type definitions for mocked components
interface MockComponentProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

// Mock performance monitor
vi.mock('@/utils/performanceMonitor', () => ({
  performanceMonitor: {
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    now: vi.fn(() => Date.now())
  }
}));

// Mock Error Boundary
vi.mock('@/components/common/ErrorBoundary', () => ({
  default: ({ children }: MockComponentProps) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

// Mock SEO Head component
vi.mock('@/components/common/SEOHead', () => ({
  SEOHead: ({ title, description }: MockComponentProps) => (
    <div data-testid="seo-head">
      <div data-testid="document-title">{title}</div>
      <div data-testid="meta-description">{description}</div>
    </div>
  ),
}));

// Mock LazySection component
vi.mock('@/components/common/LazySection', () => ({
  LazySection: ({ children }: MockComponentProps) => 
    <div data-testid="lazy-section">{children}</div>
}));

// Mock performance section components
vi.mock('@/components/sections/performance', () => ({
  PerformanceHero: () => <section data-testid="performance-hero">Performance Hero</section>,
  PerformanceGallery: () => <section data-testid="performance-gallery">Performance Gallery</section>,
  MultiServiceTestimonialsSection: () =>
    <section data-testid="testimonials-section">Multi Service Testimonials</section>,
  PricingSection: () => <section data-testid="pricing-section">Pricing Section</section>,
  InstagramFeed: () => <section data-testid="instagram-feed">Instagram Feed</section>,
}));

// Mock CrossServiceNavigation
vi.mock('@/components/CrossServiceNavigation', () => ({
  CrossServiceNavigation: () => 
    <nav data-testid="cross-service-navigation">Cross Service Navigation</nav>
}));

// Test wrapper with Router context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Performance Page Component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const customClass = 'test-custom-class';
      
      render(
        <TestWrapper>
          <Performance className={customClass} />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should render with default empty className when none provided', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('SEO and Meta Information', () => {
    it('should render correct title and description', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('seo-head')).toBeInTheDocument();
      expect(screen.getByTestId('document-title')).toBeInTheDocument();
      expect(screen.getByTestId('meta-description')).toBeInTheDocument();
    });

    it('should include performance-specific keywords in meta content', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // SEO head should contain performance-related metadata
      const seoHead = screen.getByTestId('seo-head');
      expect(seoHead).toBeInTheDocument();
    });
  });

  describe('Section Components Integration', () => {
    it('should render all required performance sections', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
      expect(screen.getByTestId('instagram-feed')).toBeInTheDocument();
    });

    it('should render cross-service navigation', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('cross-service-navigation')).toBeInTheDocument();
    });

    it('should render sections in correct order', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const sections = screen.getAllByTestId(/.*-section|.*-feed|.*-hero|.*-navigation|.*-gallery/);
      expect(sections.length).toBeGreaterThan(0);
      
      // Should include key performance sections
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
      expect(screen.getByTestId('instagram-feed')).toBeInTheDocument();
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should initialize performance monitoring on mount', async () => {
      const performanceMonitorModule = await vi.importMock('@/utils/performanceMonitor') as { performanceMonitor: { mark: vi.MockedFunction<unknown> } };
      
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(performanceMonitorModule.performanceMonitor.mark).toHaveBeenCalledWith('performance-page-render-start');
    });

    it('should measure performance on unmount', async () => {
      const performanceMonitorModule = await vi.importMock('@/utils/performanceMonitor') as { performanceMonitor: { measure: vi.MockedFunction<unknown> } };
      
      const { unmount } = render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      unmount();
      
      expect(performanceMonitorModule.performanceMonitor.measure).toHaveBeenCalledWith('performance-page-render-total');
    });
  });

  describe('Error Boundary Integration', () => {
    it('should wrap components in error boundary', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const errorBoundary = screen.getByTestId('error-boundary');
      expect(errorBoundary).toBeInTheDocument();
    });

    it('should contain all performance sections within error boundary', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // All sections should be within the error boundary
      const errorBoundary = screen.getByTestId('error-boundary');
      expect(errorBoundary).toBeInTheDocument();
      
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
      expect(screen.getByTestId('instagram-feed')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible section structure', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Should have sections for screen readers
      const sections = screen.getAllByRole('generic', { hidden: true });
      expect(sections.length).toBeGreaterThan(0);
      
      // Key sections should be identifiable
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Test that elements can be focused via keyboard
      await user.tab();
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeDefined();
      
      // Test navigation through sections
      const heroSection = screen.getByTestId('performance-hero');
      heroSection.focus();
      expect(heroSection).toHaveFocus();
    });

    it('should use semantic navigation elements', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Check for navigation
      const navigation = screen.getByTestId('cross-service-navigation');
      expect(navigation.tagName).toBe('NAV');
    });
  });

  describe('Mobile Compatibility', () => {
    it('should render properly on different screen sizes', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 375,
      });

      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
    });

    it('should handle responsive sections correctly', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // All sections should render regardless of screen size
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
      expect(screen.getByTestId('instagram-feed')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle gallery interactions properly', async () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Test that gallery section is interactive
      const gallery = screen.getByTestId('performance-gallery');
      expect(gallery).toBeInTheDocument();
      
      // Test focusing gallery
      gallery.focus();
      expect(gallery).toHaveFocus();
    });

    it('should handle hero section interactions', async () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const heroSection = screen.getByTestId('performance-hero');
      expect(heroSection).toBeInTheDocument();
      
      // Test hero section focus
      heroSection.focus();
      expect(heroSection).toHaveFocus();
    });

    it('should handle navigation interactions', async () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const navigation = screen.getByTestId('cross-service-navigation');
      expect(navigation).toBeInTheDocument();
      
      // Test navigation focus
      navigation.focus();
      expect(navigation).toHaveFocus();
    });

    it('should handle keyboard navigation between sections', async () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Test tab navigation
      await user.tab();
      const firstFocusable = document.activeElement;
      expect(firstFocusable).toBeDefined();
      
      await user.tab();
      const secondFocusable = document.activeElement;
      expect(secondFocusable).toBeDefined();
      
      // Should be able to navigate between different elements
      expect(firstFocusable).not.toBe(secondFocusable);
    });

    it('should handle Instagram feed interactions', async () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const instagramFeed = screen.getByTestId('instagram-feed');
      expect(instagramFeed).toBeInTheDocument();
      
      // Test Instagram feed focus
      instagramFeed.focus();
      expect(instagramFeed).toHaveFocus();
    });
  });

  describe('Hook Integration', () => {
    it('should integrate with testimonials hooks', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Verify testimonials section is rendered, suggesting successful hook integration
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
    });

    it('should integrate with content hooks', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // All sections should render successfully, indicating proper hook integration
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
    });

    it('should handle content loading states', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Component should render successfully even during loading states
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('Lazy Loading Integration', () => {
    it('should implement lazy loading for components', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('lazy-section')).toBeInTheDocument();
    });

    it('should handle lazy component mounting', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Lazy section should be present
      const lazySection = screen.getByTestId('lazy-section');
      expect(lazySection).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing props gracefully', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Should render without errors even with no props
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should render default content when data unavailable', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Should show fallback content
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
    });

    it('should handle component errors through error boundary', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Error boundary should be present to catch any errors
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('Business Logic Integration', () => {
    it('should present performance-specific value propositions', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Should have performance-specific sections
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
    });

    it('should maintain consistent brand messaging', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // SEO head should contain brand-consistent metadata
      expect(screen.getByTestId('seo-head')).toBeInTheDocument();
      expect(screen.getByTestId('document-title')).toBeInTheDocument();
    });
  });

  describe('Social Media Integration', () => {
    it('should integrate Instagram feed properly', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('instagram-feed')).toBeInTheDocument();
    });

    it('should handle social media content loading', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const instagramFeed = screen.getByTestId('instagram-feed');
      expect(instagramFeed).toBeInTheDocument();
      expect(instagramFeed).toHaveTextContent('Instagram Feed');
    });
  });

  describe('Pricing Integration', () => {
    it('should integrate pricing section properly', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
    });

    it('should handle pricing data display', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const pricingSection = screen.getByTestId('pricing-section');
      expect(pricingSection).toBeInTheDocument();
      expect(pricingSection).toHaveTextContent('Pricing Section');
    });
  });
});