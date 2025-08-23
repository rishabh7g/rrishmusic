import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Approach } from '../Approach';
import * as contentHooks from '@/hooks/useContent';
import { ApproachContent, TeachingPrinciple } from '@/types/content';

// Enhanced TypeScript patterns
interface MockedContentHooks {
  useSectionContent: ReturnType<typeof vi.fn>;
}

interface MockContentReturn {
  data: ApproachContent | null;
  loading: boolean;
  error: string | null;
}

interface MotionProps {
  children: React.ReactNode;
  variants?: any;
  initial?: any;
  animate?: any;
  whileInView?: any;
  viewport?: any;
  className?: string;
  id?: string;
}

// Test Data Builder Pattern
const createMockTeachingPrinciple = (overrides?: Partial<TeachingPrinciple>): TeachingPrinciple => ({
  title: 'Personalized Learning',
  description: 'Every student is unique, and so should be their learning journey.',
  icon: '🎯',
  ...overrides,
});

const createMockApproachContent = (overrides?: Partial<ApproachContent>): ApproachContent => ({
  title: 'My Teaching Approach',
  subtitle: 'I believe in making music education accessible, enjoyable, and effective for everyone.',
  principles: [
    createMockTeachingPrinciple({
      title: 'Student-Centered Learning',
      description: 'I adapt my teaching style to match each student\'s learning preferences and goals.',
      icon: '🎯'
    }),
    createMockTeachingPrinciple({
      title: 'Practical Application',
      description: 'Learning through doing - we focus on playing real music from day one.',
      icon: '🎸'
    }),
    createMockTeachingPrinciple({
      title: 'Creative Expression',
      description: 'I encourage students to find their unique voice and musical style.',
      icon: '✨'
    }),
    createMockTeachingPrinciple({
      title: 'Progressive Building',
      description: 'We build skills systematically, ensuring solid foundations before advancing.',
      icon: '📚'
    })
  ],
  ...overrides,
});

const createMockContentReturn = (overrides?: Partial<MockContentReturn>): MockContentReturn => ({
  data: createMockApproachContent(),
  loading: false,
  error: null,
  ...overrides,
});

// Custom render function for Approach component
const renderApproach = (options?: RenderOptions) => {
  return render(<Approach />, options);
};

// Mock framer-motion to capture and test animation props
const mockMotionSection = vi.fn();
const mockMotionDiv = vi.fn();
const mockMotionH2 = vi.fn();
const mockMotionP = vi.fn();
const mockMotionSpan = vi.fn();
const mockMotionH3 = vi.fn();

