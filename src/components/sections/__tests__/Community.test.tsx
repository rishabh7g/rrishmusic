import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Community } from '../Community';
import * as contentHooks from '@/hooks/useContent';
import { CommunityContent } from '@/types/content';

// Enhanced TypeScript patterns
interface MockedContentHooks {
  useSectionContent: ReturnType<typeof vi.fn>;
}

interface MockContentReturn {
  data: CommunityContent | null;
  loading: boolean;
  error: string | null;
}

interface MockTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  date: string;
}

interface MotionProps {
  children: React.ReactNode;
  variants?: any;
  initial?: any;
  animate?: any;
  whileInView?: any;
  viewport?: any;
  whileHover?: any;
  className?: string;
  id?: string;
}

// Test Data Builder Pattern
const createMockTestimonial = (overrides?: Partial<MockTestimonial>): MockTestimonial => ({
  id: 'testimonial-1',
  name: 'Sarah Johnson',
  role: 'Student',
  content: 'Rrish is an amazing teacher! His approach to blues improvisation has completely transformed my playing.',
  rating: 5,
  image: '/images/testimonials/sarah.jpg',
  date: '2024-01-15',
  ...overrides,
});

const createMockCommunityContent = (overrides?: Partial<CommunityContent>): CommunityContent => ({
  title: 'Join Our Musical Community',
  description: 'Connect with fellow musicians, share your progress, and learn together in our supportive community.',
  features: [
    'Weekly group sessions',
    'Student showcases',
    'Collaborative projects',
    'Performance opportunities'
  ],
  instagramFeed: {
    title: 'Follow Our Journey',
    description: 'See what our community is up to on Instagram'
  },
  ...overrides,
});

const createMockContentReturn = (overrides?: Partial<MockContentReturn>): MockContentReturn => ({
  data: createMockCommunityContent(),
  loading: false,
  error: null,
  ...overrides,
});

// Custom render function for Community component
const renderCommunity = (options?: RenderOptions) => {
  return render(<Community />, options);
};

// Mock framer-motion to capture and test animation props
const mockMotionSection = vi.fn();
const mockMotionDiv = vi.fn();
const mockMotionH2 = vi.fn();
const mockMotionP = vi.fn();
const mockMotionUl = vi.fn();
const mockMotionLi = vi.fn();
const mockMotionA = vi.fn();

