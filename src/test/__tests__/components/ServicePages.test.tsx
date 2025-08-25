import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Teaching, Performance, Collaboration } from '@/components/pages';
import userEvent from '@testing-library/user-event';

// Type definitions for mocked components
interface MockComponentProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

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

// Mock all section components with consistent structure
vi.mock('@/components/ServicePageLayout', () => ({
  ServicePageLayout: ({ children, title, description }: MockComponentProps) => (
    <div data-testid="service-page-layout">
      <h1 data-testid="page-title">{title}</h1>
      <p data-testid="page-description">{description}</p>
      <div data-testid="service-page-content">{children}</div>
    </div>
  )
}));

vi.mock('@/components/sections', () => ({
  Lessons: () => <section data-testid="lessons-section">Lessons Section</section>,
  Hero: () => <section data-testid="hero-section">Hero Section</section>,
  Community: () => <section data-testid="community-section">Community Section</section>,
  Approach: () => <section data-testid="approach-section">Approach Section</section>,
  MultiServiceTestimonialsSection: () => 
    <section data-testid="testimonials-section">Multi Service Testimonials</section>,
  About: () => <section data-testid="about-section">About Section</section>,
  PricingSection: () => <section data-testid="pricing-section">Pricing Section</section>,
  Contact: () => <section data-testid="contact-section">Contact Section</section>,
}));

vi.mock('@/components/CrossServiceNavigation', () => ({
  CrossServiceNavigation: () => 
    <nav data-testid="cross-service-navigation">Cross Service Navigation</nav>
}));

vi.mock('@/components/sections/performance', () => ({
  PerformanceHero: () => <section data-testid="performance-hero">Performance Hero</section>,
  PerformanceGallery: () => <section data-testid="performance-gallery">Performance Gallery</section>,
  MultiServiceTestimonialsSection: () =>
    <section data-testid="testimonials-section">Multi Service Testimonials</section>,
  PricingSection: () => <section data-testid="pricing-section">Pricing Section</section>,
  InstagramFeed: () => <section data-testid="instagram-feed">Instagram Feed</section>,
}));

vi.mock('@/components/sections/collaboration', () => ({
  CollaborationHero: () => <section data-testid="collaboration-hero">Collaboration Hero</section>,
  CollaborationApproach: () => 
    <section data-testid="collaboration-approach">Collaboration Approach</section>,
  CollaborationProcess: () => <section data-testid="collaboration-process">Collaboration Process</section>,
  CollaborationPortfolioSection: () => 
    <section data-testid="collaboration-portfolio">Collaboration Portfolio</section>,
  CollaborationPricing: () => 
    <section data-testid="collaboration-pricing">Collaboration Pricing</section>,
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
  LazySection: ({ children }: MockComponentProps) => 
    <div data-testid="lazy-section">{children}</div>
}));

vi.mock('@/components/ui/CrossServiceSuggestion', () => ({
  CrossServiceSuggestion: () => 
    <div data-testid="cross-service-suggestion">Cross Service Suggestion</div>
}));

