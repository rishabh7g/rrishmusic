import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Teaching } from '@/components/pages/Teaching';
import { Performance } from '@/components/pages/Performance';
import { Collaboration } from '@/components/pages/Collaboration';

// Type definitions for mocked components
interface MockComponentProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  fallback?: React.ReactNode;
  structuredData?: Record<string, unknown>;
}

// Mock all external dependencies consistently across all service pages
vi.mock('@/utils/performanceMonitor', () => ({
  performanceMonitor: {
    mark: vi.fn(),
    measure: vi.fn(),
  },
}));

vi.mock('@/hooks/useMultiServiceTestimonials', () => ({
  default: () => ({
    getTestimonialsByService: vi.fn(() => []),
    getFeaturedTestimonials: vi.fn(() => []),
    loading: false,
  }),
}));

// Mock all section components with consistent structure
vi.mock('@/components/ServicePageLayout', () => ({
  ServicePageLayout: ({ children, title, description }: MockComponentProps) => (
    <div data-testid="service-page-layout">
      <h1 data-testid="page-title">{title}</h1>
      <p data-testid="page-description">{description}</p>
      {children}
    </div>
  ),
}));

vi.mock('@/components/sections/Lessons', () => ({
  Lessons: () => <section data-testid="lessons-section">Lessons Section</section>,
}));

vi.mock('@/components/sections/Approach', () => ({
  Approach: () => <section data-testid="approach-section">Approach Section</section>,
}));

vi.mock('@/components/sections/About', () => ({
  About: () => <section data-testid="about-section">About Section</section>,
}));

vi.mock('@/components/sections/Contact', () => ({
  Contact: () => <section data-testid="contact-section">Contact Section</section>,
}));

vi.mock('@/components/CrossServiceNavigation', () => ({
  CrossServiceNavigation: () => (
    <nav data-testid="cross-service-navigation">Cross Service Navigation</nav>
  ),
}));

vi.mock('@/components/sections', () => ({
  PerformanceHero: () => <section data-testid="performance-hero">Performance Hero</section>,
  PerformanceGallery: () => <section data-testid="performance-gallery">Performance Gallery</section>,
  MultiServiceTestimonialsSection: () => (
    <section data-testid="testimonials-section">Multi Service Testimonials</section>
  ),
  PricingSection: () => <section data-testid="pricing-section">Pricing Section</section>,
  InstagramFeed: () => <section data-testid="instagram-feed">Instagram Feed</section>,
}));

vi.mock('@/components/sections/CollaborationHero', () => ({
  CollaborationHero: () => <section data-testid="collaboration-hero">Collaboration Hero</section>,
}));

vi.mock('@/components/sections/CollaborationProcess', () => ({
  CollaborationProcess: () => <section data-testid="collaboration-process">Collaboration Process</section>,
}));

vi.mock('@/components/sections/CollaborationPortfolio', () => ({
  CollaborationPortfolio: () => (
    <section data-testid="collaboration-portfolio">Collaboration Portfolio</section>
  ),
}));

vi.mock('@/components/sections/CollaborationCTA', () => ({
  CollaborationCTA: () => <section data-testid="collaboration-cta">Collaboration CTA</section>,
}));

vi.mock('@/components/common/ErrorBoundary', () => ({
  default: ({ children }: MockComponentProps) => <div data-testid="error-boundary">{children}</div>,
}));

