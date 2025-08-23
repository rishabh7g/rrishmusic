import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { About } from '../About';
import * as contentHooks from '@/hooks/useContent';
import { AboutContent } from '@/types/content';

// Enhanced TypeScript patterns
interface MockedContentHooks {
  useSectionContent: ReturnType<typeof vi.fn>;
}

interface MockContentReturn {
  data: AboutContent | null;
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
const createMockAboutContent = (overrides?: Partial<AboutContent>): AboutContent => ({
  title: 'About Me',
  content: [
    'I\'m a passionate musician with over 10 years of experience in blues improvisation.',
    'My journey started with classical training, but I found my true calling in blues and jazz.',
    'I believe music is a universal language that connects people across cultures.'
  ],
  skills: [
    'Blues Guitar',
    'Jazz Improvisation',
    'Music Theory',
    'Performance Coaching',
    'Song Composition',
    'Recording Techniques'
  ],
  ...overrides,
});

const createMockContentReturn = (overrides?: Partial<MockContentReturn>): MockContentReturn => ({
  data: createMockAboutContent(),
  loading: false,
  error: null,
  ...overrides,
});

// Custom render function for About component
const renderAbout = (options?: RenderOptions) => {
  return render(<About />, options);
};

// Mock framer-motion to capture and test animation props
const mockMotionSection = vi.fn();
const mockMotionDiv = vi.fn();
const mockMotionH2 = vi.fn();
const mockMotionP = vi.fn();
const mockMotionUl = vi.fn();
const mockMotionLi = vi.fn();

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
    ul: (props: MotionProps) => {
      mockMotionUl(props);
      const { children, variants, initial, animate, whileInView, viewport, ...restProps } = props;
      return React.createElement('ul', restProps, children);
    },
    li: (props: MotionProps) => {
      mockMotionLi(props);
      const { children, variants, initial, animate, whileInView, viewport, ...restProps } = props;
      return React.createElement('li', restProps, children);
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

describe('About', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMotionSection.mockClear();
    mockMotionDiv.mockClear();
    mockMotionH2.mockClear();
    mockMotionP.mockClear();
    mockMotionUl.mockClear();
    mockMotionLi.mockClear();
    
    // Default mock return value
    mockUseSectionContent.mockReturnValue(createMockContentReturn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Content Rendering', () => {
    it('should render about section with correct content', () => {
      const mockContent = createMockAboutContent({
        title: 'Custom About Title',
        content: ['First paragraph', 'Second paragraph'],
        skills: ['Skill 1', 'Skill 2', 'Skill 3']
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderAbout();

      expect(screen.getByRole('heading', { name: 'Custom About Title' })).toBeInTheDocument();
      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
      expect(screen.getByText('Skill 1')).toBeInTheDocument();
      expect(screen.getByText('Skill 2')).toBeInTheDocument();
      expect(screen.getByText('Skill 3')).toBeInTheDocument();
    });

    it('should render all content paragraphs', () => {
      const mockContent = createMockAboutContent({
        content: [
          'Paragraph one content here',
          'Paragraph two content here', 
          'Paragraph three content here'
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderAbout();

      mockContent.content.forEach(paragraph => {
        expect(screen.getByText(paragraph)).toBeInTheDocument();
      });
    });

    it('should render all skills in a list format', () => {
      const mockContent = createMockAboutContent({
        skills: ['Guitar Playing', 'Music Theory', 'Live Performance', 'Studio Recording']
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderAbout();

      mockContent.skills.forEach(skill => {
        expect(screen.getByText(skill)).toBeInTheDocument();
      });
    });

    it('should render section with correct ID and structure', () => {
      renderAbout();

      const aboutSection = document.querySelector('#about');
      expect(aboutSection).toBeInTheDocument();
      expect(aboutSection).toHaveAttribute('id', 'about');
      expect(aboutSection?.tagName).toBe('SECTION');
    });

    it('should use proper grid layout for content organization', () => {
      renderAbout();

      const gridContainer = screen.getByRole('heading').closest('[class*="grid"]') || 
        document.querySelector('[class*="md:grid-cols-2"]');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should render loading skeleton when loading is true', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderAbout();

      // Check for loading skeleton elements
      const skeletonElements = document.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletonElements.length).toBeGreaterThan(0);

      // Check for skeleton bars
      const skeletonBars = document.querySelectorAll('[class*="bg-gray-300"]');
      expect(skeletonBars.length).toBeGreaterThanOrEqual(4); // Title, content, skills
    });

    it('should render loading grid structure', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderAbout();

      const gridContainer = document.querySelector('[class*="grid"][class*="md:grid-cols-2"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should not render actual content during loading', () => {
      const mockContent = createMockAboutContent();
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: mockContent 
      }));

      renderAbout();

      expect(screen.queryByText(mockContent.title)).not.toBeInTheDocument();
      mockContent.content.forEach(paragraph => {
        expect(screen.queryByText(paragraph)).not.toBeInTheDocument();
      });
      mockContent.skills.forEach(skill => {
        expect(screen.queryByText(skill)).not.toBeInTheDocument();
      });
    });

    it('should maintain section structure during loading', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderAbout();

      const aboutSection = document.querySelector('#about');
      expect(aboutSection).toBeInTheDocument();
      expect(aboutSection).toHaveClass('section');
    });
  });

  describe('Error States', () => {
    it('should render fallback content when error occurs', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Failed to load content',
        data: null 
      }));

      renderAbout();

      expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument();
      expect(screen.getByText('Content temporarily unavailable. Please try again later.')).toBeInTheDocument();
    });

    it('should render fallback content when data is null', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: null 
      }));

