import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Hero } from '../Hero';
import * as contentHooks from '@/hooks/useContent';
import { HeroContent } from '@/types/content';

// Enhanced TypeScript patterns
interface MockedContentHooks {
  useSectionContent: ReturnType<typeof vi.fn>;
}

interface MockContentReturn {
  data: HeroContent | null;
  loading: boolean;
  error: string | null;
}

interface MotionProps {
  children: React.ReactNode;
  variants?: any;
  initial?: any;
  animate?: any;
  transition?: any;
  className?: string;
  id?: string;
}

// Test Data Builder Pattern
const createMockHeroContent = (overrides?: Partial<HeroContent>): HeroContent => ({
  title: 'Hi, I\'m Rrish.',
  subtitle: 'I\'m a musician who improvises on blues and different music genres. I help people learn music at every level and improve their improvisation skills.',
  ctaText: 'Find me on Instagram:',
  instagramHandle: '@rrishmusic',
  instagramUrl: 'https://instagram.com/rrishmusic',
  ...overrides,
});

const createMockContentReturn = (overrides?: Partial<MockContentReturn>): MockContentReturn => ({
  data: createMockHeroContent(),
  loading: false,
  error: null,
  ...overrides,
});

// Custom render function for Hero component
const renderHero = (options?: RenderOptions) => {
  return render(<Hero />, options);
};

// Mock framer-motion to capture and test animation props
const mockMotionSection = vi.fn();
const mockMotionDiv = vi.fn();
const mockMotionH1 = vi.fn();
const mockMotionP = vi.fn();

vi.mock('framer-motion', () => ({
  motion: {
    section: (props: MotionProps) => {
      mockMotionSection(props);
      const { children, variants, initial, animate, transition, ...restProps } = props;
      return React.createElement('section', restProps, children);
    },
    div: (props: MotionProps) => {
      mockMotionDiv(props);
      const { children, variants, initial, animate, transition, ...restProps } = props;
      return React.createElement('div', restProps, children);
    },
    h1: (props: MotionProps) => {
      mockMotionH1(props);
      const { children, variants, initial, animate, transition, ...restProps } = props;
      return React.createElement('h1', restProps, children);
    },
    p: (props: MotionProps) => {
      mockMotionP(props);
      const { children, variants, initial, animate, transition, ...restProps } = props;
      return React.createElement('p', restProps, children);
    },
  },
}));

// Mock the content hooks with rawContent
vi.mock('@/hooks/useContent', () => ({
  rawContent: {
    site: { 
      contact: { 
        methods: [],
        location: 'Melbourne, Australia'
      },
      seo: {
        ogImage: '/images/og-image.jpg',
        defaultTitle: 'RrishMusic - Blues & Music Lessons',
        defaultDescription: 'Learn blues and music improvisation',
        defaultKeywords: 'blues, music, lessons, guitar'
      },
      hero: {
        instagramUrl: 'https://instagram.com/rrishmusic',
        instagramHandle: '@rrishmusic'
      }
    },
    lessons: { 
      packages: [] 
    }
  },
  useSectionContent: vi.fn(),
}));

const mockUseSectionContent = vi.mocked(contentHooks.useSectionContent) as MockedContentHooks['useSectionContent'];