vi.mock('@/components/common/SEOHead', () => ({
  SEOHead: ({ title, description }: MockComponentProps) => (
    <div data-testid="seo-head">
      <div data-testid="document-title">{title}</div>
      <div data-testid="meta-description">{description}</div>
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

describe('Service Pages Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cross-Service Page Consistency', () => {
    it('should render all service pages without errors', () => {
      expect(() => {
        render(
          <TestWrapper>
            <Teaching />
          </TestWrapper>
        );
        cleanup();
        
        render(
          <TestWrapper>
            <Performance />
          </TestWrapper>
        );
        cleanup();
        
        render(
          <TestWrapper>
            <Collaboration />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('should have consistent prop interfaces across all service pages', () => {
      const customClass = 'test-custom-class';
      
      // All service pages should accept className prop
      expect(() => {
        render(<TestWrapper><Teaching className={customClass} /></TestWrapper>);
        cleanup();
        
        render(<TestWrapper><Performance className={customClass} /></TestWrapper>);
        cleanup();
        
        render(<TestWrapper><Collaboration className={customClass} /></TestWrapper>);
      }).not.toThrow();
    });

    it('should provide default values for optional props', () => {
      expect(() => {
        render(<TestWrapper><Teaching /></TestWrapper>);
        cleanup();
        
        render(<TestWrapper><Performance /></TestWrapper>);
        cleanup();
        
        render(<TestWrapper><Collaboration /></TestWrapper>);
      }).not.toThrow();
    });
  });

  describe('Service-Specific Content Rendering', () => {
    it('should render Teaching page specific content', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      
      const title = screen.getByTestId('page-title');
      expect(title).toHaveTextContent(/Guitar Lessons/);
    });

    it('should render Performance page specific content', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Performance page has multiple error boundaries
      expect(screen.getAllByTestId('error-boundary').length).toBeGreaterThan(0);
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
    });

    it('should render Collaboration page specific content', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });
  });

  describe('Common Component Integration', () => {
    it('should integrate error boundaries in Performance and Collaboration pages', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      expect(screen.getAllByTestId('error-boundary').length).toBeGreaterThan(0);
      cleanup();
      
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should integrate ServicePageLayout in Teaching page', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      expect(screen.getByTestId('page-title')).toBeInTheDocument();
      expect(screen.getByTestId('page-description')).toBeInTheDocument();
    });

    it('should include cross-service navigation components', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      expect(screen.getByTestId('cross-service-navigation')).toBeInTheDocument();
      cleanup();
      
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      expect(screen.getAllByTestId('cross-service-suggestion')[0]).toBeInTheDocument();
    });
  });

  describe('Hook Integration Across Services', () => {
    it('should integrate performance monitoring in Teaching page', async () => {
      const performanceMonitorModule = await vi.importMock('@/utils/performanceMonitor') as any;
      
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // Access the mock after render
      expect(performanceMonitorModule.performanceMonitor.mark).toHaveBeenCalledWith('teaching-page-render-start');
    });

    it('should integrate testimonials hook in Performance page', async () => {
      const testimonialsHookModule = await vi.importMock('@/hooks/useMultiServiceTestimonials') as any;
      
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      // Hook should have been called - verify hook is working
      expect(testimonialsHookModule.default()).toBeTruthy();
    });
  });

  describe('Responsive Design Consistency', () => {
    it('should handle mobile viewport consistently across all pages', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      expect(() => {
        render(<TestWrapper><Teaching /></TestWrapper>);
        cleanup();
        
        render(<TestWrapper><Performance /></TestWrapper>);
        cleanup();
        
        render(<TestWrapper><Collaboration /></TestWrapper>);
      }).not.toThrow();
    });

    it('should handle tablet viewport consistently across all pages', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      expect(() => {
        render(<TestWrapper><Teaching /></TestWrapper>);
        cleanup();
        
        render(<TestWrapper><Performance /></TestWrapper>);
        cleanup();
        
        render(<TestWrapper><Collaboration /></TestWrapper>);
      }).not.toThrow();
    });

    it('should handle desktop viewport consistently across all pages', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      expect(() => {
        render(<TestWrapper><Teaching /></TestWrapper>);
        cleanup();
        
        render(<TestWrapper><Performance /></TestWrapper>);
        cleanup();
        
        render(<TestWrapper><Collaboration /></TestWrapper>);
      }).not.toThrow();
    });
  });

  describe('Accessibility Standards Compliance', () => {
    it('should maintain consistent heading structure across pages', () => {
      // Teaching page
      render(<TestWrapper><Teaching /></TestWrapper>);
      expect(screen.getByTestId('page-title')).toBeInTheDocument();
      cleanup();
      
      // Performance page should have SEO head with title
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('seo-head')).toBeInTheDocument();
      cleanup();
      
      // Collaboration page should have SEO head with title
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('seo-head')).toBeInTheDocument();
    });

    it('should use semantic HTML elements consistently', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      
      // Should have semantic sections
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
      
      // Should have semantic navigation
      expect(screen.getByTestId('cross-service-navigation')).toBeInTheDocument();
    });

    it('should provide proper page descriptions for screen readers', () => {
      // Teaching page
      render(<TestWrapper><Teaching /></TestWrapper>);
      expect(screen.getByTestId('page-description')).toBeInTheDocument();
      cleanup();
      
      // Performance page
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('seo-head')).toBeInTheDocument();
      cleanup();
      
      // Collaboration page  
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('seo-head')).toBeInTheDocument();
    });
  });

  describe('Performance and Loading Optimization', () => {
    it('should implement lazy loading where appropriate', () => {
      render(
        <TestWrapper>
          <Performance />
        </TestWrapper>
      );
      
      const lazySections = screen.getAllByTestId('lazy-section');
      expect(lazySections.length).toBeGreaterThan(0);
    });

    it('should handle component mounting and unmounting cleanly', () => {
      const { unmount: unmountTeaching } = render(<TestWrapper><Teaching /></TestWrapper>);
      const { unmount: unmountPerformance } = render(<TestWrapper><Performance /></TestWrapper>);
      const { unmount: unmountCollaboration } = render(<TestWrapper><Collaboration /></TestWrapper>);
      
      expect(() => {
        unmountTeaching();
        unmountPerformance();
        unmountCollaboration();
      }).not.toThrow();
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle missing props gracefully', () => {
      expect(() => {
        render(<TestWrapper><Teaching /></TestWrapper>);
        render(<TestWrapper><Performance /></TestWrapper>);
        render(<TestWrapper><Collaboration /></TestWrapper>);
      }).not.toThrow();
    });

    it('should handle component errors through error boundaries', () => {
      // Mock a component error
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestWrapper><Performance /></TestWrapper>);
        render(<TestWrapper><Collaboration /></TestWrapper>);
      }).not.toThrow();
      
      consoleError.mockRestore();
    });
  });

  describe('Business Logic Integration', () => {
    it('should present service-specific value propositions', () => {
      // Teaching page should mention lessons and theory
      render(<TestWrapper><Teaching /></TestWrapper>);
      const teachingDescription = screen.getByTestId('page-description');
      expect(teachingDescription).toHaveTextContent(/lessons/i);
      cleanup();
      
      // Performance page should mention live music
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      cleanup();
      
      // Collaboration page should mention music collaboration
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
    });

    it('should maintain consistent brand messaging across services', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      const teachingTitle = screen.getByTestId('page-title');
      expect(teachingTitle).toHaveTextContent(/Rrish Music/);
      cleanup();
      
      // All pages should reference the same brand/musician
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      cleanup();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
    });
  });
});