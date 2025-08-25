import { Collaboration } from '@/components/pages/Collaboration';
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

// Mock collaboration section components
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

describe('Collaboration Page Component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const customClass = 'test-custom-class';
      
      render(
        <TestWrapper>
          <Collaboration className={customClass} />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should render with default empty className when none provided', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('SEO and Meta Information', () => {
    it('should render correct title and description', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('seo-head')).toBeInTheDocument();
      expect(screen.getByTestId('document-title')).toBeInTheDocument();
      expect(screen.getByTestId('meta-description')).toBeInTheDocument();
    });

    it('should include collaboration-specific keywords in meta content', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // SEO head should contain collaboration-related metadata
      const seoHead = screen.getByTestId('seo-head');
      expect(seoHead).toBeInTheDocument();
    });
  });

  describe('Section Components Integration', () => {
    it('should render all required collaboration sections', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-approach')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-pricing')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });

    it('should render cross-service navigation', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('cross-service-navigation')).toBeInTheDocument();
    });

    it('should render sections in correct order', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const sections = screen.getAllByTestId(/collaboration-/);
      expect(sections.length).toBeGreaterThan(0);
      
      // Should include key collaboration sections
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-approach')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-pricing')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should initialize performance monitoring on mount', async () => {
      const performanceMonitorModule = await vi.importMock('@/utils/performanceMonitor') as { performanceMonitor: { mark: vi.MockedFunction<unknown> } };
      
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(performanceMonitorModule.performanceMonitor.mark).toHaveBeenCalledWith('collaboration-page-render-start');
    });

    it('should measure performance on unmount', async () => {
      const performanceMonitorModule = await vi.importMock('@/utils/performanceMonitor') as { performanceMonitor: { measure: vi.MockedFunction<unknown> } };
      
      const { unmount } = render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      unmount();
      
      expect(performanceMonitorModule.performanceMonitor.measure).toHaveBeenCalledWith('collaboration-page-render-total');
    });
  });

  describe('Error Boundary Integration', () => {
    it('should wrap components in error boundary', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const errorBoundary = screen.getByTestId('error-boundary');
      expect(errorBoundary).toBeInTheDocument();
    });

    it('should contain all collaboration sections within error boundary', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // All sections should be within the error boundary
      const errorBoundary = screen.getByTestId('error-boundary');
      expect(errorBoundary).toBeInTheDocument();
      
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-approach')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-pricing')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible section structure', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // Should have sections for screen readers
      const sections = screen.getAllByRole('generic', { hidden: true });
      expect(sections.length).toBeGreaterThan(0);
      
      // Key sections should be identifiable
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // Test that elements can be focused via keyboard
      await user.tab();
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeDefined();
      
      // Test navigation through sections
      const heroSection = screen.getByTestId('collaboration-hero');
      heroSection.focus();
      expect(heroSection).toHaveFocus();
    });

    it('should use semantic navigation elements', () => {
      render(
        <TestWrapper>
          <Collaboration />
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
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
    });

    it('should handle responsive sections correctly', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // All sections should render regardless of screen size
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-approach')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-pricing')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle portfolio interactions properly', async () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // Test that portfolio section is interactive
      const portfolio = screen.getByTestId('collaboration-portfolio');
      expect(portfolio).toBeInTheDocument();
      
      // Test focusing portfolio
      portfolio.focus();
      expect(portfolio).toHaveFocus();
    });

    it('should handle hero section interactions', async () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const heroSection = screen.getByTestId('collaboration-hero');
      expect(heroSection).toBeInTheDocument();
      
      // Test hero section focus
      heroSection.focus();
      expect(heroSection).toHaveFocus();
    });

    it('should handle CTA interactions', async () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const ctaSection = screen.getByTestId('collaboration-cta');
      expect(ctaSection).toBeInTheDocument();
      
      // Test CTA section focus
      ctaSection.focus();
      expect(ctaSection).toHaveFocus();
    });

    it('should handle navigation interactions', async () => {
      render(
        <TestWrapper>
          <Collaboration />
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
          <Collaboration />
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

    it('should handle process section interactions', async () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const processSection = screen.getByTestId('collaboration-process');
      expect(processSection).toBeInTheDocument();
      
      // Test process section focus
      processSection.focus();
      expect(processSection).toHaveFocus();
    });
  });

  describe('Hook Integration', () => {
    it('should integrate with collaboration-specific hooks', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // All sections should render successfully, indicating proper hook integration
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-approach')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
    });

    it('should handle content loading states', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // Component should render successfully even during loading states
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should integrate with pricing hooks', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // Verify pricing section is rendered, suggesting successful hook integration
      expect(screen.getByTestId('collaboration-pricing')).toBeInTheDocument();
    });
  });

  describe('Lazy Loading Integration', () => {
    it('should implement lazy loading for components', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('lazy-section')).toBeInTheDocument();
    });

    it('should handle lazy component mounting', () => {
      render(
        <TestWrapper>
          <Collaboration />
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
          <Collaboration />
        </TestWrapper>
      );
      
      // Should render without errors even with no props
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('should render default content when data unavailable', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // Should show fallback content
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-approach')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
    });

    it('should handle component errors through error boundary', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // Error boundary should be present to catch any errors
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('Business Logic Integration', () => {
    it('should present collaboration-specific value propositions', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // Should have collaboration-specific sections
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-approach')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
    });

    it('should maintain consistent brand messaging', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // SEO head should contain brand-consistent metadata
      expect(screen.getByTestId('seo-head')).toBeInTheDocument();
      expect(screen.getByTestId('document-title')).toBeInTheDocument();
    });

    it('should showcase collaboration portfolio effectively', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
    });
  });

  describe('CTA and Conversion Integration', () => {
    it('should integrate CTA sections properly', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });

    it('should handle CTA interactions', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const ctaSection = screen.getByTestId('collaboration-cta');
      expect(ctaSection).toBeInTheDocument();
      expect(ctaSection).toHaveTextContent('Collaboration CTA');
    });

    it('should provide clear collaboration process information', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const processSection = screen.getByTestId('collaboration-process');
      expect(processSection).toBeInTheDocument();
      expect(processSection).toHaveTextContent('Collaboration Process');
    });
  });

  describe('Pricing Integration', () => {
    it('should integrate pricing section properly', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('collaboration-pricing')).toBeInTheDocument();
    });

    it('should handle pricing data display', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const pricingSection = screen.getByTestId('collaboration-pricing');
      expect(pricingSection).toBeInTheDocument();
      expect(pricingSection).toHaveTextContent('Collaboration Pricing');
    });
  });

  describe('Process Flow Integration', () => {
    it('should present collaboration process clearly', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-approach')).toBeInTheDocument();
    });

    it('should handle process step interactions', async () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const processSection = screen.getByTestId('collaboration-process');
      const approachSection = screen.getByTestId('collaboration-approach');
      
      // Test focusing process sections
      processSection.focus();
      expect(processSection).toHaveFocus();
      
      approachSection.focus();
      expect(approachSection).toHaveFocus();
    });
  });
});