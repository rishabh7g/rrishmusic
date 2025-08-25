import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  onClick?: () => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
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
    getTestimonialsByService: vi.fn(() => [
      { id: 1, service: 'teaching', content: 'Great teacher!', author: 'John' },
      { id: 2, service: 'performance', content: 'Amazing performance!', author: 'Jane' }
    ]),
    getFeaturedTestimonials: vi.fn(() => [
      { id: 3, content: 'Excellent musician!', author: 'Bob' }
    ]),
    loading: false,
  }),
}));

vi.mock('@/hooks/useContent', () => ({
  useContent: () => ({
    teaching: {
      title: 'Guitar Lessons with Rrish Music',
      description: 'Professional guitar instruction',
      keywords: 'guitar lessons, music teacher'
    },
    performance: {
      title: 'Live Performances by Rrish Music',
      description: 'Professional live music performances',
      keywords: 'live music, performances'
    },
    collaboration: {
      title: 'Music Collaboration Services',
      description: 'Professional music collaboration',
      keywords: 'music collaboration, studio work'
    }
  }),
  useSEO: () => ({
    data: {
      title: 'Rrish Music',
      description: 'Professional music services',
      keywords: 'music, performance, collaboration'
    },
    generatePageTitle: (title: string) => `${title} | Rrish Music`
  }),
}));

vi.mock('@/hooks/useInstagram', () => ({
  useInstagram: () => ({
    posts: [
      { id: 1, media_url: '/test1.jpg', caption: 'Test post 1' },
      { id: 2, media_url: '/test2.jpg', caption: 'Test post 2' }
    ],
    loading: false,
    error: null
  }),
}));

// Mock all section components with consistent structure and interactive elements
vi.mock('@/components/ServicePageLayout', () => ({
  ServicePageLayout: ({ children, title, description }: MockComponentProps) => (
    <div data-testid="service-page-layout" role="main">
      <h1 data-testid="page-title">{title}</h1>
      <p data-testid="page-description">{description}</p>
      <nav data-testid="page-navigation" aria-label="Page navigation">
        <button onClick={() => {}} data-testid="nav-button">Navigate</button>
      </nav>
      {children}
    </div>
  ),
}));

vi.mock('@/components/sections/Lessons', () => ({
  Lessons: () => (
    <section data-testid="lessons-section" aria-labelledby="lessons-heading">
      <h2 id="lessons-heading">Lessons Section</h2>
      <button onClick={() => {}} data-testid="lesson-cta">Book Lesson</button>
    </section>
  ),
}));

vi.mock('@/components/sections/Approach', () => ({
  Approach: () => (
    <section data-testid="approach-section" aria-labelledby="approach-heading">
      <h2 id="approach-heading">Approach Section</h2>
    </section>
  ),
}));

vi.mock('@/components/sections/About', () => ({
  About: () => (
    <section data-testid="about-section" aria-labelledby="about-heading">
      <h2 id="about-heading">About Section</h2>
    </section>
  ),
}));

vi.mock('@/components/sections/Contact', () => ({
  Contact: () => (
    <section data-testid="contact-section" aria-labelledby="contact-heading">
      <h2 id="contact-heading">Contact Section</h2>
      <form data-testid="contact-form" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="email" 
          placeholder="Email" 
          data-testid="email-input"
          aria-label="Email address"
        />
        <button 
          type="button" 
          data-testid="submit-button"
          onClick={() => {}} 
        >
          Submit
        </button>
      </form>
    </section>
  ),
}));

vi.mock('@/components/ui/CrossServiceNavigation', () => ({
  CrossServiceNavigation: () => (
    <nav data-testid="cross-service-navigation" aria-label="Cross service navigation">
      <a href="/teaching" data-testid="nav-teaching">Teaching</a>
      <a href="/performance" data-testid="nav-performance">Performance</a>
      <a href="/collaboration" data-testid="nav-collaboration">Collaboration</a>
    </nav>
  ),
}));

vi.mock('@/components/sections/PerformanceHero', () => ({
  PerformanceHero: () => (
    <section data-testid="performance-hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading">Performance Hero</h1>
      <button onClick={() => {}} data-testid="hero-cta">Book Performance</button>
    </section>
  ),
}));

vi.mock('@/components/sections/PerformanceGallery', () => ({
  PerformanceGallery: () => (
    <section data-testid="performance-gallery" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading">Performance Gallery</h2>
      <div role="img" aria-label="Performance image 1" data-testid="gallery-image-1" />
      <div role="img" aria-label="Performance image 2" data-testid="gallery-image-2" />
    </section>
  ),
}));

