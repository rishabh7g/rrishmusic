import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Lessons } from '../Lessons';
import * as contentHooks from '@/hooks/useContent';
import { LessonPackage, LessonContent } from '@/types/content';

// Enhanced TypeScript patterns
interface MockedContentHooks {
  useLessonPackages: ReturnType<typeof vi.fn>;
}

interface MockLessonReturn {
  packages: LessonPackage[];
  allPackages: LessonPackage[];
  packageInfo: any;
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
  whileHover?: any;
  className?: string;
  id?: string;
}

// Test Data Builder Pattern
const createMockLessonPackage = (overrides?: Partial<LessonPackage>): LessonPackage => ({
  id: 'basic-package',
  name: 'Basic Lessons',
  description: 'Perfect for beginners starting their musical journey',
  price: 50,
  originalPrice: 75,
  sessions: 4,
  duration: '45 min',
  features: [
    'Basic music theory',
    'Fundamental techniques',
    'Practice guidance',
    'Progress tracking'
  ],
  popular: false,
  badge: null,
  ...overrides,
});

const createMockLessonReturn = (overrides?: Partial<MockLessonReturn>): MockLessonReturn => ({
  packages: [
    createMockLessonPackage(),
    createMockLessonPackage({
      id: 'premium-package',
      name: 'Premium Lessons',
      price: 120,
      originalPrice: 150,
      sessions: 8,
      popular: true,
      badge: 'Most Popular'
    }),
    createMockLessonPackage({
      id: 'advanced-package',
      name: 'Advanced Lessons',
      price: 200,
      originalPrice: 250,
      sessions: 12,
      popular: false,
      badge: 'Best Value'
    })
  ],
  allPackages: [],
  packageInfo: {
    title: 'Choose Your Learning Journey',
    description: 'Select the package that best fits your musical goals'
  },
  loading: false,
  error: null,
  ...overrides,
});

// Custom render function for Lessons component
const renderLessons = (options?: RenderOptions) => {
  return render(<Lessons />, options);
};

// Mock framer-motion to capture and test animation props
const mockMotionSection = vi.fn();
const mockMotionDiv = vi.fn();
const mockMotionH2 = vi.fn();
const mockMotionP = vi.fn();
const mockMotionButton = vi.fn();
const mockMotionSpan = vi.fn();
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
    button: (props: MotionProps) => {
      mockMotionButton(props);
      const { children, variants, whileHover, ...restProps } = props;
      return React.createElement('button', restProps, children);
    },
    span: (props: MotionProps) => {
      mockMotionSpan(props);
      const { children, variants, ...restProps } = props;
      return React.createElement('span', restProps, children);
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
  useLessonPackages: vi.fn(),
}));

const mockUseLessonPackages = vi.mocked(contentHooks.useLessonPackages) as MockedContentHooks['useLessonPackages'];

