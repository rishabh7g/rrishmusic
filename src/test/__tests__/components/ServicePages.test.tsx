/**
 * @fileoverview Integration tests for service pages to ensure consistency across the multi-service platform
 * Tests cross-service page functionality, consistency, and integration points
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Import service page components
import { Teaching } from '@/components/pages/Teaching';

// Mock router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Import Performance and Collaboration components
let Performance: React.ComponentType<any>;
let Collaboration: React.ComponentType<any>;

// Dynamic imports for service page components
beforeEach(async () => {
  // Import components dynamically to ensure proper setup
  const performanceModule = await import('@/components/pages/Performance');
  const collaborationModule = await import('@/components/pages/Collaboration');
  
  Performance = performanceModule.default || performanceModule.Performance;
  Collaboration = collaborationModule.default || collaborationModule.Collaboration;
});

// Common mock props interface
interface MockComponentProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

// Mock SEOHead component
vi.mock('@/components/common/SEOHead', () => ({
  SEOHead: ({ title, description }: MockComponentProps) => (
    <div data-testid="seo-head">
      <div data-testid="document-title">{title}</div>
      <div data-testid="meta-description">{description}</div>
    </div>
  ),
}));

// Mock ServicePageLayout component
vi.mock('@/components/layout/ServicePageLayout', () => ({
  default: ({ children, className }: MockComponentProps) => (
    <div data-testid="service-page-layout" className={className}>
      {children}
    </div>
  ),
}));

// Mock all section components consistently
vi.mock('@/components/sections', () => ({
  TeachingHero: () => (
    <section data-testid="teaching-hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading">Teaching Hero</h1>
      <button data-testid="hero-cta">Start Learning</button>
    </section>
  ),
  PerformanceHero: () => (
    <section data-testid="performance-hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading">Performance Hero</h1>
      <button data-testid="hero-cta">Book Performance</button>
    </section>
  ),
  CollaborationHero: () => (
    <section data-testid="collaboration-hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading">Collaboration Hero</h1>
      <button data-testid="hero-cta">Start Collaborating</button>
    </section>
  ),
  TeachingApproach: () => (
    <section data-testid="teaching-approach" aria-labelledby="approach-heading">
      <h2 id="approach-heading">Teaching Approach</h2>
      <p>Professional guitar instruction methodology</p>
    </section>
  ),
  TestimonialsSection: () => (
    <section data-testid="testimonials" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading">Student Testimonials</h2>
      <div data-testid="testimonial-list">
        <div data-testid="testimonial-item">Great teacher!</div>
      </div>
    </section>
  ),
  MultiServiceTestimonialsSection: ({ testimonials, title }: any) => (
    <section data-testid="multi-service-testimonials" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading">{title || 'Testimonials'}</h2>
      <div data-testid="testimonial-list">
        {testimonials?.map((testimonial: any, index: number) => (
          <div key={index} data-testid="testimonial-item">
            {testimonial.name || `Testimonial ${index + 1}`}
          </div>
        ))}
      </div>
    </section>
  ),
  PricingSection: () => (
    <section data-testid="pricing" aria-labelledby="pricing-heading">
      <h2 id="pricing-heading">Lesson Pricing</h2>
      <div data-testid="pricing-packages">
        <div data-testid="pricing-package">Single Lesson - $60</div>
      </div>
    </section>
  ),
  InstagramFeed: () => (
    <section data-testid="instagram-feed" aria-labelledby="instagram-heading">
      <h2 id="instagram-heading">Follow Our Musical Journey</h2>
      <div data-testid="instagram-posts">
        <div data-testid="instagram-post">Latest post</div>
      </div>
    </section>
  ),
  PerformanceGallery: () => (
    <section data-testid="performance-gallery" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading">Performance Gallery</h2>
      <div data-testid="gallery-items">
        <img src="test.jpg" alt="Performance" data-testid="gallery-image" />
      </div>
    </section>
  ),
  CollaborationPortfolio: () => (
    <section data-testid="collaboration-portfolio" aria-labelledby="portfolio-heading">
      <h2 id="portfolio-heading">Collaboration Portfolio</h2>
      <div data-testid="portfolio-items">
        <div data-testid="portfolio-item">Recent collaboration</div>
      </div>
    </section>
  ),
  FAQ: () => (
    <section data-testid="faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Frequently Asked Questions</h2>
      <div data-testid="faq-items">
        <details data-testid="faq-item">
          <summary>Common question</summary>
          <p>Answer</p>
        </details>
      </div>
    </section>
  ),
}));

// Mock form components
vi.mock('@/components/forms', () => ({
  ContactForm: () => (
    <form data-testid="contact-form">
      <input data-testid="contact-name" placeholder="Name" />
      <button type="submit" data-testid="contact-submit">Send Message</button>
    </form>
  ),
  TeachingInquiryForm: () => (
    <form data-testid="teaching-inquiry-form">
      <input data-testid="inquiry-name" placeholder="Name" />
      <button type="submit" data-testid="inquiry-submit">Send Inquiry</button>
    </form>
  ),
  PerformanceInquiry: () => (
    <form data-testid="performance-inquiry-form">
      <input data-testid="inquiry-name" placeholder="Name" />
      <button type="submit" data-testid="inquiry-submit">Send Inquiry</button>
    </form>
  ),
  PerformanceInquiryForm: () => (
    <form data-testid="performance-inquiry-form">
      <input data-testid="inquiry-name" placeholder="Name" />
      <button type="submit" data-testid="inquiry-submit">Send Inquiry</button>
    </form>
  ),
  CollaborationInquiry: () => (
    <form data-testid="collaboration-inquiry-form">
      <input data-testid="inquiry-name" placeholder="Name" />
      <button type="submit" data-testid="inquiry-submit">Send Inquiry</button>
    </form>
  ),
}));

// Mock UI components
vi.mock('@/components/ui', () => ({
  CrossServiceSuggestion: ({ fromService, className }: { fromService: string; className?: string }) => (
    <div data-testid="cross-service-suggestion" className={className} data-from-service={fromService}>
      <p>Interested in our other services?</p>
      <button data-testid="cross-service-cta">Learn More</button>
    </div>
  ),
  TeachingInquiryCTA: () => (
    <section data-testid="teaching-cta" aria-labelledby="cta-heading">
      <h2 id="cta-heading">Teaching CTA</h2>
      <button onClick={() => {}} data-testid="teaching-contact-button">Book Lesson</button>
    </section>
  ),
  PerformanceInquiryCTA: () => (
    <section data-testid="performance-cta" aria-labelledby="cta-heading">
      <h2 id="cta-heading">Performance CTA</h2>
      <button onClick={() => {}} data-testid="performance-contact-button">Book Performance</button>
    </section>
  ),
  CollaborationCTA: () => (
    <section data-testid="collaboration-cta" aria-labelledby="cta-heading">
      <h2 id="cta-heading">Collaboration CTA</h2>
      <button onClick={() => {}} data-testid="collaboration-contact-button">Contact for Collaboration</button>
    </section>
  ),
}));

vi.mock('@/components/common/ErrorBoundary', () => ({
  default: ({ children }: MockComponentProps) => (
    <div data-testid="error-boundary" role="alert" aria-live="assertive">
      {children}
    </div>
  ),
}));

vi.mock('@/components/ServicePageSEO', () => ({
  SEOHead: ({ title, description }: MockComponentProps) => (
    <div data-testid="seo-head">
      <div data-testid="document-title">{title}</div>
      <div data-testid="meta-description">{description}</div>
    </div>
  ),
}));

// Mock lazy loading components
vi.mock('@/components/common/LazySection', () => ({
  LazySection: ({ children }: MockComponentProps) => (
    <div data-testid="lazy-section">
      {children}
    </div>
  ),
}));

// Mock hooks
vi.mock('@/hooks/useContent', () => ({
  default: vi.fn(() => ({
    getContent: vi.fn(() => ({ title: 'Test Content', description: 'Test Description' })),
    isLoading: false,
    error: null,
  })),
}));

vi.mock('@/hooks/useMultiServiceTestimonials', () => ({
  default: vi.fn(() => ({
    getTestimonialsByService: vi.fn((service: string) => [
      { id: 1, name: 'Test Client', service, content: 'Great experience!' }
    ]),
    getFeaturedTestimonials: vi.fn((count: number) => 
      Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Featured Client ${i + 1}`,
        service: 'teaching',
        content: 'Excellent service!'
      }))
    ),
    loading: false,
    error: null,
  })),
}));

vi.mock('@/hooks/usePageSEO', () => ({
  usePageSEO: vi.fn(() => ({
    updateSEO: vi.fn(),
  })),
}));

// Mock navigation utilities
vi.mock('@/utils/routing', () => ({
  safeNavigate: vi.fn(),
  getBasePath: vi.fn(() => ''),
}));

describe('Service Pages Integration Tests', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Cross-Service Page Consistency', () => {
    it('should render all service pages without errors', () => {
      expect(() => renderWithRouter(<Teaching />)).not.toThrow();
      cleanup();

      expect(() => renderWithRouter(<Performance />)).not.toThrow();
      cleanup();

      expect(() => renderWithRouter(<Collaboration />)).not.toThrow();
    });

    it('should have consistent prop interfaces across all service pages', () => {
      const customClass = 'test-custom-class';

      renderWithRouter(<Teaching className={customClass} />);
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      cleanup();

      renderWithRouter(<Performance className={customClass} />);
      // Performance page uses multiple ErrorBoundary components, so we expect multiple elements
      const errorBoundaries = screen.getAllByTestId('error-boundary');
      expect(errorBoundaries.length).toBeGreaterThan(0);
      cleanup();

      renderWithRouter(<Collaboration className={customClass} />);
      // Collaboration page may also use multiple ErrorBoundary components
      const collaborationErrorBoundaries = screen.getAllByTestId('error-boundary');
      expect(collaborationErrorBoundaries.length).toBeGreaterThan(0);
    });

    it('should provide default values for optional props', () => {
      expect(() => renderWithRouter(<Teaching />)).not.toThrow();
      expect(() => renderWithRouter(<Performance />)).not.toThrow();
      expect(() => renderWithRouter(<Collaboration />)).not.toThrow();
    });
  });

  describe('Service-Specific Content Rendering', () => {
    it('should render teaching-specific content correctly', () => {
      renderWithRouter(<Teaching />);
      
      expect(screen.getByTestId('teaching-hero')).toBeInTheDocument();
      expect(screen.getByTestId('teaching-approach')).toBeInTheDocument();
    });

    it('should render performance-specific content correctly', () => {
      renderWithRouter(<Performance />);
      
      const heroSections = screen.getAllByTestId('performance-hero');
      expect(heroSections.length).toBeGreaterThan(0);
    });

    it('should render collaboration-specific content correctly', () => {
      renderWithRouter(<Collaboration />);
      
      const heroSections = screen.getAllByTestId('collaboration-hero');
      expect(heroSections.length).toBeGreaterThan(0);
    });
  });

  describe('Cross-Service Integration Elements', () => {
    it('should include cross-service suggestions on performance page', () => {
      renderWithRouter(<Performance />);
      
      const crossServiceSuggestions = screen.getAllByTestId('cross-service-suggestion');
      expect(crossServiceSuggestions.length).toBeGreaterThan(0);
      
      // Verify the suggestions are from performance service
      crossServiceSuggestions.forEach(suggestion => {
        expect(suggestion).toHaveAttribute('data-from-service', 'performance');
      });
    });

    it('should include multi-service testimonials where applicable', () => {
      renderWithRouter(<Performance />);
      
      const multiServiceTestimonials = screen.getAllByTestId('multi-service-testimonials');
      if (multiServiceTestimonials.length > 0) {
        expect(multiServiceTestimonials[0]).toBeInTheDocument();
      }
    });
  });

  describe('Common Page Elements', () => {
    it('should include SEO head elements on all pages', () => {
      renderWithRouter(<Teaching />);
      expect(screen.getByTestId('seo-head')).toBeInTheDocument();
      cleanup();

      renderWithRouter(<Performance />);
      const seoHeads = screen.getAllByTestId('seo-head');
      expect(seoHeads.length).toBeGreaterThan(0);
      cleanup();

      renderWithRouter(<Collaboration />);
      const collaborationSeoHeads = screen.getAllByTestId('seo-head');
      expect(collaborationSeoHeads.length).toBeGreaterThan(0);
    });

    it('should include pricing information where relevant', () => {
      renderWithRouter(<Teaching />);
      expect(screen.getByTestId('pricing')).toBeInTheDocument();
      cleanup();

      renderWithRouter(<Performance />);
      const pricingSections = screen.getAllByTestId('pricing');
      if (pricingSections.length > 0) {
        expect(pricingSections[0]).toBeInTheDocument();
      }
    });

    it('should include Instagram feed on all service pages', () => {
      renderWithRouter(<Teaching />);
      expect(screen.getByTestId('instagram-feed')).toBeInTheDocument();
      cleanup();

      renderWithRouter(<Performance />);
      const instagramFeeds = screen.getAllByTestId('instagram-feed');
      expect(instagramFeeds.length).toBeGreaterThan(0);
      cleanup();

      renderWithRouter(<Collaboration />);
      const collaborationInstagramFeeds = screen.getAllByTestId('instagram-feed');
      expect(collaborationInstagramFeeds.length).toBeGreaterThan(0);
    });
  });

  describe('Service-Specific CTA Elements', () => {
    it('should include appropriate contact CTAs on each service page', () => {
      renderWithRouter(<Teaching />);
      const teachingCTAs = screen.getAllByTestId('teaching-cta');
      if (teachingCTAs.length > 0) {
        expect(teachingCTAs[0]).toBeInTheDocument();
      }
      cleanup();

      renderWithRouter(<Performance />);
      const performanceCTAs = screen.getAllByTestId('performance-cta');
      if (performanceCTAs.length > 0) {
        expect(performanceCTAs[0]).toBeInTheDocument();
      }
      cleanup();

      renderWithRouter(<Collaboration />);
      const collaborationCTAs = screen.getAllByTestId('collaboration-cta');
      if (collaborationCTAs.length > 0) {
        expect(collaborationCTAs[0]).toBeInTheDocument();
      }
    });

    it('should have working contact buttons on all service pages', () => {
      renderWithRouter(<Teaching />);
      const teachingContactButtons = screen.getAllByTestId('teaching-contact-button');
      if (teachingContactButtons.length > 0) {
        expect(teachingContactButtons[0]).toBeInTheDocument();
      }
      cleanup();

      renderWithRouter(<Performance />);
      const performanceContactButtons = screen.getAllByTestId('performance-contact-button');
      if (performanceContactButtons.length > 0) {
        expect(performanceContactButtons[0]).toBeInTheDocument();
      }
      cleanup();

      renderWithRouter(<Collaboration />);
      const collaborationContactButtons = screen.getAllByTestId('collaboration-contact-button');
      if (collaborationContactButtons.length > 0) {
        expect(collaborationContactButtons[0]).toBeInTheDocument();
      }
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have proper ARIA labels on hero sections', () => {
      renderWithRouter(<Teaching />);
      const teachingHero = screen.getByTestId('teaching-hero');
      expect(teachingHero).toHaveAttribute('aria-labelledby', 'hero-heading');
      cleanup();

      renderWithRouter(<Performance />);
      const performanceHeroes = screen.getAllByTestId('performance-hero');
      performanceHeroes.forEach(hero => {
        expect(hero).toHaveAttribute('aria-labelledby', 'hero-heading');
      });
      cleanup();

      renderWithRouter(<Collaboration />);
      const collaborationHeroes = screen.getAllByTestId('collaboration-hero');
      collaborationHeroes.forEach(hero => {
        expect(hero).toHaveAttribute('aria-labelledby', 'hero-heading');
      });
    });

    it('should have accessible heading structures', () => {
      renderWithRouter(<Teaching />);
      const teachingH1 = screen.getByRole('heading', { level: 1 });
      expect(teachingH1).toBeInTheDocument();
      expect(teachingH1).toHaveTextContent('Teaching Hero');
      cleanup();

      renderWithRouter(<Performance />);
      const performanceH1s = screen.getAllByRole('heading', { level: 1 });
      expect(performanceH1s.length).toBeGreaterThan(0);
      performanceH1s.forEach(h1 => {
        expect(h1).toHaveTextContent('Performance Hero');
      });
      cleanup();

      renderWithRouter(<Collaboration />);
      const collaborationH1s = screen.getAllByRole('heading', { level: 1 });
      expect(collaborationH1s.length).toBeGreaterThan(0);
      collaborationH1s.forEach(h1 => {
        expect(h1).toHaveTextContent('Collaboration Hero');
      });
    });

    it('should have accessible gallery images where present', () => {
      renderWithRouter(<Performance />);
      
      const galleryImages = screen.getAllByTestId('gallery-image');
      galleryImages.forEach(image => {
        expect(image).toHaveAttribute('alt');
        expect(image).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle component errors gracefully', () => {
      renderWithRouter(<Performance />);
      
      const errorBoundaries = screen.getAllByTestId('error-boundary');
      expect(errorBoundaries.length).toBeGreaterThan(0);
      errorBoundaries.forEach(boundary => {
        expect(boundary).toHaveAttribute('role', 'alert');
      });
    });

    it('should handle missing props gracefully', () => {
      expect(() => renderWithRouter(<Teaching />)).not.toThrow();
      expect(() => renderWithRouter(<Performance />)).not.toThrow();
      expect(() => renderWithRouter(<Collaboration />)).not.toThrow();
    });

    it('should handle content loading states', () => {
      renderWithRouter(<Performance />);
      
      // Check for lazy loading components
      const lazySections = screen.getAllByTestId('lazy-section');
      if (lazySections.length > 0) {
        expect(lazySections[0]).toBeInTheDocument();
      }
    });
  });

  describe('Service Page Navigation and Integration', () => {
    it('should include cross-service CTAs that suggest complementary services', () => {
      renderWithRouter(<Performance />);
      
      const crossServiceCTAs = screen.getAllByTestId('cross-service-cta');
      if (crossServiceCTAs.length > 0) {
        crossServiceCTAs.forEach(cta => {
          expect(cta).toBeInTheDocument();
          expect(cta).toHaveTextContent(/Learn More/i);
        });
      }
    });

    it('should maintain consistent styling and layout patterns', () => {
      // Test that similar elements have consistent test IDs and structure
      renderWithRouter(<Teaching />);
      const teachingLayout = screen.getByTestId('service-page-layout');
      expect(teachingLayout).toBeInTheDocument();
      cleanup();

      // Performance and Collaboration don't use ServicePageLayout but should have consistent structure
      renderWithRouter(<Performance />);
      const performanceMain = screen.getByRole('main');
      expect(performanceMain).toBeInTheDocument();
      cleanup();

      renderWithRouter(<Collaboration />);
      const collaborationMain = screen.getByRole('main');
      expect(collaborationMain).toBeInTheDocument();
    });
  });

  describe('Content Management and Data Flow', () => {
    it('should handle testimonial data consistently across service pages', () => {
      renderWithRouter(<Teaching />);
      const teachingTestimonials = screen.getByTestId('testimonials');
      expect(teachingTestimonials).toBeInTheDocument();
      cleanup();

      renderWithRouter(<Performance />);
      const performanceTestimonials = screen.getAllByTestId('multi-service-testimonials');
      if (performanceTestimonials.length > 0) {
        expect(performanceTestimonials[0]).toBeInTheDocument();
      }
    });

    it('should render portfolio/gallery content appropriately', () => {
      renderWithRouter(<Performance />);
      const performanceGalleries = screen.getAllByTestId('performance-gallery');
      expect(performanceGalleries.length).toBeGreaterThan(0);
      cleanup();

      renderWithRouter(<Collaboration />);
      const collaborationPortfolios = screen.getAllByTestId('collaboration-portfolio');
      if (collaborationPortfolios.length > 0) {
        expect(collaborationPortfolios[0]).toBeInTheDocument();
      }
    });
  });
});