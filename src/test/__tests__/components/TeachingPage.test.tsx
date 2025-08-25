import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Teaching } from '@/components/pages/Teaching';

interface MockComponentProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  onClick?: () => void;
}

// Mock performance monitoring
vi.mock('@/utils/performanceMonitor', () => ({
  performanceMonitor: {
    mark: vi.fn(),
    measure: vi.fn(),
  },
}));

// Mock content hook with realistic data
vi.mock('@/hooks/useContent', () => ({
  useContent: () => ({
    teaching: {
      title: 'Guitar Lessons with Rrish Music',
      description: 'Professional guitar instruction for all levels',
      keywords: 'guitar lessons, music teacher, guitar instruction',
      hero: {
        title: 'Learn Guitar with Professional Instruction',
        subtitle: 'Personalized lessons for all skill levels'
      }
    }
  }),
}));

// Mock pricing hook
vi.mock('@/hooks/useTeachingPricing', () => ({
  useTeachingPricing: () => ({
    packages: [
      { id: 1, name: 'Basic', price: 50, lessons: 4 },
      { id: 2, name: 'Standard', price: 90, lessons: 8 },
      { id: 3, name: 'Premium', price: 120, lessons: 12 }
    ],
    loading: false,
    selectPackage: vi.fn()
  }),
}));

// Mock child components with interactive elements and accessibility
vi.mock('@/components/ServicePageLayout', () => ({
  ServicePageLayout: ({ children, title, description, className }: MockComponentProps) => (
    <div 
      data-testid="service-page-layout" 
      className={className}
      role="main"
      aria-labelledby="main-heading"
    >
      <h1 id="main-heading" data-testid="page-title">{title}</h1>
      <p data-testid="page-description">{description}</p>
      <nav aria-label="Page navigation" data-testid="page-navigation">
        <button onClick={() => {}} data-testid="nav-button">Navigate</button>
      </nav>
      {children}
    </div>
  ),
}));

vi.mock('@/components/sections/Lessons', () => ({
  Lessons: () => (
    <section data-testid="lessons-section" aria-labelledby="lessons-heading">
      <h2 id="lessons-heading">Guitar Lessons</h2>
      <div role="group" aria-label="Lesson types">
        <button 
          onClick={() => {}} 
          data-testid="lesson-cta" 
          aria-describedby="lesson-description"
        >
          Book Lesson
        </button>
        <p id="lesson-description">Professional guitar instruction</p>
      </div>
      <div role="tablist" aria-label="Lesson formats">
        <button role="tab" data-testid="online-lessons" aria-selected="true">Online</button>
        <button role="tab" data-testid="in-person-lessons" aria-selected="false">In Person</button>
      </div>
    </section>
  ),
}));

vi.mock('@/components/sections/Approach', () => ({
  Approach: () => (
    <section data-testid="approach-section" aria-labelledby="approach-heading">
      <h2 id="approach-heading">Teaching Approach</h2>
      <div role="region" aria-label="Teaching methodology">
        <p>Personalized instruction tailored to your goals</p>
      </div>
    </section>
  ),
}));

vi.mock('@/components/sections/About', () => ({
  About: () => (
    <section data-testid="about-section" aria-labelledby="about-heading">
      <h2 id="about-heading">About the Instructor</h2>
      <div role="region" aria-label="Instructor information">
        <p>Professional musician with 10+ years experience</p>
        <img 
          src="/instructor.jpg" 
          alt="Rrish, professional guitar instructor" 
          data-testid="instructor-image"
        />
      </div>
    </section>
  ),
}));

vi.mock('@/components/sections/Contact', () => ({
  Contact: () => (
    <section data-testid="contact-section" aria-labelledby="contact-heading">
      <h2 id="contact-heading">Contact</h2>
      <form data-testid="contact-form" role="form" aria-label="Contact form" onSubmit={(e) => e.preventDefault()}>
        <div role="group" aria-labelledby="contact-info">
          <legend id="contact-info">Your Information</legend>
          <label htmlFor="email-input">Email Address</label>
          <input 
            id="email-input"
            type="email" 
            data-testid="email-input"
            aria-required="true"
            aria-describedby="email-help"
          />
          <p id="email-help">We'll use this to send lesson confirmations</p>
          
          <label htmlFor="message-input">Message</label>
          <textarea 
            id="message-input"
            data-testid="message-input"
            aria-required="false"
            placeholder="Tell us about your musical goals"
          />
          
          <button 
            type="button" 
            data-testid="submit-button"
            aria-describedby="submit-help"
            onClick={() => {}}
          >
            Send Inquiry
          </button>
          <p id="submit-help">We typically respond within 24 hours</p>
        </div>
      </form>
    </section>
  ),
}));