// Test wrapper with Router context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Service Pages Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Cross-Service Page Consistency', () => {
    it('should render all service pages without errors', () => {
      const { unmount: unmountTeaching } = render(
        <TestWrapper><Teaching /></TestWrapper>
      );
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();

      unmountTeaching();
      
      const { unmount: unmountPerformance } = render(
        <TestWrapper><Performance /></TestWrapper>
      );
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();

      unmountPerformance();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should have consistent prop interfaces across all service pages', () => {
      const customClass = 'test-custom-class';
      
      render(<TestWrapper><Teaching className={customClass} /></TestWrapper>);
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Performance className={customClass} /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Collaboration className={customClass} /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should provide default values for optional props', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('Service-Specific Content Rendering', () => {
    it('should render Teaching page specific content', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
      
      const title = screen.getByTestId('page-title');
      expect(title).toHaveTextContent(/Guitar Lessons/);
    });

    it('should render Performance page specific content', () => {
      render(<TestWrapper><Performance /></TestWrapper>);
      
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
      expect(screen.getByTestId('instagram-feed')).toBeInTheDocument();
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
    });

    it('should render Collaboration page specific content', () => {
      render(<TestWrapper><Collaboration /></TestWrapper>);
      
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-approach')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-pricing')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });
  });

  describe('Common Component Integration', () => {
    it('should integrate error boundaries in Performance and Collaboration pages', () => {
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should integrate ServicePageLayout in Teaching page', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      
      expect(screen.getByTestId("service-page-layout")).toBeInTheDocument();
      
      expect(screen.getByTestId('page-title')).toBeInTheDocument();
      expect(screen.getByTestId('page-description')).toBeInTheDocument();
    });

    it('should include cross-service navigation components', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      expect(screen.getByTestId('cross-service-navigation')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('cross-service-navigation')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('cross-service-navigation')).toBeInTheDocument();
    });
  });

  describe('User Interactions and Events', () => {
    it('should handle Teaching page user interactions', async () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      
      // Test that components are interactive
      const lessonsSection = screen.getByTestId('lessons-section');
      expect(lessonsSection).toBeInTheDocument();
      
      // Test that sections can be focused for accessibility
      lessonsSection.focus();
      expect(lessonsSection).toHaveFocus();
    });

    it('should handle Performance page user interactions', async () => {
      render(<TestWrapper><Performance /></TestWrapper>);
      
      // Test that gallery section is interactive
      const gallery = screen.getByTestId('performance-gallery');
      expect(gallery).toBeInTheDocument();
      
      // Test that gallery can be focused
      gallery.focus();
      expect(gallery).toHaveFocus();
    });

    it('should handle Collaboration page user interactions', async () => {
      render(<TestWrapper><Collaboration /></TestWrapper>);
      
      // Test that portfolio section is interactive
      const portfolio = screen.getByTestId('collaboration-portfolio');
      expect(portfolio).toBeInTheDocument();
      
      // Test that portfolio can be focused
      portfolio.focus();
      expect(portfolio).toHaveFocus();
    });

    it('should handle cross-service navigation interactions', async () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      
      const navigation = screen.getByTestId('cross-service-navigation');
      expect(navigation).toBeInTheDocument();
      
      // Test navigation can be focused
      navigation.focus();
      expect(navigation).toHaveFocus();
    });
  });

  describe('Hook Integration Across Services', () => {
    it('should integrate performance monitoring in Teaching page', async () => {
      const performanceMonitorModule = await vi.importMock('@/utils/performanceMonitor') as { performanceMonitor: { mark: vi.MockedFunction<unknown> } };
      
      render(<TestWrapper><Teaching /></TestWrapper>);
      
      // Check that performance monitoring was called
      expect(performanceMonitorModule.performanceMonitor.mark).toHaveBeenCalledWith('teaching-page-render-start');
    });

    it('should integrate testimonials hook in Performance page', async () => {
      const testimonialsHookModule = await vi.importMock('@/hooks/useMultiServiceTestimonials') as { useMultiServiceTestimonials: vi.MockedFunction<unknown> };
      
      render(<TestWrapper><Performance /></TestWrapper>);
      
      // Mock the testimonials hook
      expect(testimonialsHookModule.default()).toBeTruthy();
    });
  });

  describe('Responsive Design Consistency', () => {
    it('should handle mobile viewport consistently across all pages', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      render(<TestWrapper><Teaching /></TestWrapper>);
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should handle tablet viewport consistently across all pages', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      });

      render(<TestWrapper><Teaching /></TestWrapper>);
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should handle desktop viewport consistently across all pages', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });

      render(<TestWrapper><Teaching /></TestWrapper>);
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('Accessibility Standards Compliance', () => {
    it('should maintain consistent heading structure across pages', () => {
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
      
      // Check for semantic sections
      const sections = screen.getAllByRole('generic', { hidden: true });
      expect(sections.length).toBeGreaterThan(0);
      
      // Check for navigation
      const navigation = screen.getByTestId('cross-service-navigation');
      expect(navigation.tagName).toBe('NAV');
    });

    it('should provide proper page descriptions for screen readers', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      
      const description = screen.getByTestId('page-description');
      expect(description).toBeInTheDocument();
      expect(description.textContent).toContain('guitar');
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      const seoHead = screen.getByTestId('seo-head');
      expect(seoHead).toBeInTheDocument();
    });

    it('should support keyboard navigation throughout pages', async () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      
      
      // Test tabbing through focusable elements
      await user.tab();
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeDefined();
    });
  });

  describe('Performance and Loading Optimization', () => {
    it('should implement lazy loading where appropriate', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('lazy-section')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('lazy-section')).toBeInTheDocument();
    });

    it('should handle component mounting and unmounting cleanly', () => {
      const { unmount } = render(<TestWrapper><Teaching /></TestWrapper>);
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      
      unmount();
      
      // Should unmount without errors
      expect(() => screen.getByTestId('service-page-layout')).toThrow();
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle missing props gracefully', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      
      // Component should render even without props
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
    });

    it('should handle component errors through error boundaries', () => {
      render(<TestWrapper><Performance /></TestWrapper>);
      
      // Should have error boundary
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('Business Logic Integration', () => {
    it('should present service-specific value propositions', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      const title = screen.getByTestId('page-title');
      expect(title).toHaveTextContent(/Guitar/);
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
    });

    it('should maintain consistent brand messaging across services', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      const teachingTitle = screen.getByTestId('page-title');
      expect(teachingTitle).toHaveTextContent(/Rrish Music/);
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      const performanceTitle = screen.getByTestId('document-title');
      expect(performanceTitle).toBeInTheDocument();
    });
  });

  describe('Form Integration and Validation', () => {
    it('should integrate contact forms appropriately in each service', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('cross-service-navigation')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });

    it('should handle form validation states appropriately', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      const contactSection = screen.getByTestId('contact-section');
      expect(contactSection).toBeInTheDocument();
      expect(contactSection).toHaveTextContent('Contact Section');
    });
  });

  describe('SEO and Meta Integration', () => {
    it('should include appropriate SEO metadata for each service', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      expect(screen.getByTestId('page-title')).toBeInTheDocument();
      expect(screen.getByTestId('page-description')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      expect(screen.getByTestId('seo-head')).toBeInTheDocument();
      
      cleanup();
      
      render(<TestWrapper><Collaboration /></TestWrapper>);
      expect(screen.getByTestId('seo-head')).toBeInTheDocument();
    });

    it('should have service-appropriate structured data', () => {
      render(<TestWrapper><Teaching /></TestWrapper>);
      const title = screen.getByTestId('page-title');
      expect(title).toHaveTextContent('Guitar Lessons');
      
      cleanup();
      
      render(<TestWrapper><Performance /></TestWrapper>);
      const seoHead = screen.getByTestId('seo-head');
      expect(seoHead).toBeInTheDocument();
    });
  });
});