vi.mock('@/components/sections/MultiServiceTestimonials', () => ({
  MultiServiceTestimonials: () => (
    <section data-testid="testimonials-section" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading">Multi Service Testimonials</h2>
      <div role="group" aria-label="Customer testimonials">
        <blockquote data-testid="testimonial-1">Great service!</blockquote>
        <blockquote data-testid="testimonial-2">Excellent work!</blockquote>
      </div>
    </section>
  ),
}));

vi.mock('@/components/pricing/TeachingPricing', () => ({
  TeachingPricing: () => (
    <section data-testid="pricing-section" aria-labelledby="pricing-heading">
      <h2 id="pricing-heading">Pricing Section</h2>
      <div role="table" aria-label="Pricing options">
        <div role="row" data-testid="pricing-option-1">
          <div role="cell">Basic: $50</div>
          <button onClick={() => {}} data-testid="select-basic">Select</button>
        </div>
      </div>
    </section>
  ),
}));

vi.mock('@/components/social/InstagramFeed', () => ({
  InstagramFeed: () => (
    <section data-testid="instagram-feed" aria-labelledby="instagram-heading">
      <h2 id="instagram-heading">Instagram Feed</h2>
      <div role="feed" aria-label="Instagram posts">
        <article data-testid="instagram-post-1" aria-label="Instagram post 1" />
        <article data-testid="instagram-post-2" aria-label="Instagram post 2" />
      </div>
    </section>
  ),
}));

vi.mock('@/components/sections/CollaborationHero', () => ({
  CollaborationHero: () => (
    <section data-testid="collaboration-hero" aria-labelledby="collab-hero-heading">
      <h1 id="collab-hero-heading">Collaboration Hero</h1>
      <button onClick={() => {}} data-testid="collab-hero-cta">Start Collaboration</button>
    </section>
  ),
}));

vi.mock('@/components/sections/CollaborationServices', () => ({
  CollaborationServices: () => (
    <section data-testid="collaboration-services" aria-labelledby="services-heading">
      <h2 id="services-heading">Collaboration Services</h2>
      <div role="list" aria-label="Collaboration services">
        <div role="listitem" data-testid="service-1">Recording</div>
        <div role="listitem" data-testid="service-2">Mixing</div>
      </div>
    </section>
  ),
}));

vi.mock('@/components/sections/CollaborationProcess', () => ({
  CollaborationProcess: () => (
    <section data-testid="collaboration-process" aria-labelledby="process-heading">
      <h2 id="process-heading">Collaboration Process</h2>
      <ol data-testid="process-steps" aria-label="Collaboration steps">
        <li>Step 1: Initial consultation</li>
        <li>Step 2: Project planning</li>
      </ol>
    </section>
  ),
}));

vi.mock('@/components/sections/CollaborationPortfolio', () => ({
  CollaborationPortfolio: () => (
    <section data-testid="collaboration-portfolio" aria-labelledby="portfolio-heading">
      <h2 id="portfolio-heading">Collaboration Portfolio</h2>
      <div role="region" aria-label="Portfolio items">
        <article data-testid="portfolio-item-1" aria-label="Portfolio item 1" />
      </div>
    </section>
  ),
}));

vi.mock('@/components/sections/CollaborationCTA', () => ({
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
      <div data-testid="canonical-url" />
      <div data-testid="structured-data" />
    </div>
  ),
}));