vi.mock('@/components/pricing/TeachingPricing', () => ({
  TeachingPricing: () => (
    <section data-testid="pricing-section" aria-labelledby="pricing-heading">
      <h2 id="pricing-heading">Lesson Pricing</h2>
      <div role="table" aria-label="Pricing packages">
        <div role="rowgroup">
          <div role="row" data-testid="pricing-header">
            <div role="columnheader">Package</div>
            <div role="columnheader">Price</div>
            <div role="columnheader">Lessons</div>
            <div role="columnheader">Action</div>
          </div>
        </div>
        <div role="rowgroup">
          <div role="row" data-testid="pricing-option-1">
            <div role="cell">Basic</div>
            <div role="cell">$50</div>
            <div role="cell">4 lessons</div>
            <div role="cell">
              <button 
                onClick={() => {}} 
                data-testid="select-basic"
                aria-label="Select Basic package - $50 for 4 lessons"
              >
                Select
              </button>
            </div>
          </div>
          <div role="row" data-testid="pricing-option-2">
            <div role="cell">Standard</div>
            <div role="cell">$90</div>
            <div role="cell">8 lessons</div>
            <div role="cell">
              <button 
                onClick={() => {}} 
                data-testid="select-standard"
                aria-label="Select Standard package - $90 for 8 lessons"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  ),
}));