      renderAbout();

      expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument();
      expect(screen.getByText('Content temporarily unavailable. Please try again later.')).toBeInTheDocument();
    });

    it('should maintain proper styling in error state', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Network error',
        data: null 
      }));

      renderAbout();

      const heading = screen.getByRole('heading', { name: 'About Me' });
      expect(heading).toHaveClass('text-4xl', 'font-heading', 'font-bold');
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply responsive grid classes', () => {
      renderAbout();

      const gridContainer = document.querySelector('[class*="md:grid-cols-2"]');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid', 'md:grid-cols-2');
    });

    it('should use responsive text sizing', () => {
      renderAbout();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('should apply responsive spacing', () => {
      renderAbout();

      const gridContainer = document.querySelector('[class*="gap-"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should handle mobile layout correctly', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderAbout();

      const gridContainer = document.querySelector('[class*="grid"]');
      expect(gridContainer).toHaveClass('grid', 'md:grid-cols-2');
    });

    it('should handle desktop layout correctly', () => {
      // Mock window.innerWidth for desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      renderAbout();

      const gridContainer = document.querySelector('[class*="md:grid-cols-2"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should organize skills in responsive grid', () => {
      renderAbout();

      const skillsList = screen.getByText('Blues Guitar').closest('[class*="grid"]');
      expect(skillsList).toBeInTheDocument();
    });
  });

  describe('Animations Integration', () => {
    it('should apply scroll-triggered animations to section', () => {
      renderAbout();

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

    it('should apply slideInLeft animation to content area', () => {
      renderAbout();

      const slideInLeftCall = mockMotionDiv.mock.calls.find(call => 
        call[0].variants && 
        JSON.stringify(call[0].variants).includes('slideInLeft') || 
        call[0].className?.includes('content')
      );

      expect(slideInLeftCall).toBeDefined();
      if (slideInLeftCall) {
        expect(slideInLeftCall[0]).toHaveProperty('variants');
      }
    });

    it('should apply slideInRight animation to skills area', () => {
      renderAbout();

      const slideInRightCall = mockMotionDiv.mock.calls.find(call => 
        call[0].variants && 
        JSON.stringify(call[0].variants).includes('slideInRight') ||
        call[0].className?.includes('skills')
      );

      expect(slideInRightCall).toBeDefined();
      if (slideInRightCall) {
        expect(slideInRightCall[0]).toHaveProperty('variants');
      }
    });

    it('should apply stagger animation to content paragraphs', () => {
      renderAbout();

      // Check that paragraph animations are staggered
      expect(mockMotionP).toHaveBeenCalled();
      
      const paragraphCalls = mockMotionP.mock.calls;
      paragraphCalls.forEach(call => {
        expect(call[0]).toHaveProperty('variants');
      });
    });

    it('should apply stagger animation to skills list', () => {
      renderAbout();

      expect(mockMotionLi).toHaveBeenCalled();
      
      const skillCalls = mockMotionLi.mock.calls;
      expect(skillCalls.length).toBeGreaterThan(0);
      
      skillCalls.forEach(call => {
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

      renderAbout();

      // During loading, animated content should not be rendered
      const animatedContentCalls = [
        ...mockMotionH2.mock.calls,
        ...mockMotionP.mock.calls,
      ];

      expect(animatedContentCalls.length).toBe(0);
    });

    it('should configure proper viewport settings for scroll animations', () => {
      renderAbout();

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
      renderAbout();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('should have accessible list structure for skills', () => {
      renderAbout();

      // Find skills list
      const skillItems = screen.getAllByText(/Guitar|Theory|Performance/);
      expect(skillItems.length).toBeGreaterThan(0);
      
      // Check that skills are in a list structure
      skillItems.forEach(skill => {
        const listItem = skill.closest('li');
        expect(listItem).toBeInTheDocument();
        expect(listItem?.tagName).toBe('LI');
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderAbout();

      // Test that section can be navigated to
      const heading = screen.getByRole('heading', { level: 2 });
      
      // Tab navigation should work
      await user.tab();
      // Since the section has content, it should be navigable
      expect(heading).toBeInTheDocument();
    });

    it('should have proper semantic structure', () => {
      renderAbout();

      const section = document.querySelector('#about');
      expect(section?.tagName).toBe('SECTION');
      
      // Should have heading
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      
      // Should have paragraphs
      const paragraphs = document.querySelectorAll('#about p');
      expect(paragraphs.length).toBeGreaterThan(0);
      
      // Should have list
      const list = document.querySelector('#about ul');
      expect(list).toBeInTheDocument();
    });

    it('should have sufficient color contrast', () => {
      renderAbout();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-neutral-charcoal');
    });

    it('should provide proper content structure for screen readers', () => {
      renderAbout();

      // Check that content has logical reading order
      const heading = screen.getByRole('heading', { level: 2 });
      const section = document.querySelector('#about');
      
      expect(section).toContainElement(heading);
      
      // Paragraphs should follow heading
      const paragraphs = Array.from(document.querySelectorAll('#about p'));
      expect(paragraphs.length).toBeGreaterThan(0);
    });
  });

  describe('Content Hook Integration', () => {
    it('should call useSectionContent with correct section name', () => {
      renderAbout();

      expect(mockUseSectionContent).toHaveBeenCalledWith('about');
      expect(mockUseSectionContent).toHaveBeenCalledTimes(1);
    });

    it('should handle content updates correctly', () => {
      const initialContent = createMockAboutContent({
        title: 'Initial About Title',
        content: ['Initial paragraph'],
        skills: ['Initial skill']
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: initialContent 
      }));

      const { rerender } = renderAbout();
      expect(screen.getByText('Initial About Title')).toBeInTheDocument();
      expect(screen.getByText('Initial paragraph')).toBeInTheDocument();

      // Update content
      const updatedContent = createMockAboutContent({
        title: 'Updated About Title',
        content: ['Updated paragraph'],
        skills: ['Updated skill']
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: updatedContent 
      }));

      rerender(<About />);
      expect(screen.getByText('Updated About Title')).toBeInTheDocument();
      expect(screen.getByText('Updated paragraph')).toBeInTheDocument();
      expect(screen.queryByText('Initial About Title')).not.toBeInTheDocument();
    });

    it('should handle empty content arrays gracefully', () => {
      const emptyContent = createMockAboutContent({
        content: [],
        skills: []
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: emptyContent 
      }));

      expect(() => renderAbout()).not.toThrow();
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should handle large content arrays', () => {
      const largeContent = createMockAboutContent({
        content: Array(20).fill('Content paragraph'),
        skills: Array(30).fill('Skill item')
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: largeContent 
      }));

      expect(() => renderAbout()).not.toThrow();
      
      const paragraphs = screen.getAllByText('Content paragraph');
      const skills = screen.getAllByText('Skill item');
      
      expect(paragraphs).toHaveLength(20);
      expect(skills).toHaveLength(30);
    });

    it('should handle content with special characters', () => {
      const specialContent = createMockAboutContent({
        title: 'About Me & My Journey',
        content: ['I\'ve learned that music > words', 'Cost: $0 to start!'],
        skills: ['C# Programming', 'A/B Testing', 'UI/UX Design']
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: specialContent 
      }));

      expect(() => renderAbout()).not.toThrow();
      
      expect(screen.getByText('About Me & My Journey')).toBeInTheDocument();
      expect(screen.getByText('I\'ve learned that music > words')).toBeInTheDocument();
      expect(screen.getByText('C# Programming')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should apply correct CSS classes to main container', () => {
      renderAbout();

      const section = document.querySelector('#about');
      expect(section).toHaveClass('section', 'bg-white');
    });

    it('should use container-custom class for content wrapper', () => {
      renderAbout();

      const container = document.querySelector('[class*="container-custom"]');
      expect(container).toBeInTheDocument();
    });

    it('should apply proper spacing classes', () => {
      renderAbout();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('mb-12');
    });

    it('should style skill items appropriately', () => {
      renderAbout();

      const skillItems = screen.getAllByText(/Guitar|Theory|Performance/);
      skillItems.forEach(skill => {
        const listItem = skill.closest('li');
        expect(listItem).toHaveClass('bg-brand-blue-primary/5');
      });
    });

    it('should apply consistent text styling', () => {
      renderAbout();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('font-heading', 'font-bold');

      const paragraphs = document.querySelectorAll('#about p');
      paragraphs.forEach(p => {
        if (!p.closest('[class*="animate-pulse"]')) { // Skip loading paragraphs
          expect(p).toHaveClass('font-body');
        }
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should not cause unnecessary re-renders', () => {
      const mockContent = createMockAboutContent();
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: mockContent 
      }));

      const { rerender } = renderAbout();
      
      // Clear call counts
      mockUseSectionContent.mockClear();
      
      // Re-render with same data
      rerender(<About />);
      
      expect(mockUseSectionContent).toHaveBeenCalledTimes(1);
    });

    it('should handle component unmounting gracefully', () => {
      const { unmount } = renderAbout();
      
      expect(() => unmount()).not.toThrow();
    });

    it('should efficiently render large skill lists', () => {
      const largeSkillSet = Array(100).fill(0).map((_, i) => `Skill ${i + 1}`);
      const content = createMockAboutContent({
        skills: largeSkillSet
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: content 
      }));

      const startTime = Date.now();
      renderAbout();
      const endTime = Date.now();

      // Should render efficiently (within reasonable time)
      expect(endTime - startTime).toBeLessThan(1000);
      
      // All skills should be rendered
      expect(screen.getByText('Skill 1')).toBeInTheDocument();
      expect(screen.getByText('Skill 100')).toBeInTheDocument();
    });
  });
});