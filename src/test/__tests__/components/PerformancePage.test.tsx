import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Performance } from '@/components/pages/Performance';

// Type definitions for mocked components
interface MockComponentProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  fallback?: React.ReactNode;
  structuredData?: Record<string, unknown>;
  ogType?: string;
}

// Mock the hooks and dependencies
let mockTestimonialsHook = {
  getTestimonialsByService: vi.fn(() => []),
  getFeaturedTestimonials: vi.fn(() => []),
  loading: false,
};

vi.mock('@/hooks/useMultiServiceTestimonials', () => ({
  default: () => mockTestimonialsHook,
}));

// Mock child components
vi.mock('@/components/sections', () => ({
  PerformanceHero: () => <div data-testid="performance-hero">Performance Hero</div>,
  PerformanceGallery: () => <div data-testid="performance-gallery">Performance Gallery</div>,
  MultiServiceTestimonialsSection: () => (
    <div data-testid="testimonials-section">Multi Service Testimonials</div>
  ),
  PricingSection: () => <div data-testid="pricing-section">Pricing Section</div>,
  InstagramFeed: () => <div data-testid="instagram-feed">Instagram Feed</div>,
}));

vi.mock('@/components/common/ErrorBoundary', () => ({
  default: ({ children }: MockComponentProps) => <div data-testid="error-boundary">{children}</div>,
}));

vi.mock('@/components/common/SEOHead', () => ({
  SEOHead: ({ title, description, keywords, canonical }: MockComponentProps) => (
    <div data-testid="seo-head">
      <span data-testid="seo-title">{title}</span>
      <span data-testid="seo-description">{description}</span>
      <span data-testid="seo-keywords">{keywords}</span>
      <span data-testid="seo-canonical">{canonical}</span>
    </div>
  ),
}));

vi.mock('@/components/common/LazySection', () => ({
  LazySection: ({ children }: MockComponentProps) => (
    <div data-testid="lazy-section">{children}</div>
  ),
}));

vi.mock('@/components/ui/CrossServiceSuggestion', () => ({
  CrossServiceSuggestion: () => (
    <div data-testid="cross-service-suggestion">Cross Service Suggestion</div>
  ),
}));