describe('Hero', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMotionSection.mockClear();
    mockMotionDiv.mockClear();
    mockMotionH1.mockClear();
    mockMotionP.mockClear();
    
    // Default mock return value
    mockUseSectionContent.mockReturnValue(createMockContentReturn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Content Rendering', () => {
    it('should render hero section with correct content', () => {
      const mockContent = createMockHeroContent({
        title: 'Custom Hero Title',
        subtitle: 'Custom hero subtitle text',
        ctaText: 'Connect with me:',
        instagramHandle: '@customhandle',
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderHero();

      expect(screen.getByText('Custom Hero Title')).toBeInTheDocument();
      expect(screen.getByText('Custom hero subtitle text')).toBeInTheDocument();
      expect(screen.getByText('Connect with me:')).toBeInTheDocument();
      expect(screen.getByText('@customhandle')).toBeInTheDocument();
    });

    it('should render Instagram link with correct href and attributes', () => {
      const mockContent = createMockHeroContent({
        instagramUrl: 'https://instagram.com/testuser',
        instagramHandle: '@testuser',
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderHero();

      const instagramLink = screen.getByRole('link', { name: '@testuser' });
      expect(instagramLink).toBeInTheDocument();
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/testuser');
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render section with correct ID and classes', () => {
      renderHero();

      const heroSection = screen.getByRole('region', { name: /hero/i }) || document.querySelector('#hero');
      expect(heroSection).toBeInTheDocument();
      expect(heroSection).toHaveAttribute('id', 'hero');
      expect(heroSection).toHaveClass('section');
    });

    it('should render CTA arrow with correct navigation link', () => {
      renderHero();

      const ctaArrow = screen.getByRole('link', { name: /scroll to about/i }) || document.querySelector('a[href="#about"]');
      expect(ctaArrow).toBeInTheDocument();
      expect(ctaArrow).toHaveAttribute('href', '#about');
    });

    it('should render background decoration elements', () => {
      renderHero();

      // Check for background pattern div
      const backgroundPattern = document.querySelector('[class*="bg-[url"]') || 
        document.querySelector('[class*="hero-pattern"]');
      expect(backgroundPattern).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should render loading skeleton when loading is true', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderHero();

      // Check for loading skeleton elements
      const skeletonElements = screen.getByRole('region').querySelectorAll('[class*="animate-pulse"]');
      expect(skeletonElements.length).toBeGreaterThan(0);

      // Check for skeleton bars
      const skeletonBars = screen.getByRole('region').querySelectorAll('[class*="bg-white/20"]');
      expect(skeletonBars.length).toBeGreaterThanOrEqual(4); // Title, subtitle, CTA, handle
    });

    it('should not render actual content during loading', () => {
      const mockContent = createMockHeroContent();
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: mockContent 
      }));

      renderHero();

      expect(screen.queryByText(mockContent.title)).not.toBeInTheDocument();
      expect(screen.queryByText(mockContent.subtitle)).not.toBeInTheDocument();
      expect(screen.queryByText(mockContent.instagramHandle)).not.toBeInTheDocument();
    });

    it('should maintain section structure during loading', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderHero();

      const heroSection = document.querySelector('#hero');
      expect(heroSection).toBeInTheDocument();
      expect(heroSection).toHaveClass('section');
    });
  });

  describe('Error States', () => {
    it('should render fallback content when error occurs', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Failed to load content',
        data: null 
      }));

      renderHero();

      expect(screen.getByText('Hi, I\'m Rrish.')).toBeInTheDocument();
      expect(screen.getByText(/I'm a musician who improvises/)).toBeInTheDocument();
      expect(screen.getByText(/Find me on Instagram:/)).toBeInTheDocument();
    });

    it('should render fallback content when data is null', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: null 
      }));

      renderHero();

      expect(screen.getByText('Hi, I\'m Rrish.')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '@rrishmusic' })).toBeInTheDocument();
    });

    it('should render fallback Instagram link correctly', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Network error',
        data: null 
      }));

      renderHero();

      const instagramLink = screen.getByRole('link', { name: '@rrishmusic' });
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/rrishmusic');
      expect(instagramLink).toHaveAttribute('target', '_blank');
    });
  });

  describe('User Interactions', () => {
    it('should handle Instagram link clicks', async () => {
      const user = userEvent.setup();
      renderHero();

      const instagramLink = screen.getByRole('link', { name: '@rrishmusic' });
      
      // Mock window.open to verify external link handling
      const mockOpen = vi.fn();
      Object.defineProperty(window, 'open', { value: mockOpen, writable: true });

      // Click the link (we can't actually test the navigation due to jsdom limitations)
      await user.click(instagramLink);

      // Verify the link has correct attributes for external navigation
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should handle CTA arrow clicks for navigation', async () => {
      const user = userEvent.setup();
      renderHero();

      const ctaArrow = document.querySelector('a[href="#about"]');
      expect(ctaArrow).toBeInTheDocument();

      if (ctaArrow) {
        await user.click(ctaArrow);
        // In a real implementation, this would scroll to the about section
        expect(ctaArrow).toHaveAttribute('href', '#about');
      }
    });

    it('should support keyboard navigation for links', async () => {
      const user = userEvent.setup();
      renderHero();

      const instagramLink = screen.getByRole('link', { name: '@rrishmusic' });
      
      // Tab to the link
      await user.tab();
      expect(instagramLink).toHaveFocus();
      
      // Press Enter to activate link
      await user.keyboard('{Enter}');
      
      // Verify link properties
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/rrishmusic');
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply responsive text classes', () => {
      renderHero();

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('text-4xl', 'md:text-6xl');

      const subtitle = screen.getByText(/I'm a musician who improvises/);
      expect(subtitle).toHaveClass('text-lg', 'md:text-xl');
    });

    it('should use responsive flex direction for CTA section', () => {
      renderHero();

      const ctaContainer = screen.getByText(/Find me on Instagram:/).closest('div');
      expect(ctaContainer).toHaveClass('flex-col', 'sm:flex-row');
    });

    it('should apply responsive container classes', () => {
      renderHero();

      const container = screen.getByText(/I'm a musician/).closest('[class*="container"]');
      expect(container).toHaveClass('container-custom');
    });

    // Test different viewport sizes
    it('should handle mobile layout correctly', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderHero();

      const title = screen.getByRole('heading', { level: 1 });
      // On mobile, should use text-4xl (smaller size)
      expect(title).toHaveClass('text-4xl', 'md:text-6xl');
    });

    it('should handle desktop layout correctly', () => {
      // Mock window.innerWidth for desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      renderHero();

      const title = screen.getByRole('heading', { level: 1 });
      // Should have responsive classes that activate on md:
      expect(title).toHaveClass('text-4xl', 'md:text-6xl');
    });
  });

  describe('Animations Integration', () => {
    it('should apply stagger container animation to main container', () => {
      renderHero();

      expect(mockMotionDiv).toHaveBeenCalledWith(
        expect.objectContaining({
          variants: expect.objectContaining({
            hidden: expect.any(Object),
            visible: expect.any(Object),
          }),
          initial: 'hidden',
          animate: 'visible',
        })
      );
    });

    it('should apply fadeInUp animation to title', () => {
      renderHero();

      expect(mockMotionH1).toHaveBeenCalledWith(
        expect.objectContaining({
          variants: expect.objectContaining({
            hidden: expect.any(Object),
            visible: expect.any(Object),
          }),
        })
      );
    });

    it('should apply fadeInUp animation to all content elements', () => {
      renderHero();

      // Check that motion components were called with appropriate animations
      expect(mockMotionP).toHaveBeenCalled();
      expect(mockMotionDiv).toHaveBeenCalled();

      // Verify animation variants are applied
      const motionCalls = [
        ...mockMotionH1.mock.calls,
        ...mockMotionP.mock.calls,
        ...mockMotionDiv.mock.calls.filter(call => call[0].variants),
      ];

      motionCalls.forEach(call => {
        expect(call[0]).toHaveProperty('variants');
      });
    });

    it('should apply bouncing animation to CTA arrow', () => {
      renderHero();

      // Find the motion.div call for the CTA arrow
      const ctaArrowCall = mockMotionDiv.mock.calls.find(call => 
        call[0].animate && typeof call[0].animate === 'object'
      );

      expect(ctaArrowCall).toBeDefined();
      if (ctaArrowCall) {
        expect(ctaArrowCall[0]).toHaveProperty('animate');
        expect(ctaArrowCall[0]).toHaveProperty('transition');
      }
    });

    it('should not apply animations during loading state', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      // Clear previous calls
      mockMotionDiv.mockClear();
      mockMotionH1.mockClear();
      mockMotionP.mockClear();

      renderHero();

      // During loading, should not use motion components for content
      const animatedCalls = [
        ...mockMotionH1.mock.calls,
        ...mockMotionP.mock.calls,
      ];

      expect(animatedCalls.length).toBe(0);
    });

    it('should not apply animations during error state', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Test error', 
        data: null 
      }));

      // Clear previous calls
      mockMotionDiv.mockClear();
      mockMotionH1.mockClear();
      mockMotionP.mockClear();

      renderHero();

      // During error state, should not use motion components for content
      const animatedCalls = [
        ...mockMotionH1.mock.calls,
        ...mockMotionP.mock.calls,
      ];

      expect(animatedCalls.length).toBe(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderHero();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });

    it('should have accessible link text and attributes', () => {
      renderHero();

      const instagramLink = screen.getByRole('link', { name: '@rrishmusic' });
      expect(instagramLink).toHaveAccessibleName();
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderHero();

      // Test tab order
      await user.tab(); // Should focus Instagram link
      const instagramLink = screen.getByRole('link', { name: '@rrishmusic' });
      expect(instagramLink).toHaveFocus();

      await user.tab(); // Should focus CTA arrow
      const ctaArrow = document.querySelector('a[href="#about"]');
      if (ctaArrow) {
        expect(ctaArrow).toHaveFocus();
      }
    });

    it('should have sufficient color contrast classes', () => {
      renderHero();

      const instagramLink = screen.getByRole('link', { name: '@rrishmusic' });
      expect(instagramLink).toHaveClass('text-brand-yellow-accent');

      const ctaButton = document.querySelector('[class*="bg-brand-yellow-accent"]');
      expect(ctaButton).toBeInTheDocument();
    });

    it('should provide meaningful alternative text for decorative elements', () => {
      renderHero();

      // Check that SVG icons have proper accessibility
      const svgIcons = screen.getByRole('region').querySelectorAll('svg');
      svgIcons.forEach(svg => {
        // SVG should either have role="img" with aria-label or be aria-hidden
        const hasRole = svg.hasAttribute('role');
        const hasAriaHidden = svg.hasAttribute('aria-hidden');
        const hasAriaLabel = svg.hasAttribute('aria-label');
        
        expect(hasRole || hasAriaHidden || hasAriaLabel).toBe(true);
      });
    });

    it('should have proper landmark structure', () => {
      renderHero();

      const section = document.querySelector('#hero');
      expect(section).toBeInTheDocument();
      expect(section?.tagName).toBe('SECTION');
    });

    it('should handle focus management properly', async () => {
      const user = userEvent.setup();
      renderHero();

      // Test focus visible indicators
      const instagramLink = screen.getByRole('link', { name: '@rrishmusic' });
      
      await user.tab();
      expect(instagramLink).toHaveFocus();
      
      // Verify focus styles are applied
      expect(instagramLink).toHaveClass('hover:text-white');
    });
  });

  describe('Content Hook Integration', () => {
    it('should call useSectionContent with correct section name', () => {
      renderHero();

      expect(mockUseSectionContent).toHaveBeenCalledWith('hero');
      expect(mockUseSectionContent).toHaveBeenCalledTimes(1);
    });

    it('should handle content updates correctly', () => {
      const initialContent = createMockHeroContent({
        title: 'Initial Title',
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: initialContent 
      }));

      const { rerender } = renderHero();
      expect(screen.getByText('Initial Title')).toBeInTheDocument();

      // Update content
      const updatedContent = createMockHeroContent({
        title: 'Updated Title',
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: updatedContent 
      }));

      rerender(<Hero />);
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.queryByText('Initial Title')).not.toBeInTheDocument();
    });

    it('should handle transition from loading to loaded state', async () => {
      // Start with loading
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true,
        data: null 
      }));

      const { rerender } = renderHero();
      expect(screen.getByRole('region').querySelector('[class*="animate-pulse"]')).toBeInTheDocument();

      // Transition to loaded
      const mockContent = createMockHeroContent();
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: false,
        data: mockContent 
      }));

      rerender(<Hero />);

      await waitFor(() => {
        expect(screen.getByText(mockContent.title)).toBeInTheDocument();
        expect(screen.queryByDisplayValue(/animate-pulse/)).not.toBeInTheDocument();
      });
    });

    it('should handle transition from error to loaded state', () => {
      // Start with error
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Network error',
        data: null 
      }));

      const { rerender } = renderHero();
      expect(screen.getByText('Hi, I\'m Rrish.')).toBeInTheDocument();

      // Transition to loaded
      const mockContent = createMockHeroContent({
        title: 'Loaded Title',
      });
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: null,
        data: mockContent 
      }));

      rerender(<Hero />);
      expect(screen.getByText('Loaded Title')).toBeInTheDocument();
    });

    it('should persist section ID and basic structure across all states', () => {
      const states = [
        createMockContentReturn({ loading: true, data: null }),
        createMockContentReturn({ error: 'Error', data: null }),
        createMockContentReturn({ data: createMockHeroContent() }),
      ];

      states.forEach((state, index) => {
        mockUseSectionContent.mockReturnValue(state);
        const { rerender } = renderHero();
        
        const section = document.querySelector('#hero');
        expect(section).toBeInTheDocument();
        expect(section).toHaveClass('section');
        expect(section?.tagName).toBe('SECTION');

        if (index < states.length - 1) {
          rerender(<div />); // Clear for next test
        }
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should not cause unnecessary re-renders', () => {
      const mockContent = createMockHeroContent();
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: mockContent 
      }));

      const { rerender } = renderHero();
      
      // Clear call counts
      mockUseSectionContent.mockClear();
      
      // Re-render with same data
      rerender(<Hero />);
      
      expect(mockUseSectionContent).toHaveBeenCalledTimes(1);
    });

    it('should handle large content gracefully', () => {
      const largeContent = createMockHeroContent({
        title: 'A'.repeat(100),
        subtitle: 'B'.repeat(500),
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: largeContent 
      }));

      expect(() => renderHero()).not.toThrow();
      
      const title = screen.getByRole('heading', { level: 1 });
      const subtitle = screen.getByText(/B{500}/);
      
      expect(title).toBeInTheDocument();
      expect(subtitle).toBeInTheDocument();
    });

    it('should handle empty or minimal content', () => {
      const minimalContent = createMockHeroContent({
        title: '',
        subtitle: '',
        ctaText: '',
        instagramHandle: '',
        instagramUrl: '#',
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: minimalContent 
      }));

      expect(() => renderHero()).not.toThrow();
      
      // Should still render structure even with empty content
      const section = document.querySelector('#hero');
      expect(section).toBeInTheDocument();
    });
  });
});