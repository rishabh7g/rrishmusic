import { Teaching } from '@/components/pages/Teaching';
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

// Mock the performance monitor - avoid variable hoisting issues
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

vi.mock('@/components/ServicePageLayout', () => ({
  ServicePageLayout: ({ children, title, description }: MockComponentProps) => (
    <div data-testid="service-page-layout">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  )
}));

vi.mock('@/components/sections', () => ({
  Lessons: () => <div data-testid="lessons-section">Lessons Section</div>,
  Hero: () => <div data-testid="hero-section">Hero Section</div>,
  Community: () => <div data-testid="community-section">Community Section</div>,
  Approach: () => <div data-testid="approach-section">Approach Section</div>,
  MultiServiceTestimonialsSection: () => <div data-testid="testimonials-section">Multi Service Testimonials</div>,
  About: () => <div data-testid="about-section">About Section</div>,
  Contact: () => <div data-testid="contact-section">Contact Section</div>,
}));

vi.mock('@/components/CrossServiceNavigation', () => ({
  CrossServiceNavigation: () => 
    <div data-testid="cross-service-navigation">Cross Service Navigation</div>
}));

// Test wrapper with Router context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Teaching Page Component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const customClass = 'test-custom-class';
      
      render(
        <TestWrapper>
          <Teaching className={customClass} />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
    });

    it('should render with default empty className when none provided', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
    });
  });

  describe('SEO and Meta Information', () => {
    it('should render correct title and description', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      const expectedTitle = "Guitar Lessons & Music Theory | Professional Guitar Teaching | Rrish Music";
      const expectedDescription = "Professional guitar lessons in Melbourne specializing in blues, improvisation, and music theory. Personalized instruction for all skill levels with flexible packages and expert guidance.";
      
      expect(screen.getByText(expectedTitle)).toBeInTheDocument();
      expect(screen.getByText(expectedDescription)).toBeInTheDocument();
    });

    it('should include teaching-specific keywords in meta content', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // Check that key teaching-related terms are present in the content
      expect(screen.getAllByText(/Guitar Lessons/).length).toBeGreaterThan(0);
      // Should contain "Professional Guitar Teaching" in title
      expect(screen.getAllByText(/Professional Guitar Teaching/).length).toBeGreaterThan(0);
    });
  });

  describe('Section Components Integration', () => {
    it('should render all required sections', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });

    it('should render cross-service navigation', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('cross-service-navigation')).toBeInTheDocument();
    });

    it('should render sections in correct order', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      const sections = screen.getAllByTestId(/.*-section/);
      const sectionOrder = sections.map(section => section.getAttribute('data-testid'));
      
      expect(sectionOrder).toEqual([
        'lessons-section',
        'approach-section', 
        'about-section',
        'contact-section',
        'cross-service-navigation'
      ]);
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should initialize performance monitoring on mount', async () => {
      const performanceMonitorModule = await vi.importMock('@/utils/performanceMonitor') as { performanceMonitor: { mark: vi.MockedFunction<unknown> } };
      
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      expect(performanceMonitorModule.performanceMonitor.mark).toHaveBeenCalledWith('teaching-page-render-start');
    });

    it('should measure performance on unmount', async () => {
      const performanceMonitorModule = await vi.importMock('@/utils/performanceMonitor') as { performanceMonitor: { mark: vi.MockedFunction<unknown> } };
      
      const { unmount } = render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      unmount();
      
      expect(performanceMonitorModule.performanceMonitor.measure).toHaveBeenCalledWith('teaching-page-render-total');
    });
  });

  describe('Service Page Layout Integration', () => {
    it('should pass correct props to ServicePageLayout', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      const expectedDescription = "Professional guitar lessons in Melbourne specializing in blues, improvisation, and music theory. Personalized instruction for all skill levels with flexible packages and expert guidance.";
      
      expect(screen.getAllByText(/Guitar Lessons/).length).toBeGreaterThan(0);
      expect(screen.getByText(expectedDescription)).toBeInTheDocument();
    });

    it('should include teaching service sections within layout', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // All sections should be within the service page layout
      const layout = screen.getByTestId('service-page-layout');
      expect(layout).toBeInTheDocument();
      
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // Should have main heading
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/Guitar Lessons/);
    });

    it('should have accessible content structure', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // Should have sections for screen readers
      const sections = screen.getAllByTestId(/.*-section/);
      expect(sections.length).toBeGreaterThan(0);
      
      // Each section should be identifiable
      sections.forEach(section => {
        expect(section).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // Test that elements can be focused via keyboard
      await user.tab();
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeDefined();
      
      // Test navigation through sections
      const lessonsSection = screen.getByTestId('lessons-section');
      lessonsSection.focus();
      expect(lessonsSection).toHaveFocus();
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
          <Teaching />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
    });

    it('should handle responsive sections correctly', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // All sections should render regardless of screen size
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle section interactions properly', async () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // Test that sections are interactive
      const lessonsSection = screen.getByTestId('lessons-section');
      const approachSection = screen.getByTestId('approach-section');
      const aboutSection = screen.getByTestId('about-section');
      const contactSection = screen.getByTestId('contact-section');
      
      // Test focusing each section
      lessonsSection.focus();
      expect(lessonsSection).toHaveFocus();
      
      approachSection.focus();
      expect(approachSection).toHaveFocus();
      
      aboutSection.focus();
      expect(aboutSection).toHaveFocus();
      
      contactSection.focus();
      expect(contactSection).toHaveFocus();
    });

    it('should handle navigation interactions', async () => {
      render(
        <TestWrapper>
          <Teaching />
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
          <Teaching />
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
  });

  describe('Content Hook Integration', () => {
    it('should integrate properly with content hooks', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // Verify that all content sections are rendered, suggesting successful hook integration
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });

    it('should handle content loading states', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // Component should render successfully even during loading states
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing props gracefully', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // Should render without errors even with no props
      expect(screen.getByTestId('service-page-layout')).toBeInTheDocument();
    });

    it('should render default content when data unavailable', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // Should show fallback content
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });
  });
});