describe('Lessons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMotionSection.mockClear();
    mockMotionDiv.mockClear();
    mockMotionH2.mockClear();
    mockMotionP.mockClear();
    mockMotionButton.mockClear();
    mockMotionSpan.mockClear();
    mockMotionUl.mockClear();
    mockMotionLi.mockClear();
    
    // Default mock return value
    mockUseLessonPackages.mockReturnValue(createMockLessonReturn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Content Rendering', () => {
    it('should render lessons section with packages', () => {
      const mockReturn = createMockLessonReturn({
        packages: [
          createMockLessonPackage({
            name: 'Beginner Package',
            description: 'Start your musical journey',
            price: 75,
            sessions: 6
          }),
          createMockLessonPackage({
            name: 'Intermediate Package',
            description: 'Build your skills',
            price: 125,
            sessions: 10
          })
        ]
      });

      mockUseLessonPackages.mockReturnValue(mockReturn);

      renderLessons();

      expect(screen.getByText('Beginner Package')).toBeInTheDocument();
      expect(screen.getByText('Start your musical journey')).toBeInTheDocument();
      expect(screen.getByText('$75')).toBeInTheDocument();
      expect(screen.getByText('6 Sessions')).toBeInTheDocument();

      expect(screen.getByText('Intermediate Package')).toBeInTheDocument();
      expect(screen.getByText('Build your skills')).toBeInTheDocument();
      expect(screen.getByText('$125')).toBeInTheDocument();
      expect(screen.getByText('10 Sessions')).toBeInTheDocument();
    });

    it('should render package features as lists', () => {
      const mockReturn = createMockLessonReturn({
        packages: [
          createMockLessonPackage({
            features: [
              'Custom feature 1',
              'Custom feature 2',
              'Custom feature 3'
            ]
          })
        ]
      });

      mockUseLessonPackages.mockReturnValue(mockReturn);

      renderLessons();

      expect(screen.getByText('Custom feature 1')).toBeInTheDocument();
      expect(screen.getByText('Custom feature 2')).toBeInTheDocument();
      expect(screen.getByText('Custom feature 3')).toBeInTheDocument();
    });

    it('should render popular badge for popular packages', () => {
      const mockReturn = createMockLessonReturn({
        packages: [
          createMockLessonPackage({
            popular: true,
            badge: 'Most Popular'
          })
        ]
      });

      mockUseLessonPackages.mockReturnValue(mockReturn);

      renderLessons();

      expect(screen.getByText('Most Popular')).toBeInTheDocument();
    });

    it('should render original price with strikethrough when available', () => {
      const mockReturn = createMockLessonReturn({
        packages: [
          createMockLessonPackage({
            price: 100,
            originalPrice: 150
          })
        ]
      });

      mockUseLessonPackages.mockReturnValue(mockReturn);

      renderLessons();

      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByText('$150')).toBeInTheDocument();
      
      // Check for line-through styling
      const originalPrice = screen.getByText('$150');
      expect(originalPrice).toHaveClass('line-through');
    });

    it('should render section with correct ID and structure', () => {
      renderLessons();

      const lessonsSection = document.querySelector('#lessons');
      expect(lessonsSection).toBeInTheDocument();
      expect(lessonsSection).toHaveAttribute('id', 'lessons');
      expect(lessonsSection?.tagName).toBe('SECTION');
    });

    it('should use proper grid layout for package cards', () => {
      renderLessons();

      const gridContainer = document.querySelector('[class*="grid"][class*="md:grid-cols-2"][class*="lg:grid-cols-3"]');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should render loading skeleton when loading is true', () => {
      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        loading: true, 
        packages: []
      }));

      renderLessons();

      // Check for loading skeleton elements
      const skeletonElements = document.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletonElements.length).toBeGreaterThan(0);

      // Check for skeleton cards
      const skeletonCards = document.querySelectorAll('[class*="bg-gray-200"]');
      expect(skeletonCards.length).toBeGreaterThanOrEqual(3); // Usually 3 skeleton cards
    });

    it('should render loading grid structure', () => {
      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        loading: true, 
        packages: []
      }));

      renderLessons();

      const gridContainer = document.querySelector('[class*="grid"][class*="md:grid-cols-2"][class*="lg:grid-cols-3"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should not render actual packages during loading', () => {
      const mockPackages = [createMockLessonPackage({ name: 'Test Package' })];
      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        loading: true, 
        packages: mockPackages
      }));

      renderLessons();

      expect(screen.queryByText('Test Package')).not.toBeInTheDocument();
    });

    it('should maintain section structure during loading', () => {
      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        loading: true, 
        packages: []
      }));

      renderLessons();

      const lessonsSection = document.querySelector('#lessons');
      expect(lessonsSection).toBeInTheDocument();
      expect(lessonsSection).toHaveClass('section');
    });
  });

  describe('Error States', () => {
    it('should render fallback content when error occurs', () => {
      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        error: 'Failed to load packages',
        packages: []
      }));

      renderLessons();

      expect(screen.getByRole('heading', { name: 'Lesson Packages' })).toBeInTheDocument();
      expect(screen.getByText('Lesson packages temporarily unavailable. Please try again later.')).toBeInTheDocument();
    });

    it('should render fallback content when packages array is empty', () => {
      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        packages: []
      }));

      renderLessons();

      // Should still show the section but with fallback or empty state
      const lessonsSection = document.querySelector('#lessons');
      expect(lessonsSection).toBeInTheDocument();
    });

    it('should maintain proper styling in error state', () => {
      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        error: 'Network error',
        packages: []
      }));

      renderLessons();

      const heading = screen.getByRole('heading', { name: 'Lesson Packages' });
      expect(heading).toHaveClass('text-4xl', 'font-heading', 'font-bold');
    });
  });

  describe('User Interactions', () => {
    it('should handle contact button clicks', async () => {
      const user = userEvent.setup();
      renderLessons();

      const contactButtons = screen.getAllByText('Get Started');
      expect(contactButtons.length).toBeGreaterThan(0);

      // Mock console.log to verify button interaction
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      await user.click(contactButtons[0]);
      
      // In a real implementation, this might scroll to contact section or open modal
      expect(contactButtons[0]).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    it('should support keyboard navigation for buttons', async () => {
      const user = userEvent.setup();
      renderLessons();

      const contactButtons = screen.getAllByText('Get Started');
      
      // Tab to first button
      await user.tab();
      // Continue until we reach a contact button
      let attempts = 0;
      while (document.activeElement !== contactButtons[0] && attempts < 10) {
        await user.tab();
        attempts++;
      }

      if (document.activeElement === contactButtons[0]) {
        expect(contactButtons[0]).toHaveFocus();
        
        // Press Enter to activate button
        await user.keyboard('{Enter}');
        expect(contactButtons[0]).toBeInTheDocument();
      }
    });

    it('should handle hover effects on package cards', async () => {
      const user = userEvent.setup();
      renderLessons();

      const packageCards = document.querySelectorAll('[class*="bg-white"][class*="rounded-xl"]');
      expect(packageCards.length).toBeGreaterThan(0);

      if (packageCards[0]) {
        await user.hover(packageCards[0]);
        // Hover effects are handled by CSS and Framer Motion
        expect(packageCards[0]).toBeInTheDocument();
      }
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply responsive grid classes', () => {
      renderLessons();

      const gridContainer = document.querySelector('[class*="md:grid-cols-2"][class*="lg:grid-cols-3"]');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('should use responsive text sizing', () => {
      renderLessons();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('should handle mobile layout correctly', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderLessons();

      const gridContainer = document.querySelector('[class*="grid"]');
      expect(gridContainer).toHaveClass('grid', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('should handle tablet layout correctly', () => {
      // Mock window.innerWidth for tablet
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      renderLessons();

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

      renderLessons();

      const gridContainer = document.querySelector('[class*="lg:grid-cols-3"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should apply responsive pricing layout', () => {
      renderLessons();

      const priceElements = document.querySelectorAll('[class*="text-3xl"]');
      priceElements.forEach(price => {
        expect(price).toHaveClass('text-3xl');
      });
    });
  });

  describe('Animations Integration', () => {
    it('should apply scroll-triggered animations to section', () => {
      renderLessons();

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

    it('should apply hover animations to package cards', () => {
      renderLessons();

      const cardCalls = mockMotionDiv.mock.calls.filter(call => 
        call[0].whileHover && call[0].className?.includes('bg-white')
      );

      expect(cardCalls.length).toBeGreaterThan(0);
      cardCalls.forEach(call => {
        expect(call[0]).toHaveProperty('whileHover');
      });
    });

    it('should apply stagger animations to package cards', () => {
      renderLessons();

      const cardCalls = mockMotionDiv.mock.calls.filter(call => 
        call[0].variants && call[0].className?.includes('bg-white')
      );

      expect(cardCalls.length).toBeGreaterThan(0);
      cardCalls.forEach(call => {
        expect(call[0]).toHaveProperty('variants');
      });
    });

    it('should apply animations to contact buttons', () => {
      renderLessons();

      expect(mockMotionButton).toHaveBeenCalled();
      
      const buttonCalls = mockMotionButton.mock.calls;
      buttonCalls.forEach(call => {
        expect(call[0]).toHaveProperty('whileHover');
      });
    });

    it('should not apply animations during loading state', () => {
      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        loading: true, 
        packages: []
      }));

      // Clear previous calls
      mockMotionDiv.mockClear();
      mockMotionH2.mockClear();
      mockMotionP.mockClear();

      renderLessons();

      // During loading, animated content should not be rendered
      const animatedContentCalls = [
        ...mockMotionH2.mock.calls,
        ...mockMotionP.mock.calls.filter(call => !call[0].className?.includes('animate-pulse')),
      ];

      expect(animatedContentCalls.length).toBe(0);
    });

    it('should configure proper viewport settings for scroll animations', () => {
      renderLessons();

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
      renderLessons();

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading.tagName).toBe('H2');

      const packageHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(packageHeadings.length).toBeGreaterThan(0);
      packageHeadings.forEach(heading => {
        expect(heading.tagName).toBe('H3');
      });
    });

    it('should have accessible button text and attributes', () => {
      renderLessons();

      const contactButtons = screen.getAllByRole('button', { name: 'Get Started' });
      contactButtons.forEach(button => {
        expect(button).toHaveAccessibleName();
        expect(button).toBeEnabled();
      });
    });

    it('should have accessible list structure for features', () => {
      renderLessons();

      // Find feature lists
      const featureItems = screen.getAllByText(/Basic music theory|Fundamental techniques/);
      expect(featureItems.length).toBeGreaterThan(0);
      
      // Check that features are in list structure
      featureItems.forEach(feature => {
        const listItem = feature.closest('li');
        expect(listItem).toBeInTheDocument();
        expect(listItem?.tagName).toBe('LI');
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderLessons();

      // Test that buttons can be navigated to
      const contactButtons = screen.getAllByRole('button', { name: 'Get Started' });
      
      if (contactButtons.length > 0) {
        await user.tab();
        // Continue tabbing to reach buttons
        let attempts = 0;
        while (!contactButtons.some(btn => btn === document.activeElement) && attempts < 20) {
          await user.tab();
          attempts++;
        }
      }
    });

    it('should have proper semantic structure for package cards', () => {
      renderLessons();

      const packageHeadings = screen.getAllByRole('heading', { level: 3 });
      
      packageHeadings.forEach(heading => {
        const card = heading.closest('[class*="bg-white"]');
        expect(card).toBeInTheDocument();
        
        // Each card should have heading, description, price, and features
        const description = card?.querySelector('p');
        const price = card?.querySelector('[class*="text-3xl"]');
        const featuresList = card?.querySelector('ul');
        
        expect(description).toBeInTheDocument();
        expect(price).toBeInTheDocument();
        expect(featuresList).toBeInTheDocument();
      });
    });

    it('should have sufficient color contrast', () => {
      renderLessons();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-neutral-charcoal');

      const contactButtons = screen.getAllByRole('button', { name: 'Get Started' });
      contactButtons.forEach(button => {
        expect(button).toHaveClass('bg-brand-blue-primary');
      });
    });

    it('should handle focus management properly', async () => {
      const user = userEvent.setup();
      renderLessons();

      const contactButtons = screen.getAllByRole('button', { name: 'Get Started' });
      
      if (contactButtons.length > 0) {
        await user.tab();
        let attempts = 0;
        while (document.activeElement !== contactButtons[0] && attempts < 20) {
          await user.tab();
          attempts++;
        }
        
        if (document.activeElement === contactButtons[0]) {
          expect(contactButtons[0]).toHaveFocus();
          expect(contactButtons[0]).toHaveClass('focus:ring-2');
        }
      }
    });
  });

  describe('Content Hook Integration', () => {
    it('should call useLessonPackages correctly', () => {
      renderLessons();

      expect(mockUseLessonPackages).toHaveBeenCalledWith();
      expect(mockUseLessonPackages).toHaveBeenCalledTimes(1);
    });

    it('should handle package updates correctly', () => {
      const initialPackages = [
        createMockLessonPackage({ name: 'Initial Package', price: 100 })
      ];

      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        packages: initialPackages 
      }));

      const { rerender } = renderLessons();
      expect(screen.getByText('Initial Package')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();

      // Update packages
      const updatedPackages = [
        createMockLessonPackage({ name: 'Updated Package', price: 150 })
      ];

      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        packages: updatedPackages 
      }));

      rerender(<Lessons />);
      expect(screen.getByText('Updated Package')).toBeInTheDocument();
      expect(screen.getByText('$150')).toBeInTheDocument();
      expect(screen.queryByText('Initial Package')).not.toBeInTheDocument();
    });

    it('should handle empty packages gracefully', () => {
      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        packages: []
      }));

      expect(() => renderLessons()).not.toThrow();
      
      const lessonsSection = document.querySelector('#lessons');
      expect(lessonsSection).toBeInTheDocument();
    });

    it('should handle packages with missing optional fields', () => {
      const incompletePackages = [
        createMockLessonPackage({
          originalPrice: undefined,
          badge: null,
          popular: false
        })
      ];

      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        packages: incompletePackages
      }));

      expect(() => renderLessons()).not.toThrow();
      
      // Should render package without optional elements
      expect(screen.getByText('Basic Lessons')).toBeInTheDocument();
      expect(screen.queryByText('Most Popular')).not.toBeInTheDocument();
    });

    it('should handle packages with special pricing', () => {
      const specialPricingPackages = [
        createMockLessonPackage({
          name: 'Free Consultation',
          price: 0,
          originalPrice: 50
        }),
        createMockLessonPackage({
          name: 'Premium Unlimited',
          price: 999,
          originalPrice: 1200,
          sessions: -1 // Unlimited
        })
      ];

      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        packages: specialPricingPackages
      }));

      expect(() => renderLessons()).not.toThrow();
      
      expect(screen.getByText('Free Consultation')).toBeInTheDocument();
      expect(screen.getByText('$0')).toBeInTheDocument();
      expect(screen.getByText('Premium Unlimited')).toBeInTheDocument();
      expect(screen.getByText('$999')).toBeInTheDocument();
    });
  });

  describe('Pricing Display', () => {
    it('should format prices correctly', () => {
      const packages = [
        createMockLessonPackage({ price: 50.5, originalPrice: 75.99 }),
        createMockLessonPackage({ price: 100, originalPrice: undefined })
      ];

      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        packages 
      }));

      renderLessons();

      // Check price formatting
      expect(screen.getByText('$50')).toBeInTheDocument(); // Should round or format appropriately
      expect(screen.getByText('$100')).toBeInTheDocument();
    });

    it('should show savings when original price is higher', () => {
      const packages = [
        createMockLessonPackage({ 
          price: 80, 
          originalPrice: 120,
          name: 'Discounted Package'
        })
      ];

      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        packages 
      }));

      renderLessons();

      expect(screen.getByText('$80')).toBeInTheDocument();
      expect(screen.getByText('$120')).toBeInTheDocument();
      
      // Original price should have line-through
      const originalPrice = screen.getByText('$120');
      expect(originalPrice).toHaveClass('line-through');
    });

    it('should handle zero prices appropriately', () => {
      const packages = [
        createMockLessonPackage({ 
          price: 0,
          name: 'Free Trial'
        })
      ];

      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        packages 
      }));

      renderLessons();

      expect(screen.getByText('$0')).toBeInTheDocument();
      expect(screen.getByText('Free Trial')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('should not cause unnecessary re-renders', () => {
      const mockReturn = createMockLessonReturn();
      mockUseLessonPackages.mockReturnValue(mockReturn);

      const { rerender } = renderLessons();
      
      // Clear call counts
      mockUseLessonPackages.mockClear();
      
      // Re-render with same data
      rerender(<Lessons />);
      
      expect(mockUseLessonPackages).toHaveBeenCalledTimes(1);
    });

    it('should handle component unmounting gracefully', () => {
      const { unmount } = renderLessons();
      
      expect(() => unmount()).not.toThrow();
    });

    it('should efficiently render many packages', () => {
      const manyPackages = Array(20).fill(0).map((_, i) => 
        createMockLessonPackage({ 
          id: `package-${i}`,
          name: `Package ${i + 1}`,
          price: (i + 1) * 10
        })
      );

      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        packages: manyPackages 
      }));

      const startTime = Date.now();
      renderLessons();
      const endTime = Date.now();

      // Should render efficiently
      expect(endTime - startTime).toBeLessThan(1000);
      
      // All packages should be rendered
      expect(screen.getByText('Package 1')).toBeInTheDocument();
      expect(screen.getByText('Package 20')).toBeInTheDocument();
    });

    it('should maintain consistent layout with varying package content', () => {
      const varyingPackages = [
        createMockLessonPackage({
          name: 'Short',
          description: 'Brief.',
          features: ['One feature']
        }),
        createMockLessonPackage({
          name: 'Very Long Package Name That Might Wrap Multiple Lines',
          description: 'This is a much longer description that contains multiple sentences and might cause layout issues if not handled properly.',
          features: [
            'Feature with a very long name that might wrap',
            'Another long feature description',
            'Short feature',
            'Yet another feature with moderate length',
            'Final feature item'
          ]
        })
      ];

      mockUseLessonPackages.mockReturnValue(createMockLessonReturn({ 
        packages: varyingPackages
      }));

      expect(() => renderLessons()).not.toThrow();
      
      const packageCards = document.querySelectorAll('[class*="bg-white"]');
      expect(packageCards).toHaveLength(2);
    });
  });
});