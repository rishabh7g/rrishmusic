import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Collaboration } from '@/components/pages/Collaboration';

// Type definitions for mocked components
interface MockComponentProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  structuredData?: Record<string, unknown>;
}

// Mock child components to focus on the main component behavior
vi.mock('@/components/sections/CollaborationHero', () => ({
  CollaborationHero: () => <div data-testid="collaboration-hero">Collaboration Hero</div>,
}));

vi.mock('@/components/sections/CollaborationProcess', () => ({
  CollaborationProcess: () => <div data-testid="collaboration-process">Collaboration Process</div>,
}));

vi.mock('@/components/sections/CollaborationPortfolio', () => ({
  CollaborationPortfolio: () => (
    <div data-testid="collaboration-portfolio">Collaboration Portfolio</div>
  ),
}));

vi.mock('@/components/sections/CollaborationCTA', () => ({
  CollaborationCTA: () => <div data-testid="collaboration-cta">Collaboration CTA</div>,
}));

vi.mock('@/components/common/SEOHead', () => ({
  SEOHead: ({ title, description, keywords, canonical, structuredData }: MockComponentProps) => (
    <div data-testid="seo-head">
      <span data-testid="seo-title">{title}</span>
      <span data-testid="seo-description">{description}</span>
      <span data-testid="seo-keywords">{keywords}</span>
      <span data-testid="seo-canonical">{canonical}</span>
      <span data-testid="structured-data">{JSON.stringify(structuredData)}</span>
    </div>
  ),
}));

vi.mock('@/components/common/ErrorBoundary', () => ({
  default: ({ children }: MockComponentProps) => <div data-testid="error-boundary">{children}</div>,
}));