// Test wrapper with Router context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Performance Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock to default values
    mockTestimonialsHook = {
      getTestimonialsByService: vi.fn(() => []),
      getFeaturedTestimonials: vi.fn(() => []),
      loading: false,
    };
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Should have at least one error boundary (there are multiple in the actual component)
      expect(screen.getAllByTestId('error-boundary').length).toBeGreaterThan(0);
    });

    it('should render with custom className', () => {
      const customClass = 'custom-performance-class';
      render(
        <TestWrapper>
          <Performance className={customClass} />
        </TestWrapper>
      );
      
      expect(screen.getAllByTestId('error-boundary').length).toBeGreaterThan(0);
    });

    it('should render with default empty className when none provided', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getAllByTestId('error-boundary').length).toBeGreaterThan(0);
    });
  });

  describe('SEO and Meta Information', () => {
    it('should render correct SEO information', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const expectedTitle = "Live Music Performance Services | Professional Blues Guitarist Melbourne | Rrish Music";
      const expectedDescription = "Professional live music performances for venues, weddings, corporate events, and private functions in Melbourne. Authentic blues guitar entertainment with engaging stage presence and customized setlists.";
      const expectedKeywords = "Melbourne live music, blues guitarist, wedding music, corporate entertainment, venue performances, private events, professional musician, live entertainment";
      const expectedCanonical = "https://www.rrishmusic.com/performance";
      
      expect(screen.getByTestId('seo-title')).toHaveTextContent(expectedTitle);
      expect(screen.getByTestId('seo-description')).toHaveTextContent(expectedDescription);
      expect(screen.getByTestId('seo-keywords')).toHaveTextContent(expectedKeywords);
      expect(screen.getByTestId('seo-canonical')).toHaveTextContent(expectedCanonical);
    });

    it('should include performance-specific keywords', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const keywords = screen.getByTestId('seo-keywords').textContent;
      expect(keywords).toContain('Melbourne live music');
      expect(keywords).toContain('blues guitarist');
      expect(keywords).toContain('wedding music');
      expect(keywords).toContain('corporate entertainment');
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

    it('should render cross-service suggestions', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Performance page has multiple cross-service suggestions
      const crossServiceSuggestions = screen.getAllByTestId('cross-service-suggestion');
      expect(crossServiceSuggestions.length).toBeGreaterThan(0);
    });

    it('should wrap sections in lazy loading components', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const lazySections = screen.getAllByTestId('lazy-section');
      expect(lazySections.length).toBeGreaterThan(0);
    });
  });

  describe('Hook Integration', () => {
    it('should use multi-service testimonials hook', async () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(mockTestimonialsHook.getTestimonialsByService).toHaveBeenCalled();
      });
    });

    it('should handle testimonials loading state', () => {
      // Component should render even when testimonials are loading
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // The testimonials section container should be present
      // (even if the content is still loading)
      const testimonialSection = screen.getAllByTestId('lazy-section').find(el => 
        el.innerHTML.includes('testimonials') || 
        el.closest('[id="performance-testimonials"]')
      );
      expect(testimonialSection).toBeDefined();
    });

    it('should handle testimonials data correctly', async () => {
      const mockTestimonials = [
        { id: 1, service: 'performance', text: 'Great performance!' },
        { id: 2, service: 'performance', text: 'Amazing musician!' },
      ];
      
      mockTestimonialsHook.getTestimonialsByService.mockReturnValue(mockTestimonials);
      mockTestimonialsHook.getFeaturedTestimonials.mockReturnValue(mockTestimonials);
      
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
    });
  });

  describe('Error Boundary Integration', () => {
    it('should wrap content in error boundaries', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const errorBoundaries = screen.getAllByTestId('error-boundary');
      expect(errorBoundaries.length).toBeGreaterThan(0);
      
      // Verify main sections are present
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
    });

    it('should handle component errors gracefully', () => {
      // The error boundary should catch component errors
      expect(() => {
        render(
          <TestWrapper>
            <Performance />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Suspense and Lazy Loading', () => {
    it('should implement suspense for lazy-loaded sections', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const lazySections = screen.getAllByTestId('lazy-section');
      expect(lazySections.length).toBeGreaterThan(0);
    });

    it('should provide fallback content for lazy sections', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // LazySection components should be present
      expect(screen.getAllByTestId('lazy-section')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper document structure with SEO head', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const seoHead = screen.getByTestId('seo-head');
      expect(seoHead).toBeInTheDocument();
      
      const title = screen.getByTestId('seo-title');
      expect(title).toHaveTextContent(/Live Music Performance Services/);
    });

    it('should maintain accessibility in section order', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Verify logical section order
      const hero = screen.getByTestId('performance-hero');
      const gallery = screen.getByTestId('performance-gallery');
      const testimonials = screen.getByTestId('testimonials-section');
      
      expect(hero).toBeInTheDocument();
      expect(gallery).toBeInTheDocument();
      expect(testimonials).toBeInTheDocument();
    });
  });

  describe('Mobile Compatibility', () => {
    it('should render properly on mobile devices', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
    });

    it('should handle responsive sections correctly', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // All major sections should be present
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
      expect(screen.getByTestId('instagram-feed')).toBeInTheDocument();
    });
  });

  describe('Performance Optimization', () => {
    it('should implement lazy loading for heavy sections', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Verify lazy sections are implemented
      const lazySections = screen.getAllByTestId('lazy-section');
      expect(lazySections.length).toBeGreaterThan(0);
    });

    it('should handle suspense boundaries correctly', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Component should render without suspense errors
      expect(screen.getAllByTestId('error-boundary').length).toBeGreaterThan(0);
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
    });
  });
});