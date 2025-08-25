import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Teaching } from '@/components/pages/Teaching';

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
  },
}));

// Mock child components to focus on the main component behavior
vi.mock('@/components/ServicePageLayout', () => ({
  ServicePageLayout: ({ children, title, description }: MockComponentProps) => (
    <div data-testid="service-page-layout">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

vi.mock('@/components/sections/Lessons', () => ({
  Lessons: () => <div data-testid="lessons-section">Lessons Section</div>,
}));

vi.mock('@/components/sections/Approach', () => ({
  Approach: () => <div data-testid="approach-section">Approach Section</div>,
}));

vi.mock('@/components/sections/About', () => ({
  About: () => <div data-testid="about-section">About Section</div>,
}));

vi.mock('@/components/sections/Contact', () => ({
  Contact: () => <div data-testid="contact-section">Contact Section</div>,
}));

vi.mock('@/components/CrossServiceNavigation', () => ({
  CrossServiceNavigation: () => (
    <div data-testid="cross-service-navigation">Cross Service Navigation</div>
  ),
}));

// Test wrapper with Router context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Teaching Page Component', () => {
  beforeEach(() => {
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
      const customClass = 'custom-teaching-class';
      render(
        <TestWrapper>
          <Teaching className={customClass} />
        </TestWrapper>
      );
      
      // The className should be passed to the ServicePageLayout
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
      
      // Verify that the teaching-related content is present using getAllByText
      expect(screen.getAllByText(/Guitar Lessons/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Music Theory/).length).toBeGreaterThan(0);
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
      
      const sections = screen.getAllByTestId(/-section$/);
      const sectionOrder = sections.map(section => section.getAttribute('data-testid'));
      
      expect(sectionOrder).toEqual([
        'lessons-section',
        'approach-section', 
        'about-section',
        'contact-section'
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
      
      const layout = screen.getByTestId('service-page-layout');
      expect(layout).toBeInTheDocument();
      
      // Verify the layout receives the teaching-specific content using getAllByText
      expect(screen.getAllByText(/Guitar Lessons/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Melbourne specializing in blues/).length).toBeGreaterThan(0);
    });

    it('should include teaching service sections within layout', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      const layout = screen.getByTestId('service-page-layout');
      const lessonsSection = screen.getByTestId('lessons-section');
      
      expect(layout).toContainElement(lessonsSection);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      const heading = screen.getAllByRole('heading', { level: 1 })[0];
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/Guitar Lessons/);
    });

    it('should have accessible content structure', () => {
      render(
        <TestWrapper>
          <Teaching />
        </TestWrapper>
      );
      
      // Verify that all major sections are present and accessible
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      expect(screen.getByTestId('about-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });
  });

  describe('Mobile Compatibility', () => {
    it('should render properly on different screen sizes', () => {
      // Test mobile rendering
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
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
      
      // All sections should be present regardless of screen size
      expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
      expect(screen.getByTestId('approach-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });
  });
});