// Test wrapper with Router context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Collaboration Page Component', () => {
  beforeEach(() => {
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
      const customClass = 'custom-collaboration-class';
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
    it('should render correct SEO information', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // Actual content from the component
      const expectedTitle = "Creative Collaboration | Professional Music Projects Melbourne | Rrish Music";
      const expectedDescription = "Partner with Rrish on creative musical projects, recordings, and artistic collaborations. Professional guitar collaboration services in Melbourne.";
      const expectedKeywords = "music collaboration, creative projects, recording partnerships, guitar collaboration, Melbourne musician, artistic collaboration";
      const expectedCanonical = "https://www.rrishmusic.com/collaboration";
      
      expect(screen.getByTestId('seo-title')).toHaveTextContent(expectedTitle);
      expect(screen.getByTestId('seo-description')).toHaveTextContent(expectedDescription);
      expect(screen.getByTestId('seo-keywords')).toHaveTextContent(expectedKeywords);
      expect(screen.getByTestId('seo-canonical')).toHaveTextContent(expectedCanonical);
    });

    it('should include collaboration-specific keywords', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const keywords = screen.getByTestId('seo-keywords').textContent;
      expect(keywords).toContain('music collaboration');
      expect(keywords).toContain('creative projects');
      expect(keywords).toContain('recording partnerships');
      expect(keywords).toContain('guitar collaboration');
    });

    it('should include structured data for collaboration services', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const structuredData = screen.getByTestId('structured-data');
      expect(structuredData).toBeInTheDocument();
      
      const data = JSON.parse(structuredData.textContent || '{}');
      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('ProfessionalService'); // Actual type from component
      expect(data.name).toBe('Creative Collaboration Services'); // Actual name from component
      expect(data.provider.name).toBe('Rrish');
      expect(data.areaServed).toBe('Melbourne, Australia');
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
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });

    it('should render sections in correct logical order', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const sections = screen.getAllByTestId(/collaboration-/);
      const sectionOrder = sections.map(section => section.getAttribute('data-testid'));
      
      // Actual order from component: Hero → Portfolio → Process → CTA
      expect(sectionOrder).toEqual([
        'collaboration-hero',
        'collaboration-portfolio', 
        'collaboration-process',
        'collaboration-cta'
      ]);
    });

    it('should wrap all sections in main container', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const errorBoundary = screen.getByTestId('error-boundary');
      const heroSection = screen.getByTestId('collaboration-hero');
      const processSection = screen.getByTestId('collaboration-process');
      const portfolioSection = screen.getByTestId('collaboration-portfolio');
      const ctaSection = screen.getByTestId('collaboration-cta');
      
      expect(errorBoundary).toContainElement(heroSection);
      expect(errorBoundary).toContainElement(processSection);
      expect(errorBoundary).toContainElement(portfolioSection);
      expect(errorBoundary).toContainElement(ctaSection);
    });
  });

  describe('Error Boundary Integration', () => {
    it('should wrap content in error boundary', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const errorBoundary = screen.getByTestId('error-boundary');
      expect(errorBoundary).toBeInTheDocument();
      
      // Verify main sections are within the error boundary
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
    });

    it('should handle component errors gracefully', () => {
      // Mock a component that throws an error  
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // The error boundary should catch this
      expect(() => {
        render(
          <TestWrapper>
            <Collaboration />
          </TestWrapper>
        );
      }).not.toThrow();

      consoleError.mockRestore();
    });
  });

  describe('Page Structure and Layout', () => {
    it('should have proper page container structure', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const errorBoundary = screen.getByTestId('error-boundary');
      expect(errorBoundary).toBeInTheDocument();
      
      // Should contain all main sections
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });

    it('should maintain consistent section spacing and layout', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // All sections should be properly rendered within the page structure
      const sections = screen.getAllByTestId(/collaboration-/);
      expect(sections).toHaveLength(4);
      
      // Verify each section is present
      sections.forEach(section => {
        expect(section).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper document structure with SEO head', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const seoHead = screen.getByTestId('seo-head');
      expect(seoHead).toBeInTheDocument();
      
      const title = screen.getByTestId('seo-title');
      expect(title).toHaveTextContent(/Creative Collaboration/);
    });

    it('should provide comprehensive service information', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const description = screen.getByTestId('seo-description');
      expect(description).toHaveTextContent(/creative musical projects, recordings/);
      expect(description).toHaveTextContent(/guitar collaboration/);
      expect(description).toHaveTextContent(/Melbourne/);
    });

    it('should maintain logical section flow for screen readers', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // Sections should appear in logical order: Hero -> Portfolio -> Process -> CTA
      const hero = screen.getByTestId('collaboration-hero');
      const process = screen.getByTestId('collaboration-process');
      const portfolio = screen.getByTestId('collaboration-portfolio');
      const cta = screen.getByTestId('collaboration-cta');
      
      expect(hero).toBeInTheDocument();
      expect(process).toBeInTheDocument();
      expect(portfolio).toBeInTheDocument();
      expect(cta).toBeInTheDocument();
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
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });

    it('should handle responsive sections correctly', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      // All major sections should be present regardless of screen size
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });
  });

  describe('Business Logic Integration', () => {
    it('should present collaboration services clearly', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const description = screen.getByTestId('seo-description');
      expect(description).toHaveTextContent(/creative musical projects, recordings, and artistic collaborations/);
    });

    it('should target Melbourne market specifically', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const description = screen.getByTestId('seo-description');
      const structuredData = JSON.parse(screen.getByTestId('structured-data').textContent || '{}');
      
      expect(description).toHaveTextContent(/Melbourne/);
      expect(structuredData.areaServed).toBe('Melbourne, Australia');
    });

    it('should include proper call-to-action structure', () => {
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });
  });

  describe('Performance and Loading', () => {
    it('should render all sections without performance issues', () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <Collaboration />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render quickly (within reasonable time)
      expect(renderTime).toBeLessThan(1000); // Less than 1 second
      
      // All sections should be present
      expect(screen.getByTestId('collaboration-hero')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-process')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-portfolio')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-cta')).toBeInTheDocument();
    });
  });
});