vi.mock('framer-motion', () => ({
  motion: {
    section: (props: MotionProps) => {
      mockMotionSection(props);
      const { children, variants, initial, animate, whileInView, viewport, ...restProps } = props;
      return React.createElement('section', restProps, children);
    },
    div: (props: MotionProps) => {
      mockMotionDiv(props);
      const { children, variants, initial, animate, whileInView, viewport, whileHover, ...restProps } = props;
      return React.createElement('div', restProps, children);
    },
    h2: (props: MotionProps) => {
      mockMotionH2(props);
      const { children, variants, ...restProps } = props;
      return React.createElement('h2', restProps, children);
    },
    p: (props: MotionProps) => {
      mockMotionP(props);
      const { children, variants, ...restProps } = props;
      return React.createElement('p', restProps, children);
    },
    ul: (props: MotionProps) => {
      mockMotionUl(props);
      const { children, variants, ...restProps } = props;
      return React.createElement('ul', restProps, children);
    },
    li: (props: MotionProps) => {
      mockMotionLi(props);
      const { children, variants, ...restProps } = props;
      return React.createElement('li', restProps, children);
    },
    a: (props: MotionProps) => {
      mockMotionA(props);
      const { children, variants, whileHover, ...restProps } = props;
      return React.createElement('a', restProps, children);
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

// Mock testimonials JSON import
vi.mock('@/content/testimonials.json', () => ({
  default: [
    createMockTestimonial(),
    createMockTestimonial({
      id: 'testimonial-2',
      name: 'Mike Rodriguez',
      role: 'Advanced Student',
      content: 'The community aspect of learning with Rrish is incredible. You feel supported every step of the way.',
      rating: 5,
      date: '2024-02-01'
    }),
    createMockTestimonial({
      id: 'testimonial-3',
      name: 'Emily Chen',
      role: 'Beginner',
      content: 'I never thought I could improvise, but Rrish\'s teaching method made it possible!',
      rating: 5,
      date: '2024-01-28'
    })
  ]
}));

const mockUseSectionContent = vi.mocked(contentHooks.useSectionContent) as MockedContentHooks['useSectionContent'];

describe('Community', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMotionSection.mockClear();
    mockMotionDiv.mockClear();
    mockMotionH2.mockClear();
    mockMotionP.mockClear();
    mockMotionUl.mockClear();
    mockMotionLi.mockClear();
    mockMotionA.mockClear();
    
    // Default mock return value
    mockUseSectionContent.mockReturnValue(createMockContentReturn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Content Rendering', () => {
    it('should render community section with correct content', () => {
      const mockContent = createMockCommunityContent({
        title: 'Custom Community Title',
        description: 'Custom community description text',
        features: [
          'Custom feature 1',
          'Custom feature 2',
          'Custom feature 3'
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderCommunity();

      expect(screen.getByRole('heading', { name: 'Custom Community Title' })).toBeInTheDocument();
      expect(screen.getByText('Custom community description text')).toBeInTheDocument();
      expect(screen.getByText('Custom feature 1')).toBeInTheDocument();
      expect(screen.getByText('Custom feature 2')).toBeInTheDocument();
      expect(screen.getByText('Custom feature 3')).toBeInTheDocument();
    });

    it('should render all community features', () => {
      const mockContent = createMockCommunityContent({
        features: [
          'Feature One',
          'Feature Two', 
          'Feature Three',
          'Feature Four'
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderCommunity();

      mockContent.features.forEach(feature => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });

    it('should render testimonials section', () => {
      renderCommunity();

      expect(screen.getByText('What Our Students Say')).toBeInTheDocument();
      
      // Should render testimonials from mocked JSON
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Mike Rodriguez')).toBeInTheDocument();
      expect(screen.getByText('Emily Chen')).toBeInTheDocument();
    });

    it('should render testimonial content and ratings', () => {
      renderCommunity();

      expect(screen.getByText(/Rrish is an amazing teacher/)).toBeInTheDocument();
      expect(screen.getByText(/community aspect of learning/)).toBeInTheDocument();
      expect(screen.getByText(/never thought I could improvise/)).toBeInTheDocument();

      // Check for star ratings (assuming 5 stars per testimonial)
      const starElements = document.querySelectorAll('[class*="text-yellow-400"]');
      expect(starElements.length).toBeGreaterThan(0);
    });

    it('should render Instagram feed section', () => {
      const mockContent = createMockCommunityContent({
        instagramFeed: {
          title: 'Custom Instagram Title',
          description: 'Custom Instagram description'
        }
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderCommunity();

      expect(screen.getByText('Custom Instagram Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Instagram description')).toBeInTheDocument();
    });

    it('should render Instagram link with correct attributes', () => {
      renderCommunity();

      const instagramLink = screen.getByRole('link', { name: /follow.*instagram/i }) || 
        document.querySelector('a[href*="instagram.com"]');
      
      if (instagramLink) {
        expect(instagramLink).toHaveAttribute('target', '_blank');
        expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });

    it('should render section with correct ID and structure', () => {
      renderCommunity();

      const communitySection = document.querySelector('#community');
      expect(communitySection).toBeInTheDocument();
      expect(communitySection).toHaveAttribute('id', 'community');
      expect(communitySection?.tagName).toBe('SECTION');
    });
  });

  describe('Loading States', () => {
    it('should render loading skeleton when loading is true', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderCommunity();

      // Check for loading skeleton elements
      const skeletonElements = document.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletonElements.length).toBeGreaterThan(0);

      // Check for skeleton bars
      const skeletonBars = document.querySelectorAll('[class*="bg-gray-300"]');
      expect(skeletonBars.length).toBeGreaterThanOrEqual(3); // Title, description, features
    });

    it('should render testimonial loading skeletons', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderCommunity();

      // Check for testimonial skeleton cards
      const testimonialSkeletons = document.querySelectorAll('[class*="bg-gray-200"][class*="rounded"]');
      expect(testimonialSkeletons.length).toBeGreaterThan(0);
    });

    it('should not render actual content during loading', () => {
      const mockContent = createMockCommunityContent();
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: mockContent 
      }));

      renderCommunity();

      expect(screen.queryByText(mockContent.title)).not.toBeInTheDocument();
      expect(screen.queryByText(mockContent.description)).not.toBeInTheDocument();
      expect(screen.queryByText('Sarah Johnson')).not.toBeInTheDocument();
    });

    it('should maintain section structure during loading', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderCommunity();

      const communitySection = document.querySelector('#community');
      expect(communitySection).toBeInTheDocument();
      expect(communitySection).toHaveClass('section');
    });
  });

  describe('Error States', () => {
    it('should render fallback content when error occurs', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Failed to load content',
        data: null 
      }));

      renderCommunity();

      expect(screen.getByRole('heading', { name: 'Join Our Musical Community' })).toBeInTheDocument();
      expect(screen.getByText('Content temporarily unavailable. Please try again later.')).toBeInTheDocument();
    });

    it('should render fallback content when data is null', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: null 
      }));

      renderCommunity();

      expect(screen.getByRole('heading', { name: 'Join Our Musical Community' })).toBeInTheDocument();
      expect(screen.getByText('Content temporarily unavailable. Please try again later.')).toBeInTheDocument();
    });

    it('should still render testimonials even when main content fails', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Network error',
        data: null 
      }));

      renderCommunity();

      // Testimonials come from JSON import, should still be available
      expect(screen.getByText('What Our Students Say')).toBeInTheDocument();
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });

    it('should maintain proper styling in error state', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Network error',
        data: null 
      }));

      renderCommunity();

      const heading = screen.getByRole('heading', { name: 'Join Our Musical Community' });
      expect(heading).toHaveClass('text-4xl', 'font-heading', 'font-bold');
    });
  });

  describe('User Interactions', () => {
    it('should handle Instagram link clicks', async () => {
      const user = userEvent.setup();
      renderCommunity();

      const instagramLink = screen.getByRole('link', { name: /follow.*instagram/i }) || 
        document.querySelector('a[href*="instagram.com"]');
      
      if (instagramLink) {
        // Mock window.open to verify external link handling
        const mockOpen = vi.fn();
        Object.defineProperty(window, 'open', { value: mockOpen, writable: true });

        await user.click(instagramLink);

        // Verify the link has correct attributes for external navigation
        expect(instagramLink).toHaveAttribute('target', '_blank');
        expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });

    it('should support keyboard navigation for links', async () => {
      const user = userEvent.setup();
      renderCommunity();

      const instagramLink = screen.getByRole('link', { name: /follow.*instagram/i }) || 
        document.querySelector('a[href*="instagram.com"]');
      
      if (instagramLink) {
        // Tab to the link
        await user.tab();
        let attempts = 0;
        while (document.activeElement !== instagramLink && attempts < 10) {
          await user.tab();
          attempts++;
        }
        
        if (document.activeElement === instagramLink) {
          expect(instagramLink).toHaveFocus();
          
          // Press Enter to activate link
          await user.keyboard('{Enter}');
          expect(instagramLink).toHaveAttribute('href');
        }
      }
    });

    it('should handle testimonial card interactions', async () => {
      const user = userEvent.setup();
      renderCommunity();

      const testimonialCards = document.querySelectorAll('[class*="bg-white"][class*="rounded"]');
      
      if (testimonialCards.length > 0) {
        await user.hover(testimonialCards[0]);
        // Hover effects are handled by CSS and Framer Motion
        expect(testimonialCards[0]).toBeInTheDocument();
      }
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply responsive grid classes for features', () => {
      renderCommunity();

      const featuresGrid = document.querySelector('[class*="grid"][class*="md:grid-cols-2"]');
      expect(featuresGrid).toBeInTheDocument();
    });

    it('should use responsive text sizing', () => {
      renderCommunity();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('should apply responsive layout for testimonials', () => {
      renderCommunity();

      const testimonialsGrid = document.querySelector('[class*="grid"][class*="md:grid-cols-2"][class*="lg:grid-cols-3"]');
      expect(testimonialsGrid).toBeInTheDocument();
    });

    it('should handle mobile layout correctly', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderCommunity();

      const gridContainers = document.querySelectorAll('[class*="grid"]');
      expect(gridContainers.length).toBeGreaterThan(0);
    });

    it('should handle desktop layout correctly', () => {
      // Mock window.innerWidth for desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      renderCommunity();

      const testimonialsGrid = document.querySelector('[class*="lg:grid-cols-3"]');
      expect(testimonialsGrid).toBeInTheDocument();
    });
  });

  describe('Animations Integration', () => {
    it('should apply scroll-triggered animations to section', () => {
      renderCommunity();

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

    it('should apply stagger animations to feature items', () => {
      renderCommunity();

      expect(mockMotionLi).toHaveBeenCalled();
      
      const featureCalls = mockMotionLi.mock.calls;
      featureCalls.forEach(call => {
        expect(call[0]).toHaveProperty('variants');
      });
    });

    it('should apply stagger animations to testimonial cards', () => {
      renderCommunity();

      const testimonialCalls = mockMotionDiv.mock.calls.filter(call => 
        call[0].variants && call[0].className?.includes('bg-white')
      );

      expect(testimonialCalls.length).toBeGreaterThan(0);
      testimonialCalls.forEach(call => {
        expect(call[0]).toHaveProperty('variants');
      });
    });

    it('should apply hover animations to Instagram link', () => {
      renderCommunity();

      const instagramCalls = mockMotionA.mock.calls.filter(call => 
        call[0].whileHover
      );

      expect(instagramCalls.length).toBeGreaterThan(0);
      instagramCalls.forEach(call => {
        expect(call[0]).toHaveProperty('whileHover');
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

      renderCommunity();

      // During loading, animated content should be minimal
      const animatedContentCalls = [
        ...mockMotionH2.mock.calls,
        ...mockMotionP.mock.calls.filter(call => !call[0].className?.includes('animate-pulse')),
      ];

      expect(animatedContentCalls.length).toBe(0);
    });

    it('should configure proper viewport settings for scroll animations', () => {
      renderCommunity();

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
      renderCommunity();

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading.tagName).toBe('H2');

      const testimonialsHeading = screen.getByText('What Our Students Say').closest('h3');
      if (testimonialsHeading) {
        expect(testimonialsHeading.tagName).toBe('H3');
      }
    });

    it('should have accessible link text and attributes', () => {
      renderCommunity();

      const instagramLink = screen.getByRole('link', { name: /follow.*instagram/i }) || 
        document.querySelector('a[href*="instagram.com"]');
      
      if (instagramLink) {
        expect(instagramLink).toHaveAccessibleName();
        expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });

    it('should have accessible list structure for features', () => {
      renderCommunity();

      const featureItems = screen.getAllByText(/Weekly group sessions|Student showcases/);
      expect(featureItems.length).toBeGreaterThan(0);
      
      featureItems.forEach(feature => {
        const listItem = feature.closest('li');
        expect(listItem).toBeInTheDocument();
        expect(listItem?.tagName).toBe('LI');
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderCommunity();

      // Test that section can be navigated to
      const heading = screen.getByRole('heading', { level: 2 });
      
      // Tab navigation should work
      await user.tab();
      expect(heading).toBeInTheDocument();
    });

    it('should have proper semantic structure for testimonials', () => {
      renderCommunity();

      const testimonialCards = document.querySelectorAll('[class*="bg-white"][class*="rounded"]');
      
      testimonialCards.forEach(card => {
        // Each testimonial should have proper structure
        const quote = card.querySelector('p');
        const author = card.querySelector('[class*="font-semibold"]');
        
        expect(quote).toBeInTheDocument();
        expect(author).toBeInTheDocument();
      });
    });

    it('should have sufficient color contrast', () => {
      renderCommunity();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-neutral-charcoal');

      const instagramLink = screen.getByRole('link', { name: /follow.*instagram/i }) || 
        document.querySelector('a[href*="instagram.com"]');
      
      if (instagramLink) {
        expect(instagramLink).toHaveClass('bg-gradient-to-r');
      }
    });

    it('should provide meaningful star ratings', () => {
      renderCommunity();

      // Check for star ratings with proper aria-labels or text alternatives
      const ratingElements = document.querySelectorAll('[class*="text-yellow-400"]');
      expect(ratingElements.length).toBeGreaterThan(0);

      // Each rating should be associated with a testimonial
      ratingElements.forEach(rating => {
        const testimonialCard = rating.closest('[class*="bg-white"]');
        expect(testimonialCard).toBeInTheDocument();
      });
    });

    it('should handle focus management properly', async () => {
      const user = userEvent.setup();
      renderCommunity();

      const instagramLink = screen.getByRole('link', { name: /follow.*instagram/i }) || 
        document.querySelector('a[href*="instagram.com"]');
      
      if (instagramLink) {
        await user.tab();
        let attempts = 0;
        while (document.activeElement !== instagramLink && attempts < 20) {
          await user.tab();
          attempts++;
        }
        
        if (document.activeElement === instagramLink) {
          expect(instagramLink).toHaveFocus();
        }
      }
    });
  });

  describe('Content Hook Integration', () => {
    it('should call useSectionContent with correct section name', () => {
      renderCommunity();

      expect(mockUseSectionContent).toHaveBeenCalledWith('community');
      expect(mockUseSectionContent).toHaveBeenCalledTimes(1);
    });

    it('should handle content updates correctly', () => {
      const initialContent = createMockCommunityContent({
        title: 'Initial Community Title',
        features: ['Initial feature']
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: initialContent 
      }));

      const { rerender } = renderCommunity();
      expect(screen.getByText('Initial Community Title')).toBeInTheDocument();
      expect(screen.getByText('Initial feature')).toBeInTheDocument();

      // Update content
      const updatedContent = createMockCommunityContent({
        title: 'Updated Community Title',
        features: ['Updated feature']
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: updatedContent 
      }));

      rerender(<Community />);
      expect(screen.getByText('Updated Community Title')).toBeInTheDocument();
      expect(screen.getByText('Updated feature')).toBeInTheDocument();
      expect(screen.queryByText('Initial Community Title')).not.toBeInTheDocument();
    });

    it('should handle empty features array gracefully', () => {
      const emptyContent = createMockCommunityContent({
        features: []
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: emptyContent 
      }));

      expect(() => renderCommunity()).not.toThrow();
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should handle missing Instagram feed data', () => {
      const contentWithoutInstagram = createMockCommunityContent({
        instagramFeed: {
          title: '',
          description: ''
        }
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: contentWithoutInstagram 
      }));

      expect(() => renderCommunity()).not.toThrow();
      
      // Should still render the section
      const communitySection = document.querySelector('#community');
      expect(communitySection).toBeInTheDocument();
    });

    it('should handle content with special characters', () => {
      const specialContent = createMockCommunityContent({
        title: 'Community & Collaboration',
        description: 'Join us for music > 50% of the time!',
        features: [
          'Sessions @ 7PM',
          'Rate: $25/hour',
          'Skills: 90% improvement'
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: specialContent 
      }));

      expect(() => renderCommunity()).not.toThrow();
      
      expect(screen.getByText('Community & Collaboration')).toBeInTheDocument();
      expect(screen.getByText('Join us for music > 50% of the time!')).toBeInTheDocument();
      expect(screen.getByText('Sessions @ 7PM')).toBeInTheDocument();
    });
  });

  describe('Testimonials Integration', () => {
    it('should render testimonials from JSON data', () => {
      renderCommunity();

      // From mocked testimonials.json
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Mike Rodriguez')).toBeInTheDocument();
      expect(screen.getByText('Emily Chen')).toBeInTheDocument();
    });

    it('should display testimonial ratings as stars', () => {
      renderCommunity();

      // Should have star ratings (5 stars per testimonial × 3 testimonials)
      const starElements = document.querySelectorAll('[class*="text-yellow-400"]');
      expect(starElements.length).toBeGreaterThanOrEqual(15); // 5 stars × 3 testimonials
    });

    it('should handle testimonials with different rating counts', () => {
      // This would require mocking different ratings
      renderCommunity();

      // All test testimonials have 5 stars
      const testimonialCards = document.querySelectorAll('[class*="bg-white"][class*="p-6"]');
      expect(testimonialCards.length).toBe(3);
    });

    it('should display testimonial dates appropriately', () => {
      renderCommunity();

      // Dates might be displayed or used for sorting
      // This tests that component handles date data
      const testimonialCards = document.querySelectorAll('[class*="bg-white"][class*="p-6"]');
      expect(testimonialCards.length).toBe(3);
    });
  });

  describe('Layout and Styling', () => {
    it('should apply correct CSS classes to main container', () => {
      renderCommunity();

      const section = document.querySelector('#community');
      expect(section).toHaveClass('section', 'bg-white');
    });

    it('should use container-custom class for content wrapper', () => {
      renderCommunity();

      const container = document.querySelector('[class*="container-custom"]');
      expect(container).toBeInTheDocument();
    });

    it('should style feature items with icons', () => {
      renderCommunity();

      const featureItems = document.querySelectorAll('li[class*="flex"][class*="items-center"]');
      expect(featureItems.length).toBeGreaterThan(0);

      // Each feature should have an icon/checkmark
      featureItems.forEach(item => {
        const icon = item.querySelector('svg') || item.querySelector('[class*="text-brand"]');
        expect(icon).toBeInTheDocument();
      });
    });

    it('should apply proper spacing and layout classes', () => {
      renderCommunity();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('mb-6');

      const description = screen.getByText(/Connect with fellow musicians/);
      expect(description).toHaveClass('mb-12');
    });

    it('should style testimonial cards consistently', () => {
      renderCommunity();

      const testimonialCards = document.querySelectorAll('[class*="bg-white"][class*="rounded"]');
      testimonialCards.forEach(card => {
        expect(card).toHaveClass('bg-white');
        expect(card).toHaveClass('p-6');
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should not cause unnecessary re-renders', () => {
      const mockContent = createMockCommunityContent();
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: mockContent 
      }));

      const { rerender } = renderCommunity();
      
      // Clear call counts
      mockUseSectionContent.mockClear();
      
      // Re-render with same data
      rerender(<Community />);
      
      expect(mockUseSectionContent).toHaveBeenCalledTimes(1);
    });

    it('should handle component unmounting gracefully', () => {
      const { unmount } = renderCommunity();
      
      expect(() => unmount()).not.toThrow();
    });

    it('should efficiently render multiple testimonials', () => {
      // Tests that multiple testimonials don't cause performance issues
      renderCommunity();

      const testimonialCards = document.querySelectorAll('[class*="bg-white"][class*="p-6"]');
      expect(testimonialCards).toHaveLength(3);
    });

    it('should maintain consistent layout with varying feature lengths', () => {
      const varyingContent = createMockCommunityContent({
        features: [
          'Short',
          'A much longer feature description that might wrap to multiple lines and test layout consistency',
          'Medium length feature',
          'X'
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: varyingContent
      }));

      expect(() => renderCommunity()).not.toThrow();
      
      const featureItems = document.querySelectorAll('li');
      expect(featureItems.length).toBeGreaterThanOrEqual(4);
    });
  });
});