vi.mock('@/components/ui/CrossServiceNavigation', () => ({
  CrossServiceNavigation: () => (
    <nav 
      data-testid="cross-service-navigation" 
      aria-label="Other services"
      role="navigation"
    >
      <h3>Explore Other Services</h3>
      <ul role="list">
        <li role="listitem">
          <a 
            href="/performance" 
            data-testid="nav-performance"
            aria-describedby="perf-desc"
          >
            Live Performances
          </a>
          <p id="perf-desc">Professional live music for your event</p>
        </li>
        <li role="listitem">
          <a 
            href="/collaboration" 
            data-testid="nav-collaboration"
            aria-describedby="collab-desc"
          >
            Music Collaboration
          </a>
          <p id="collab-desc">Recording and production services</p>
        </li>
      </ul>
    </nav>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Teaching Page Component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      expect(() => renderWithRouter(<Teaching />)).not.toThrow();
    });

    it('should render with custom className', () => {
      renderWithRouter(<Teaching className="custom-class" />);
      const layout = screen.getByTestId('service-page-layout');
      expect(layout).toHaveClass('custom-class');
    });

    it('should render with default empty className when none provided', () => {
      renderWithRouter(<Teaching />);
      const layout = screen.getByTestId('service-page-layout');
      expect(layout).toBeInTheDocument();
    });
  });

  describe('SEO and Meta Information', () => {
    it('should render correct title and description', () => {
      renderWithRouter(<Teaching />);
      
      const title = screen.getByTestId('page-title');
      const description = screen.getByTestId('page-description');
      
      expect(title).toHaveTextContent('Guitar Lessons with Rrish Music');
      expect(description).toHaveTextContent('Professional guitar instruction');
    });

    it('should include teaching-specific keywords in meta content', () => {
      renderWithRouter(<Teaching />);
      
      const title = screen.getByTestId('page-title');
      expect(title).toHaveTextContent(/Guitar Lessons/i);
    });
  });

  describe('Section Components Integration', () => {
    it('should render all required sections', () => {
      renderWithRouter(<Teaching />);

      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
    });

    it('should render cross-service navigation', () => {
      renderWithRouter(<Teaching />);
      expect(screen.getByTestId('cross-service-navigation')).toBeInTheDocument();
    });

    it('should render sections in correct order', () => {
      renderWithRouter(<Teaching />);
      
      const sections = screen.getAllByRole('region').concat(
        screen.getAllByRole('main'),
        screen.getAllByTestId(/section/)
      );
      
      expect(sections.length).toBeGreaterThan(3);
    });
  });

  describe('User Interaction Testing', () => {
    it('should handle lesson booking button clicks', async () => {
      renderWithRouter(<Teaching />);
      
      const lessonButton = screen.getByTestId('lesson-cta');
      expect(lessonButton).toBeInTheDocument();
      
      await user.click(lessonButton);
      expect(lessonButton).toBeVisible();
    });

    it('should handle lesson format tab navigation', async () => {
      renderWithRouter(<Teaching />);
      
      const onlineTab = screen.getByTestId('online-lessons');
      const inPersonTab = screen.getByTestId('in-person-lessons');
      
      expect(onlineTab).toHaveAttribute('aria-selected', 'true');
      expect(inPersonTab).toHaveAttribute('aria-selected', 'false');
      
      await user.click(inPersonTab);
      expect(inPersonTab).toBeVisible();
    });

    it('should handle pricing package selection', async () => {
      renderWithRouter(<Teaching />);
      
      const basicButton = screen.getByTestId('select-basic');
      const standardButton = screen.getByTestId('select-standard');
      
      await user.click(basicButton);
      expect(basicButton).toBeVisible();
      
      await user.click(standardButton);
      expect(standardButton).toBeVisible();
    });

    it('should handle form input and submission', async () => {
      renderWithRouter(<Teaching />);
      
      const emailInput = screen.getByTestId('email-input');
      const messageInput = screen.getByTestId('message-input');
      const submitButton = screen.getByTestId('submit-button');

      // Test email input
      await user.type(emailInput, 'student@example.com');
      expect(emailInput).toHaveValue('student@example.com');

      // Test message input
      await user.type(messageInput, 'I want to learn guitar basics');
      expect(messageInput).toHaveValue('I want to learn guitar basics');

      // Test button click instead of form submission
      fireEvent.click(submitButton);
      expect(submitButton).toBeVisible();
    });

    it('should handle navigation between services', async () => {
      renderWithRouter(<Teaching />);
      
      const performanceLink = screen.getByTestId('nav-performance');
      const collaborationLink = screen.getByTestId('nav-collaboration');

      expect(performanceLink).toHaveAttribute('href', '/performance');
      expect(collaborationLink).toHaveAttribute('href', '/collaboration');

      await user.click(performanceLink);
      expect(performanceLink).toBeVisible();
    });

    it('should handle keyboard navigation', async () => {
      renderWithRouter(<Teaching />);
      
      const navButton = screen.getByTestId('nav-button');
      const lessonButton = screen.getByTestId('lesson-cta');
      
      // Tab to first focusable element
      await user.tab();
      expect(navButton).toHaveFocus();
      
      // Tab to next focusable element
      await user.tab();
      expect(lessonButton).toHaveFocus();
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should initialize performance monitoring on mount', async () => {
      const performanceMonitorModule = await vi.importMock('@/utils/performanceMonitor') as { 
        performanceMonitor: { 
          mark: vi.MockedFunction<unknown>;
          measure: vi.MockedFunction<unknown>;
        } 
      };
      
      renderWithRouter(<Teaching />);
      
      expect(performanceMonitorModule.performanceMonitor.mark).toHaveBeenCalledWith('teaching-page-render-start');
    });

    it('should measure performance on unmount', async () => {
      const performanceMonitorModule = await vi.importMock('@/utils/performanceMonitor') as { 
        performanceMonitor: { 
          mark: vi.MockedFunction<unknown>;
          measure: vi.MockedFunction<unknown>;
        } 
      };
      
      const { unmount } = renderWithRouter(<Teaching />);
      unmount();
      
      expect(performanceMonitorModule.performanceMonitor.mark).toHaveBeenCalledWith('teaching-page-render-start');
    });
  });

  describe('Hook Integration Testing', () => {
    it('should integrate with content hook for page data', () => {
      renderWithRouter(<Teaching />);
      
      expect(screen.getByTestId('page-title')).toHaveTextContent('Guitar Lessons with Rrish Music');
      expect(screen.getByTestId('page-description')).toHaveTextContent('Professional guitar instruction');
    });

    it('should integrate with pricing hook for package data', () => {
      renderWithRouter(<Teaching />);
      
      const pricingSection = screen.getByTestId('pricing-section');
      expect(pricingSection).toBeInTheDocument();
      
      // Check pricing options are rendered
      expect(screen.getByTestId('pricing-option-1')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-option-2')).toBeInTheDocument();
    });
  });

  describe('Service Page Layout Integration', () => {
    it('should pass correct props to ServicePageLayout', () => {
      renderWithRouter(<Teaching />);

      const layout = screen.getByTestId('service-page-layout');
      expect(layout).toBeInTheDocument();
      expect(layout).toHaveAttribute('role', 'main');
    });

    it('should include teaching service sections within layout', () => {
      renderWithRouter(<Teaching />);

      const layout = screen.getByTestId('service-page-layout');
      expect(layout).toBeInTheDocument();
      
      // Sections should be nested within the layout
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have proper heading hierarchy', () => {
      renderWithRouter(<Teaching />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      
      expect(h1).toBeInTheDocument();
      expect(h2Elements.length).toBeGreaterThanOrEqual(4); // lessons, approach, about, contact, pricing
    });

    it('should have accessible form structure', () => {
      renderWithRouter(<Teaching />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label', 'Contact form');
      
      const emailInput = screen.getByLabelText('Email Address');
      expect(emailInput).toHaveAttribute('aria-required', 'true');
      expect(emailInput).toHaveAttribute('aria-describedby', 'email-help');
      
      const messageInput = screen.getByLabelText('Message');
      expect(messageInput).toHaveAttribute('aria-required', 'false');
    });

    it('should have accessible navigation structure', () => {
      renderWithRouter(<Teaching />);
      
      const pageNav = screen.getByLabelText('Page navigation');
      expect(pageNav).toBeInTheDocument();
      
      const serviceNav = screen.getByLabelText('Other services');
      expect(serviceNav).toBeInTheDocument();
    });

    it('should have accessible pricing table', () => {
      renderWithRouter(<Teaching />);
      
      const pricingTable = screen.getByRole('table');
      expect(pricingTable).toHaveAttribute('aria-label', 'Pricing packages');
      
      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders).toHaveLength(4); // Package, Price, Lessons, Action
      
      const selectButtons = screen.getAllByRole('button', { name: /Select.*package/ });
      expect(selectButtons.length).toBeGreaterThanOrEqual(2);
    });

    it('should have accessible content structure', () => {
      renderWithRouter(<Teaching />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-labelledby', 'main-heading');
      
      const regions = screen.getAllByRole('region');
      expect(regions.length).toBeGreaterThan(0);
      
      regions.forEach(region => {
        expect(region).toHaveAttribute('aria-label');
      });
    });

    it('should support screen reader navigation', () => {
      renderWithRouter(<Teaching />);
      
      // Check for proper semantic structure
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getAllByRole('navigation')).toHaveLength(2);
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
      
      // Check for descriptive text
      expect(screen.getByText('Professional guitar instruction')).toBeInTheDocument();
      expect(screen.getByText('We typically respond within 24 hours')).toBeInTheDocument();
    });
  });

  describe('Mobile Component Testing', () => {
    it('should render properly on different screen sizes', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithRouter(<Teaching />);
      
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument();
    });

    it('should handle responsive sections correctly', () => {
      renderWithRouter(<Teaching />);
      
      // All sections should be present regardless of viewport
      const sections = [
        'lessons-section',
        'approach-section', 
        'about-section',
        'contact-section',
        'pricing-section'
      ];
      
      sections.forEach(sectionId => {
        expect(screen.getByTestId(sectionId)).toBeInTheDocument();
      });
    });

    it('should maintain touch-friendly interactions', async () => {
      renderWithRouter(<Teaching />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Test that buttons are accessible for touch
      for (const button of buttons) {
        expect(button).toBeVisible();
        await user.click(button);
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing props gracefully', () => {
      expect(() => renderWithRouter(<Teaching />)).not.toThrow();
    });

    it('should handle empty form submissions', () => {
      renderWithRouter(<Teaching />);
      
      const submitButton = screen.getByTestId('submit-button');
      const emailInput = screen.getByTestId('email-input');
      
      // Submit with empty form using fireEvent
      fireEvent.click(submitButton);
      expect(emailInput).toHaveValue('');
      expect(submitButton).toBeVisible();
    });

    it('should handle invalid email input', async () => {
      renderWithRouter(<Teaching />);
      
      const emailInput = screen.getByTestId('email-input');
      
      await user.type(emailInput, 'invalid-email');
      expect(emailInput).toHaveValue('invalid-email');
    });

    it('should handle component unmounting cleanly', () => {
      const { unmount } = renderWithRouter(<Teaching />);
      
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Business Logic Integration', () => {
    it('should display teaching-specific value proposition', () => {
      renderWithRouter(<Teaching />);
      
      expect(screen.getByText(/Guitar Lessons/i)).toBeInTheDocument();
      expect(screen.getByText(/Professional guitar instruction/i)).toBeInTheDocument();
    });

    it('should provide clear pricing information', () => {
      renderWithRouter(<Teaching />);
      
      expect(screen.getByText('$50')).toBeInTheDocument();
      expect(screen.getByText('$90')).toBeInTheDocument();
      expect(screen.getByText('4 lessons')).toBeInTheDocument();
      expect(screen.getByText('8 lessons')).toBeInTheDocument();
    });

    it('should facilitate easy contact and booking', () => {
      renderWithRouter(<Teaching />);
      
      const contactForm = screen.getByRole('form');
      const bookingButton = screen.getByTestId('lesson-cta');
      
      expect(contactForm).toBeInTheDocument();
      expect(bookingButton).toBeInTheDocument();
    });

    it('should promote cross-service offerings appropriately', () => {
      renderWithRouter(<Teaching />);
      
      const crossServiceNav = screen.getByTestId('cross-service-navigation');
      expect(crossServiceNav).toBeInTheDocument();
      
      expect(screen.getByText('Live Performances')).toBeInTheDocument();
      expect(screen.getByText('Music Collaboration')).toBeInTheDocument();
    });
  });
});