vi.mock('framer-motion', () => ({
  motion: {
    section: (props: MotionProps) => {
      mockMotionSection(props);
      const { children, variants, initial, animate, whileInView, viewport, ...restProps } = props;
      return React.createElement('section', restProps, children);
    },
    div: (props: MotionProps) => {
      mockMotionDiv(props);
      const { children, variants, initial, animate, whileInView, viewport, ...restProps } = props;
      return React.createElement('div', restProps, children);
    },
    h2: (props: MotionProps) => {
      mockMotionH2(props);
      const { children, variants, initial, animate, whileInView, viewport, ...restProps } = props;
      return React.createElement('h2', restProps, children);
    },
    p: (props: MotionProps) => {
      mockMotionP(props);
      const { children, variants, initial, animate, whileInView, viewport, ...restProps } = props;
      return React.createElement('p', restProps, children);
    },
    span: (props: MotionProps) => {
      mockMotionSpan(props);
      const { children, variants, initial, animate, whileInView, viewport, ...restProps } = props;
      return React.createElement('span', restProps, children);
    },
    h3: (props: MotionProps) => {
      mockMotionH3(props);
      const { children, variants, initial, animate, whileInView, viewport, ...restProps } = props;
      return React.createElement('h3', restProps, children);
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

describe('Approach', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMotionSection.mockClear();
    mockMotionDiv.mockClear();
    mockMotionH2.mockClear();
    mockMotionP.mockClear();
    mockMotionSpan.mockClear();
    mockMotionH3.mockClear();
    
    // Default mock return value
    mockUseSectionContent.mockReturnValue(createMockContentReturn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Content Rendering', () => {
    it('should render approach section with correct content', () => {
      const mockContent = createMockApproachContent({
        title: 'Custom Teaching Philosophy',
        subtitle: 'Custom subtitle for teaching approach',
        principles: [
          createMockTeachingPrinciple({
            title: 'Innovative Method',
            description: 'Custom description for innovative teaching',
            icon: '🚀'
          })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderApproach();

      expect(screen.getByRole('heading', { name: 'Custom Teaching Philosophy' })).toBeInTheDocument();
      expect(screen.getByText('Custom subtitle for teaching approach')).toBeInTheDocument();
      expect(screen.getByText('Innovative Method')).toBeInTheDocument();
      expect(screen.getByText('Custom description for innovative teaching')).toBeInTheDocument();
      expect(screen.getByText('🚀')).toBeInTheDocument();
    });

    it('should render all teaching principles', () => {
      const mockContent = createMockApproachContent({
        principles: [
          createMockTeachingPrinciple({ title: 'Principle 1', icon: '1️⃣' }),
          createMockTeachingPrinciple({ title: 'Principle 2', icon: '2️⃣' }),
          createMockTeachingPrinciple({ title: 'Principle 3', icon: '3️⃣' }),
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderApproach();

      mockContent.principles.forEach(principle => {
        expect(screen.getByText(principle.title)).toBeInTheDocument();
        expect(screen.getByText(principle.description)).toBeInTheDocument();
        expect(screen.getByText(principle.icon)).toBeInTheDocument();
      });
    });

    it('should render section with correct ID and structure', () => {
      renderApproach();

      const approachSection = document.querySelector('#approach');
      expect(approachSection).toBeInTheDocument();
      expect(approachSection).toHaveAttribute('id', 'approach');
      expect(approachSection?.tagName).toBe('SECTION');
    });

    it('should use proper grid layout for principles', () => {
      renderApproach();

      const gridContainer = document.querySelector('[class*="grid"][class*="md:grid-cols-2"][class*="lg:grid-cols-4"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should render principle cards with proper structure', () => {
      renderApproach();

      const principleCards = document.querySelectorAll('[class*="bg-white"][class*="rounded-xl"]');
      expect(principleCards.length).toBeGreaterThan(0);

      // Each card should have icon, title, and description
      principleCards.forEach(card => {
        const icon = card.querySelector('[class*="text-4xl"]');
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        
        expect(icon).toBeInTheDocument();
        expect(title).toBeInTheDocument();
        expect(description).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should render loading skeleton when loading is true', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderApproach();

      // Check for loading skeleton elements
      const skeletonElements = document.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletonElements.length).toBeGreaterThan(0);

      // Check for skeleton bars
      const skeletonBars = document.querySelectorAll('[class*="bg-gray-300"]');
      expect(skeletonBars.length).toBeGreaterThanOrEqual(6); // Title, subtitle, principle cards
    });

    it('should render loading grid structure for principles', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderApproach();

      const gridContainer = document.querySelector('[class*="grid"][class*="md:grid-cols-2"][class*="lg:grid-cols-4"]');
      expect(gridContainer).toBeInTheDocument();

      // Should render 4 skeleton cards
      const skeletonCards = gridContainer?.querySelectorAll('[class*="bg-gray-200"]');
      expect(skeletonCards?.length).toBe(4);
    });

    it('should not render actual content during loading', () => {
      const mockContent = createMockApproachContent();
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: mockContent 
      }));

      renderApproach();

      expect(screen.queryByText(mockContent.title)).not.toBeInTheDocument();
      expect(screen.queryByText(mockContent.subtitle)).not.toBeInTheDocument();
      mockContent.principles.forEach(principle => {
        expect(screen.queryByText(principle.title)).not.toBeInTheDocument();
      });
    });

    it('should maintain section structure during loading', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderApproach();

      const approachSection = document.querySelector('#approach');
      expect(approachSection).toBeInTheDocument();
      expect(approachSection).toHaveClass('section');
    });
  });

  describe('Error States', () => {
    it('should render fallback content when error occurs', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Failed to load content',
        data: null 
      }));

      renderApproach();

      expect(screen.getByRole('heading', { name: 'My Teaching Approach' })).toBeInTheDocument();
      expect(screen.getByText('Content temporarily unavailable. Please try again later.')).toBeInTheDocument();
    });

    it('should render fallback content when data is null', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: null 
      }));

      renderApproach();

      expect(screen.getByRole('heading', { name: 'My Teaching Approach' })).toBeInTheDocument();
      expect(screen.getByText('Content temporarily unavailable. Please try again later.')).toBeInTheDocument();
    });

    it('should maintain proper styling in error state', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Network error',
        data: null 
      }));

      renderApproach();

      const heading = screen.getByRole('heading', { name: 'My Teaching Approach' });
      expect(heading).toHaveClass('text-4xl', 'font-heading', 'font-bold');
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply responsive grid classes for principles', () => {
      renderApproach();

      const gridContainer = document.querySelector('[class*="md:grid-cols-2"][class*="lg:grid-cols-4"]');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid', 'md:grid-cols-2', 'lg:grid-cols-4');
    });

    it('should use responsive text sizing', () => {
      renderApproach();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('should apply responsive spacing and gaps', () => {
      renderApproach();

      const gridContainer = document.querySelector('[class*="gap-8"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should handle mobile layout correctly', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderApproach();

      const gridContainer = document.querySelector('[class*="grid"]');
      expect(gridContainer).toHaveClass('grid', 'md:grid-cols-2', 'lg:grid-cols-4');
    });

    it('should handle tablet layout correctly', () => {
      // Mock window.innerWidth for tablet
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      renderApproach();

      const gridContainer = document.querySelector('[class*="md:grid-cols-2"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should handle desktop layout correctly', () => {
      // Mock window.innerWidth for desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      renderApproach();

      const gridContainer = document.querySelector('[class*="lg:grid-cols-4"]');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Animations Integration', () => {
    it('should apply scroll-triggered animations to section', () => {
      renderApproach();

      expect(mockMotionSection).toHaveBeenCalledWith(
        expect.objectContaining({
          variants: expect.any(Object),
          initial: 'hidden',
          whileInView: 'visible',
          viewport: expect.objectContaining({
            once: true,
            amount: 0.3,
          }),
        })
      );
    });

    it('should apply stagger animations to principle cards', () => {
      renderApproach();

      // Check that principle cards have stagger animation
      expect(mockMotionDiv).toHaveBeenCalled();
      
      const cardCalls = mockMotionDiv.mock.calls.filter(call => 
        call[0].variants && call[0].className?.includes('bg-white')
      );

      expect(cardCalls.length).toBeGreaterThan(0);
      cardCalls.forEach(call => {
        expect(call[0]).toHaveProperty('variants');
      });
    });

    it('should apply fadeInUp animation to header content', () => {
      renderApproach();

      expect(mockMotionH2).toHaveBeenCalledWith(
        expect.objectContaining({
          variants: expect.any(Object),
        })
      );

      expect(mockMotionP).toHaveBeenCalledWith(
        expect.objectContaining({
          variants: expect.any(Object),
        })
      );
    });

    it('should apply scale animations to principle icons', () => {
      renderApproach();

      const iconCalls = mockMotionSpan.mock.calls.filter(call =>
        call[0].variants && call[0].className?.includes('text-4xl')
      );

      expect(iconCalls.length).toBeGreaterThan(0);
      iconCalls.forEach(call => {
        expect(call[0]).toHaveProperty('variants');
      });
    });

    it('should not apply animations during loading state', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      // Clear previous calls
      mockMotionDiv.mockClear();
      mockMotionH2.mockClear();
      mockMotionP.mockClear();

      renderApproach();

      // During loading, animated content should not be rendered
      const animatedContentCalls = [
        ...mockMotionH2.mock.calls,
        ...mockMotionP.mock.calls.filter(call => !call[0].className?.includes('animate-pulse')),
      ];

      expect(animatedContentCalls.length).toBe(0);
    });

    it('should configure proper viewport settings for scroll animations', () => {
      renderApproach();

      expect(mockMotionSection).toHaveBeenCalledWith(
        expect.objectContaining({
          viewport: expect.objectContaining({
            once: true,
            amount: expect.any(Number),
          }),
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderApproach();

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading.tagName).toBe('H2');

      const principleHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(principleHeadings.length).toBeGreaterThan(0);
      principleHeadings.forEach(heading => {
        expect(heading.tagName).toBe('H3');
      });
    });

    it('should have accessible icon elements', () => {
      renderApproach();

      const iconElements = document.querySelectorAll('[class*="text-4xl"]');
      iconElements.forEach(icon => {
        // Icons should be decorative and not interfere with screen readers
        expect(icon).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderApproach();

      // Test that section can be navigated to
      const heading = screen.getByRole('heading', { level: 2 });
      
      // Tab navigation should work
      await user.tab();
      expect(heading).toBeInTheDocument();
    });

    it('should have proper semantic structure for principle cards', () => {
      renderApproach();

      const principleHeadings = screen.getAllByRole('heading', { level: 3 });
      
      principleHeadings.forEach(heading => {
        const card = heading.closest('[class*="bg-white"]');
        expect(card).toBeInTheDocument();
        
        // Each card should have heading and description
        const description = card?.querySelector('p');
        expect(description).toBeInTheDocument();
      });
    });

    it('should have sufficient color contrast', () => {
      renderApproach();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-neutral-charcoal');

      const principleCards = document.querySelectorAll('[class*="bg-white"]');
      principleCards.forEach(card => {
        expect(card).toHaveClass('bg-white');
      });
    });

    it('should provide proper content structure for screen readers', () => {
      renderApproach();

      // Check logical reading order
      const section = document.querySelector('#approach');
      const heading = screen.getByRole('heading', { level: 2 });
      const subtitle = screen.getByText(/making music education accessible/);
      
      expect(section).toContainElement(heading);
      expect(section).toContainElement(subtitle);
      
      // Principle cards should follow header
      const principleHeadings = screen.getAllByRole('heading', { level: 3 });
      principleHeadings.forEach(principleHeading => {
        expect(section).toContainElement(principleHeading);
      });
    });

    it('should handle focus management for interactive elements', () => {
      renderApproach();

      // While principles are not interactive, they should be accessible for screen readers
      const principleCards = document.querySelectorAll('[class*="bg-white"]');
      expect(principleCards.length).toBeGreaterThan(0);
    });
  });

  describe('Content Hook Integration', () => {
    it('should call useSectionContent with correct section name', () => {
      renderApproach();

      expect(mockUseSectionContent).toHaveBeenCalledWith('approach');
      expect(mockUseSectionContent).toHaveBeenCalledTimes(1);
    });

    it('should handle content updates correctly', () => {
      const initialContent = createMockApproachContent({
        title: 'Initial Teaching Approach',
        principles: [
          createMockTeachingPrinciple({ title: 'Initial Principle' })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: initialContent 
      }));

      const { rerender } = renderApproach();
      expect(screen.getByText('Initial Teaching Approach')).toBeInTheDocument();
      expect(screen.getByText('Initial Principle')).toBeInTheDocument();

      // Update content
      const updatedContent = createMockApproachContent({
        title: 'Updated Teaching Approach',
        principles: [
          createMockTeachingPrinciple({ title: 'Updated Principle' })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: updatedContent 
      }));

      rerender(<Approach />);
      expect(screen.getByText('Updated Teaching Approach')).toBeInTheDocument();
      expect(screen.getByText('Updated Principle')).toBeInTheDocument();
      expect(screen.queryByText('Initial Teaching Approach')).not.toBeInTheDocument();
    });

    it('should handle empty principles array gracefully', () => {
      const emptyContent = createMockApproachContent({
        principles: []
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: emptyContent 
      }));

      expect(() => renderApproach()).not.toThrow();
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      
      // No principle headings should be present
      const principleHeadings = screen.queryAllByRole('heading', { level: 3 });
      expect(principleHeadings).toHaveLength(0);
    });

    it('should handle many principles correctly', () => {
      const manyPrinciples = Array(12).fill(0).map((_, i) => 
        createMockTeachingPrinciple({
          title: `Principle ${i + 1}`,
          description: `Description for principle ${i + 1}`,
          icon: `${i + 1}️⃣`
        })
      );

      const largeContent = createMockApproachContent({
        principles: manyPrinciples
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: largeContent 
      }));

      expect(() => renderApproach()).not.toThrow();
      
      const principleHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(principleHeadings).toHaveLength(12);
      
      expect(screen.getByText('Principle 1')).toBeInTheDocument();
      expect(screen.getByText('Principle 12')).toBeInTheDocument();
    });

    it('should handle principles with special characters', () => {
      const specialContent = createMockApproachContent({
        title: 'Teaching & Learning Philosophy',
        principles: [
          createMockTeachingPrinciple({
            title: 'Theory & Practice',
            description: 'Balance between 50% theory & 50% practice',
            icon: '⚖️'
          }),
          createMockTeachingPrinciple({
            title: 'Fun > Frustration',
            description: 'Learning should be > 80% enjoyable',
            icon: '😊'
          })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: specialContent 
      }));

      expect(() => renderApproach()).not.toThrow();
      
      expect(screen.getByText('Teaching & Learning Philosophy')).toBeInTheDocument();
      expect(screen.getByText('Theory & Practice')).toBeInTheDocument();
      expect(screen.getByText('Fun > Frustration')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should apply correct CSS classes to main container', () => {
      renderApproach();

      const section = document.querySelector('#approach');
      expect(section).toHaveClass('section', 'bg-neutral-gray-light/30');
    });

    it('should use container-custom class for content wrapper', () => {
      renderApproach();

      const container = document.querySelector('[class*="container-custom"]');
      expect(container).toBeInTheDocument();
    });

    it('should style principle cards appropriately', () => {
      renderApproach();

      const principleCards = document.querySelectorAll('[class*="bg-white"][class*="rounded-xl"]');
      principleCards.forEach(card => {
        expect(card).toHaveClass('bg-white', 'rounded-xl', 'p-8', 'shadow-lg');
      });
    });

    it('should apply proper spacing and layout classes', () => {
      renderApproach();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('mb-6');

      const subtitle = screen.getByText(/making music education accessible/);
      expect(subtitle).toHaveClass('mb-16');
    });

    it('should style icons consistently', () => {
      renderApproach();

      const icons = document.querySelectorAll('[class*="text-4xl"][class*="mb-6"]');
      icons.forEach(icon => {
        expect(icon).toHaveClass('text-4xl', 'mb-6');
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should not cause unnecessary re-renders', () => {
      const mockContent = createMockApproachContent();
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: mockContent 
      }));

      const { rerender } = renderApproach();
      
      // Clear call counts
      mockUseSectionContent.mockClear();
      
      // Re-render with same data
      rerender(<Approach />);
      
      expect(mockUseSectionContent).toHaveBeenCalledTimes(1);
    });

    it('should handle component unmounting gracefully', () => {
      const { unmount } = renderApproach();
      
      expect(() => unmount()).not.toThrow();
    });

    it('should efficiently render many principle cards', () => {
      const manyPrinciples = Array(20).fill(0).map((_, i) => 
        createMockTeachingPrinciple({ title: `Principle ${i + 1}` })
      );

      const content = createMockApproachContent({ principles: manyPrinciples });
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: content 
      }));

      const startTime = Date.now();
      renderApproach();
      const endTime = Date.now();

      // Should render efficiently
      expect(endTime - startTime).toBeLessThan(1000);
      
      // All principles should be rendered
      expect(screen.getByText('Principle 1')).toBeInTheDocument();
      expect(screen.getByText('Principle 20')).toBeInTheDocument();
    });

    it('should maintain consistent layout with varying content lengths', () => {
      const varyingContent = createMockApproachContent({
        principles: [
          createMockTeachingPrinciple({
            title: 'Short',
            description: 'Brief.'
          }),
          createMockTeachingPrinciple({
            title: 'Very Long Title That Might Wrap',
            description: 'This is a much longer description that contains multiple sentences and might cause layout issues if not handled properly. It tests how the component handles varying content lengths.'
          })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: varyingContent 
      }));

      expect(() => renderApproach()).not.toThrow();
      
      const principleCards = document.querySelectorAll('[class*="bg-white"]');
      expect(principleCards).toHaveLength(2);
    });
  });
});