vi.mock('@/components/ui/LazySection', () => ({
  LazySection: ({ children }: MockComponentProps) => (
    <div data-testid="lazy-section" role="region" aria-label="Lazy loaded content">
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/CrossServiceSuggestion', () => ({
  CrossServiceSuggestion: () => (
    <div data-testid="cross-service-suggestion" role="complementary" aria-label="Related services">
      <h3>You might also be interested in:</h3>
      <button onClick={() => {}} data-testid="suggestion-button">View Service</button>
    </div>
  ),
}));

vi.mock('@/components/common/SEOHead', () => ({
  SEOHead: ({ title, description }: MockComponentProps) => (
    <div data-testid="seo-head">
      <div data-testid="document-title">{title}</div>
      <div data-testid="meta-description">{description}</div>
    </div>
  ),
}));

// Test wrapper with Router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Global setup and cleanup
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
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      cleanup();

      renderWithRouter(<Collaboration className={customClass} />);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should provide default values for optional props', () => {
      expect(() => renderWithRouter(<Teaching />)).not.toThrow();
      expect(() => renderWithRouter(<Performance />)).not.toThrow();
      expect(() => renderWithRouter(<Collaboration />)).not.toThrow();
    });
  });

  describe('Service-Specific Content Rendering', () => {
    it('should render Teaching page specific content', () => {
      renderWithRouter(<Teaching />);

      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();

      const title = screen.getByTestId('page-title');
      expect(title).toHaveTextContent(/Guitar Lessons/);
    });

    it('should render Performance page specific content', () => {
      renderWithRouter(<Performance />);

      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      expect(screen.getByTestId('performance-gallery')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      expect(screen.getByTestId('instagram-feed')).toBeInTheDocument();
    });

    it('should render Collaboration page specific content', () => {
      renderWithRouter(<Collaboration />);

      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-services')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });
  });

  describe('User Interaction Testing', () => {
    it('should handle navigation button clicks in Teaching page', async () => {
      renderWithRouter(<Teaching />);
      
      const navButton = screen.getByTestId('nav-button');
      expect(navButton).toBeInTheDocument();
      
      await user.click(navButton);
      expect(navButton).toHaveFocus();
    });

    it('should handle lesson booking interactions in Teaching page', async () => {
      renderWithRouter(<Teaching />);
      
      const lessonCTA = screen.getByTestId('lesson-cta');
      expect(lessonCTA).toBeInTheDocument();
      
      await user.click(lessonCTA);
      expect(lessonCTA).toBeVisible();
    });

    it('should handle performance booking interactions', async () => {
      renderWithRouter(<Performance />);
      
      const heroButton = screen.getByTestId('hero-cta');
      expect(heroButton).toBeInTheDocument();
      
      await user.click(heroButton);
      expect(heroButton).toBeVisible();
    });

    it('should handle collaboration contact interactions', async () => {
      renderWithRouter(<Collaboration />);
      
      const collabButton = screen.getByTestId('collaboration-contact-button');
      expect(collabButton).toBeInTheDocument();
      
      await user.click(collabButton);
      expect(collabButton).toBeVisible();
    });

    it('should handle form interactions across all pages', async () => {
      // Test Teaching page form
      renderWithRouter(<Teaching />);
      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      await user.type(emailInput, 'test@example.com');
      expect(emailInput).toHaveValue('test@example.com');

      // Test button click instead of form submission to avoid JSDOM issues
      fireEvent.click(submitButton);
      expect(submitButton).toBeVisible();

      cleanup();

      // Test Performance page form
      renderWithRouter(<Performance />);
      const perfEmailInput = screen.getByTestId('email-input');
      await user.type(perfEmailInput, 'perf@example.com');
      expect(perfEmailInput).toHaveValue('perf@example.com');
    });

    it('should handle cross-service navigation links', async () => {
      renderWithRouter(<Teaching />);
      
      const teachingLink = screen.getByTestId('nav-teaching');
      const performanceLink = screen.getByTestId('nav-performance');
      const collaborationLink = screen.getByTestId('nav-collaboration');

      expect(teachingLink).toHaveAttribute('href', '/teaching');
      expect(performanceLink).toHaveAttribute('href', '/performance');
      expect(collaborationLink).toHaveAttribute('href', '/collaboration');

      await user.click(performanceLink);
      expect(performanceLink).toBeVisible();
    });

    it('should handle pricing selection interactions', async () => {
      renderWithRouter(<Teaching />);
      
      const pricingButton = screen.getByTestId('select-basic');
      expect(pricingButton).toBeInTheDocument();
      
      await user.click(pricingButton);
      expect(pricingButton).toBeVisible();
    });
  });

  describe('Enhanced Accessibility Testing', () => {
    it('should have proper ARIA labels and roles across all pages', () => {
      renderWithRouter(<Teaching />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByLabelText('Page navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();

      cleanup();

      renderWithRouter(<Performance />);
      expect(screen.getByLabelText('Customer testimonials')).toBeInTheDocument();
      expect(screen.getByRole('feed')).toBeInTheDocument();

      cleanup();

      renderWithRouter(<Collaboration />);
      expect(screen.getByLabelText('Collaboration steps')).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Portfolio items' })).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      renderWithRouter(<Teaching />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      
      expect(h1).toBeInTheDocument();
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', async () => {
      renderWithRouter(<Teaching />);
      
      const navButton = screen.getByTestId('nav-button');
      const lessonButton = screen.getByTestId('lesson-cta');
      
      await user.tab();
      expect(navButton).toHaveFocus();
      
      await user.tab();
      expect(lessonButton).toHaveFocus();
    });

    it('should have semantic HTML structure', () => {
      renderWithRouter(<Performance />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getAllByRole('navigation')).toHaveLength(2);
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByRole('feed')).toBeInTheDocument();
    });

    it('should provide proper alt text and labels for images', () => {
      renderWithRouter(<Performance />);
      
      expect(screen.getByLabelText('Performance image 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Performance image 2')).toBeInTheDocument();
    });

    it('should have proper focus management', async () => {
      renderWithRouter(<Collaboration />);
      
      const heroButton = screen.getByTestId('collab-hero-cta');
      
      await user.click(heroButton);
      expect(heroButton).toHaveFocus();
      
      await user.tab();
      expect(document.activeElement).not.toBe(heroButton);
    });
  });

  describe('Hook Integration Testing', () => {
    it('should integrate with performance monitoring hooks', async () => {
      const performanceMonitorModule = await vi.importMock('@/utils/performanceMonitor') as { 
        performanceMonitor: { 
          mark: vi.MockedFunction<unknown>;
          measure: vi.MockedFunction<unknown>;
        } 
      };
      
      renderWithRouter(<Teaching />);
      
      expect(performanceMonitorModule.performanceMonitor.mark).toHaveBeenCalledWith('teaching-page-render-start');
    });

    it('should integrate with testimonials hook and display data', () => {
      renderWithRouter(<Performance />);
      
      const testimonialsSection = screen.getByTestId('testimonials-section');
      expect(testimonialsSection).toBeInTheDocument();
      
      expect(screen.getByTestId('testimonial-1')).toBeInTheDocument();
      expect(screen.getByTestId('testimonial-2')).toBeInTheDocument();
    });

    it('should integrate with content hooks for page metadata', () => {
      renderWithRouter(<Teaching />);
      
      expect(screen.getByTestId('page-title')).toHaveTextContent('Guitar Lessons with Rrish Music');
      expect(screen.getByTestId('page-description')).toHaveTextContent('Professional guitar instruction');
    });

    it('should handle loading states from hooks', () => {
      renderWithRouter(<Performance />);
      
      expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      expect(screen.getByTestId('testimonial-1')).toHaveTextContent('Great service!');
    });
  });

  describe('Mobile Component Testing', () => {
    it('should render mobile-optimized components', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithRouter(<Teaching />);
      
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });

    it('should handle mobile touch interactions', async () => {
      renderWithRouter(<Teaching />);
      
      const lessonButton = screen.getByTestId('lesson-cta');
      
      await user.click(lessonButton);
      expect(lessonButton).toBeVisible();
    });

    it('should maintain accessibility on mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithRouter(<Performance />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByLabelText('Customer testimonials')).toBeInTheDocument();
    });

    it('should handle responsive image components', () => {
      renderWithRouter(<Performance />);
      
      const galleryImages = screen.getAllByRole('img');
      expect(galleryImages).toHaveLength(2);
      
      galleryImages.forEach(image => {
        expect(image).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle component errors gracefully', () => {
      renderWithRouter(<Performance />);
      
      const errorBoundary = screen.getByTestId('error-boundary');
      expect(errorBoundary).toBeInTheDocument();
      expect(errorBoundary).toHaveAttribute('role', 'alert');
    });

    it('should handle missing props gracefully', () => {
      expect(() => renderWithRouter(<Teaching />)).not.toThrow();
      expect(() => renderWithRouter(<Performance />)).not.toThrow();
      expect(() => renderWithRouter(<Collaboration />)).not.toThrow();
    });

    it('should handle empty form submissions', () => {
      renderWithRouter(<Teaching />);
      
      const submitButton = screen.getByTestId('submit-button');
      const emailInput = screen.getByTestId('email-input');
      
      // Test button click instead of form submission
      fireEvent.click(submitButton);
      expect(emailInput).toHaveValue('');
      expect(submitButton).toBeVisible();
    });
  });

  describe('Performance and Loading Optimization', () => {
    it('should implement lazy loading components', () => {
      renderWithRouter(<Performance />);
      
      const lazySection = screen.getByTestId('lazy-section');
      expect(lazySection).toBeInTheDocument();
      expect(lazySection).toHaveAttribute('role', 'region');
    });

    it('should handle component mounting and unmounting cleanly', () => {
      const { unmount } = renderWithRouter(<Teaching />);
      
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Business Logic Integration', () => {
    it('should present service-specific value propositions', () => {
      renderWithRouter(<Teaching />);
      expect(screen.getByTestId('page-title')).toHaveTextContent(/Guitar Lessons/);
      
      cleanup();
      
      renderWithRouter(<Performance />);
      expect(screen.getByTestId('performance-hero')).toBeInTheDocument();
      
      cleanup();
      
      renderWithRouter(<Collaboration />);
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
    });

    it('should maintain consistent brand messaging across services', () => {
      renderWithRouter(<Teaching />);
      const teachingTitle = screen.getByTestId('page-title');
      expect(teachingTitle).toHaveTextContent(/Rrish Music/);
    });

    it('should implement cross-service suggestions appropriately', () => {
      renderWithRouter(<Teaching />);
      
      const crossServiceSuggestion = screen.getByTestId('cross-service-suggestion');
      expect(crossServiceSuggestion).toBeInTheDocument();
      expect(crossServiceSuggestion).toHaveAttribute('role', 'complementary');
    });
  });
});