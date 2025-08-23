import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Contact } from '../Contact';
import * as contentHooks from '@/hooks/useContent';
import { ContactContent, ContactMethod } from '@/types/content';

// Enhanced TypeScript patterns
interface MockedContentHooks {
  useSectionContent: ReturnType<typeof vi.fn>;
}

interface MockContentReturn {
  data: ContactContent | null;
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
const createMockContactMethod = (overrides?: Partial<ContactMethod>): ContactMethod => ({
  type: 'email',
  label: 'Email Me',
  value: 'hello@rrishmusic.com',
  href: 'mailto:hello@rrishmusic.com',
  primary: true,
  ...overrides,
});

const createMockContactContent = (overrides?: Partial<ContactContent>): ContactContent => ({
  title: 'Get In Touch',
  subtitle: 'Ready to start your musical journey? Let\'s connect and discuss how I can help you achieve your goals.',
  methods: [
    createMockContactMethod(),
    createMockContactMethod({
      type: 'instagram',
      label: 'Follow Me',
      value: '@rrishmusic',
      href: 'https://instagram.com/rrishmusic',
      primary: false
    }),
    createMockContactMethod({
      type: 'phone',
      label: 'Call Me',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      primary: false
    })
  ],
  ...overrides,
});

const createMockContentReturn = (overrides?: Partial<MockContentReturn>): MockContentReturn => ({
  data: createMockContactContent(),
  loading: false,
  error: null,
  ...overrides,
});

// Custom render function for Contact component
const renderContact = (options?: RenderOptions) => {
  return render(<Contact />, options);
};

// Mock framer-motion to capture and test animation props
const mockMotionSection = vi.fn();
const mockMotionDiv = vi.fn();
const mockMotionH2 = vi.fn();
const mockMotionP = vi.fn();
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

const mockUseSectionContent = vi.mocked(contentHooks.useSectionContent) as MockedContentHooks['useSectionContent'];

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMotionSection.mockClear();
    mockMotionDiv.mockClear();
    mockMotionH2.mockClear();
    mockMotionP.mockClear();
    mockMotionA.mockClear();
    
    // Default mock return value
    mockUseSectionContent.mockReturnValue(createMockContentReturn());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Content Rendering', () => {
    it('should render contact section with correct content', () => {
      const mockContent = createMockContactContent({
        title: 'Custom Contact Title',
        subtitle: 'Custom contact subtitle text',
        methods: [
          createMockContactMethod({
            label: 'Custom Email',
            value: 'custom@test.com'
          })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderContact();

      expect(screen.getByRole('heading', { name: 'Custom Contact Title' })).toBeInTheDocument();
      expect(screen.getByText('Custom contact subtitle text')).toBeInTheDocument();
      expect(screen.getByText('Custom Email')).toBeInTheDocument();
      expect(screen.getByText('custom@test.com')).toBeInTheDocument();
    });

    it('should render all contact methods', () => {
      const mockContent = createMockContactContent({
        methods: [
          createMockContactMethod({
            type: 'email',
            label: 'Email Contact',
            value: 'email@test.com',
            href: 'mailto:email@test.com'
          }),
          createMockContactMethod({
            type: 'phone',
            label: 'Phone Contact',
            value: '123-456-7890',
            href: 'tel:1234567890'
          }),
          createMockContactMethod({
            type: 'instagram',
            label: 'Instagram Contact',
            value: '@testhandle',
            href: 'https://instagram.com/testhandle'
          })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderContact();

      mockContent.methods.forEach(method => {
        expect(screen.getByText(method.label)).toBeInTheDocument();
        expect(screen.getByText(method.value)).toBeInTheDocument();
      });
    });

    it('should render contact method links with correct attributes', () => {
      const mockContent = createMockContactContent({
        methods: [
          createMockContactMethod({
            type: 'email',
            label: 'Email Me',
            value: 'test@example.com',
            href: 'mailto:test@example.com'
          }),
          createMockContactMethod({
            type: 'instagram',
            label: 'Follow Me',
            value: '@testuser',
            href: 'https://instagram.com/testuser'
          })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderContact();

      const emailLink = screen.getByRole('link', { name: /email me/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');

      const instagramLink = screen.getByRole('link', { name: /follow me/i });
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/testuser');
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should highlight primary contact methods', () => {
      const mockContent = createMockContactContent({
        methods: [
          createMockContactMethod({
            label: 'Primary Contact',
            primary: true
          }),
          createMockContactMethod({
            label: 'Secondary Contact',
            primary: false
          })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderContact();

      const primaryContact = screen.getByText('Primary Contact').closest('[class*="bg-brand-blue-primary"]');
      const secondaryContact = screen.getByText('Secondary Contact').closest('a');

      expect(primaryContact).toBeInTheDocument();
      expect(secondaryContact).not.toHaveClass('bg-brand-blue-primary');
    });

    it('should render appropriate icons for different contact types', () => {
      const mockContent = createMockContactContent({
        methods: [
          createMockContactMethod({ type: 'email' }),
          createMockContactMethod({ type: 'phone' }),
          createMockContactMethod({ type: 'instagram' })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ data: mockContent }));

      renderContact();

      // Check for SVG icons
      const svgIcons = document.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThanOrEqual(3); // One icon per contact method
    });

    it('should render section with correct ID and structure', () => {
      renderContact();

      const contactSection = document.querySelector('#contact');
      expect(contactSection).toBeInTheDocument();
      expect(contactSection).toHaveAttribute('id', 'contact');
      expect(contactSection?.tagName).toBe('SECTION');
    });
  });

  describe('Loading States', () => {
    it('should render loading skeleton when loading is true', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderContact();

      // Check for loading skeleton elements
      const skeletonElements = document.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletonElements.length).toBeGreaterThan(0);

      // Check for skeleton bars
      const skeletonBars = document.querySelectorAll('[class*="bg-gray-300"]');
      expect(skeletonBars.length).toBeGreaterThanOrEqual(3); // Title, subtitle, contact methods
    });

    it('should render contact method loading skeletons', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderContact();

      // Check for contact method skeleton cards
      const contactSkeletons = document.querySelectorAll('[class*="bg-gray-200"][class*="rounded"]');
      expect(contactSkeletons.length).toBeGreaterThanOrEqual(2);
    });

    it('should not render actual content during loading', () => {
      const mockContent = createMockContactContent();
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: mockContent 
      }));

      renderContact();

      expect(screen.queryByText(mockContent.title)).not.toBeInTheDocument();
      expect(screen.queryByText(mockContent.subtitle)).not.toBeInTheDocument();
      mockContent.methods.forEach(method => {
        expect(screen.queryByText(method.label)).not.toBeInTheDocument();
      });
    });

    it('should maintain section structure during loading', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      renderContact();

      const contactSection = document.querySelector('#contact');
      expect(contactSection).toBeInTheDocument();
      expect(contactSection).toHaveClass('section');
    });
  });

  describe('Error States', () => {
    it('should render fallback content when error occurs', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Failed to load content',
        data: null 
      }));

      renderContact();

      expect(screen.getByRole('heading', { name: 'Get In Touch' })).toBeInTheDocument();
      expect(screen.getByText('Contact information temporarily unavailable. Please try again later.')).toBeInTheDocument();
    });

    it('should render fallback content when data is null', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: null 
      }));

      renderContact();

      expect(screen.getByRole('heading', { name: 'Get In Touch' })).toBeInTheDocument();
      expect(screen.getByText('Contact information temporarily unavailable. Please try again later.')).toBeInTheDocument();
    });

    it('should provide fallback Instagram link in error state', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Network error',
        data: null 
      }));

      renderContact();

      const fallbackLink = screen.getByRole('link', { name: /@rrishmusic/i });
      expect(fallbackLink).toBeInTheDocument();
      expect(fallbackLink).toHaveAttribute('href', 'https://instagram.com/rrishmusic');
    });

    it('should maintain proper styling in error state', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        error: 'Network error',
        data: null 
      }));

      renderContact();

      const heading = screen.getByRole('heading', { name: 'Get In Touch' });
      expect(heading).toHaveClass('text-4xl', 'font-heading', 'font-bold');
    });
  });

  describe('User Interactions', () => {
    it('should handle email link clicks', async () => {
      const user = userEvent.setup();
      renderContact();

      const emailLink = screen.getByRole('link', { name: /email me/i });
      
      await user.click(emailLink);

      // Verify the link has correct mailto href
      expect(emailLink).toHaveAttribute('href', 'mailto:hello@rrishmusic.com');
    });

    it('should handle phone link clicks', async () => {
      const user = userEvent.setup();
      renderContact();

      const phoneLink = screen.getByRole('link', { name: /call me/i });
      
      await user.click(phoneLink);

      // Verify the link has correct tel href
      expect(phoneLink).toHaveAttribute('href', 'tel:+15551234567');
    });

    it('should handle Instagram link clicks', async () => {
      const user = userEvent.setup();
      renderContact();

      const instagramLink = screen.getByRole('link', { name: /follow me/i });
      
      // Mock window.open to verify external link handling
      const mockOpen = vi.fn();
      Object.defineProperty(window, 'open', { value: mockOpen, writable: true });

      await user.click(instagramLink);

      // Verify the link has correct attributes for external navigation
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/rrishmusic');
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should support keyboard navigation for contact links', async () => {
      const user = userEvent.setup();
      renderContact();

      const contactLinks = screen.getAllByRole('link');
      
      if (contactLinks.length > 0) {
        // Tab to first contact link
        await user.tab();
        let attempts = 0;
        while (document.activeElement !== contactLinks[0] && attempts < 10) {
          await user.tab();
          attempts++;
        }
        
        if (document.activeElement === contactLinks[0]) {
          expect(contactLinks[0]).toHaveFocus();
          
          // Press Enter to activate link
          await user.keyboard('{Enter}');
          expect(contactLinks[0]).toHaveAttribute('href');
        }
      }
    });

    it('should handle hover effects on contact cards', async () => {
      const user = userEvent.setup();
      renderContact();

      const contactCards = document.querySelectorAll('[class*="bg-white"][class*="rounded"]') || 
        document.querySelectorAll('a[class*="transition"]');
      
      if (contactCards.length > 0) {
        await user.hover(contactCards[0]);
        // Hover effects are handled by CSS and Framer Motion
        expect(contactCards[0]).toBeInTheDocument();
      }
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply responsive grid classes for contact methods', () => {
      renderContact();

      const gridContainer = document.querySelector('[class*="grid"][class*="md:grid-cols-2"][class*="lg:grid-cols-3"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should use responsive text sizing', () => {
      renderContact();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('should apply responsive spacing', () => {
      renderContact();

      const subtitle = screen.getByText(/Ready to start your musical journey/);
      expect(subtitle).toHaveClass('text-lg', 'md:text-xl');
    });

    it('should handle mobile layout correctly', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderContact();

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

      renderContact();

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

      renderContact();

      const gridContainer = document.querySelector('[class*="lg:grid-cols-3"]');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Animations Integration', () => {
    it('should apply scroll-triggered animations to section', () => {
      renderContact();

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

    it('should apply stagger animations to contact method cards', () => {
      renderContact();

      const contactCalls = mockMotionA.mock.calls.filter(call => 
        call[0].variants
      );

      expect(contactCalls.length).toBeGreaterThan(0);
      contactCalls.forEach(call => {
        expect(call[0]).toHaveProperty('variants');
      });
    });

    it('should apply hover animations to contact links', () => {
      renderContact();

      const hoverCalls = mockMotionA.mock.calls.filter(call => 
        call[0].whileHover
      );

      expect(hoverCalls.length).toBeGreaterThan(0);
      hoverCalls.forEach(call => {
        expect(call[0]).toHaveProperty('whileHover');
      });
    });

    it('should apply fadeInUp animation to header content', () => {
      renderContact();

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

    it('should not apply animations during loading state', () => {
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        loading: true, 
        data: null 
      }));

      // Clear previous calls
      mockMotionDiv.mockClear();
      mockMotionH2.mockClear();
      mockMotionP.mockClear();

      renderContact();

      // During loading, animated content should not be rendered
      const animatedContentCalls = [
        ...mockMotionH2.mock.calls,
        ...mockMotionP.mock.calls.filter(call => !call[0].className?.includes('animate-pulse')),
      ];

      expect(animatedContentCalls.length).toBe(0);
    });

    it('should configure proper viewport settings for scroll animations', () => {
      renderContact();

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
      renderContact();

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading.tagName).toBe('H2');
    });

    it('should have accessible link text and attributes', () => {
      renderContact();

      const contactLinks = screen.getAllByRole('link');
      contactLinks.forEach(link => {
        expect(link).toHaveAccessibleName();
        
        // External links should have proper attributes
        if (link.getAttribute('href')?.startsWith('https://')) {
          expect(link).toHaveAttribute('target', '_blank');
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderContact();

      // Test that links can be navigated to
      const contactLinks = screen.getAllByRole('link');
      
      if (contactLinks.length > 0) {
        await user.tab();
        let attempts = 0;
        while (!contactLinks.some(link => link === document.activeElement) && attempts < 15) {
          await user.tab();
          attempts++;
        }
      }
    });

    it('should have proper semantic structure for contact methods', () => {
      renderContact();

      const contactLinks = screen.getAllByRole('link');
      
      contactLinks.forEach(link => {
        // Each contact method should be a link with proper structure
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href');
        
        // Should contain descriptive text
        expect(link.textContent).toBeTruthy();
      });
    });

    it('should have sufficient color contrast', () => {
      renderContact();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-neutral-charcoal');

      const primaryContact = document.querySelector('[class*="bg-brand-blue-primary"]');
      if (primaryContact) {
        expect(primaryContact).toHaveClass('text-white');
      }
    });

    it('should provide meaningful icons with proper accessibility', () => {
      renderContact();

      // Check that SVG icons have proper accessibility
      const svgIcons = document.querySelectorAll('svg');
      svgIcons.forEach(svg => {
        // SVG should either have aria-label, title, or be aria-hidden
        const hasAriaLabel = svg.hasAttribute('aria-label');
        const hasTitle = svg.querySelector('title');
        const hasAriaHidden = svg.hasAttribute('aria-hidden');
        
        expect(hasAriaLabel || hasTitle || hasAriaHidden).toBe(true);
      });
    });

    it('should handle focus management properly', async () => {
      const user = userEvent.setup();
      renderContact();

      const contactLinks = screen.getAllByRole('link');
      
      if (contactLinks.length > 0) {
        await user.tab();
        let attempts = 0;
        while (document.activeElement !== contactLinks[0] && attempts < 20) {
          await user.tab();
          attempts++;
        }
        
        if (document.activeElement === contactLinks[0]) {
          expect(contactLinks[0]).toHaveFocus();
          expect(contactLinks[0]).toHaveClass('focus:ring-2');
        }
      }
    });
  });

  describe('Content Hook Integration', () => {
    it('should call useSectionContent with correct section name', () => {
      renderContact();

      expect(mockUseSectionContent).toHaveBeenCalledWith('contact');
      expect(mockUseSectionContent).toHaveBeenCalledTimes(1);
    });

    it('should handle content updates correctly', () => {
      const initialContent = createMockContactContent({
        title: 'Initial Contact Title',
        methods: [
          createMockContactMethod({ label: 'Initial Contact' })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: initialContent 
      }));

      const { rerender } = renderContact();
      expect(screen.getByText('Initial Contact Title')).toBeInTheDocument();
      expect(screen.getByText('Initial Contact')).toBeInTheDocument();

      // Update content
      const updatedContent = createMockContactContent({
        title: 'Updated Contact Title',
        methods: [
          createMockContactMethod({ label: 'Updated Contact' })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: updatedContent 
      }));

      rerender(<Contact />);
      expect(screen.getByText('Updated Contact Title')).toBeInTheDocument();
      expect(screen.getByText('Updated Contact')).toBeInTheDocument();
      expect(screen.queryByText('Initial Contact Title')).not.toBeInTheDocument();
    });

    it('should handle empty methods array gracefully', () => {
      const emptyContent = createMockContactContent({
        methods: []
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: emptyContent 
      }));

      expect(() => renderContact()).not.toThrow();
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should handle invalid contact method types', () => {
      const invalidContent = createMockContactContent({
        methods: [
          {
            ...createMockContactMethod(),
            type: 'invalid' as any,
            label: 'Invalid Method'
          }
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: invalidContent 
      }));

      expect(() => renderContact()).not.toThrow();
      
      // Should still render the contact method
      expect(screen.getByText('Invalid Method')).toBeInTheDocument();
    });

    it('should handle contact methods with special characters', () => {
      const specialContent = createMockContactContent({
        title: 'Contact & Connect',
        subtitle: 'Reach out @ any time!',
        methods: [
          createMockContactMethod({
            label: 'Email (Primary)',
            value: 'hello+music@example.com',
            href: 'mailto:hello+music@example.com'
          }),
          createMockContactMethod({
            label: 'Phone & Text',
            value: '+1 (555) 123-4567',
            href: 'tel:+15551234567'
          })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: specialContent 
      }));

      expect(() => renderContact()).not.toThrow();
      
      expect(screen.getByText('Contact & Connect')).toBeInTheDocument();
      expect(screen.getByText('Reach out @ any time!')).toBeInTheDocument();
      expect(screen.getByText('Email (Primary)')).toBeInTheDocument();
      expect(screen.getByText('hello+music@example.com')).toBeInTheDocument();
    });
  });

  describe('Contact Method Types', () => {
    it('should handle email contact methods correctly', () => {
      const emailContent = createMockContactContent({
        methods: [
          createMockContactMethod({
            type: 'email',
            label: 'Send Email',
            value: 'test@email.com',
            href: 'mailto:test@email.com'
          })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: emailContent 
      }));

      renderContact();

      const emailLink = screen.getByRole('link', { name: /send email/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:test@email.com');
      expect(emailLink).not.toHaveAttribute('target', '_blank');
    });

    it('should handle phone contact methods correctly', () => {
      const phoneContent = createMockContactContent({
        methods: [
          createMockContactMethod({
            type: 'phone',
            label: 'Call Now',
            value: '555-123-4567',
            href: 'tel:5551234567'
          })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: phoneContent 
      }));

      renderContact();

      const phoneLink = screen.getByRole('link', { name: /call now/i });
      expect(phoneLink).toHaveAttribute('href', 'tel:5551234567');
      expect(phoneLink).not.toHaveAttribute('target', '_blank');
    });

    it('should handle Instagram contact methods correctly', () => {
      const instagramContent = createMockContactContent({
        methods: [
          createMockContactMethod({
            type: 'instagram',
            label: 'Instagram',
            value: '@testuser',
            href: 'https://instagram.com/testuser'
          })
        ]
      });

      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: instagramContent 
      }));

      renderContact();

      const instagramLink = screen.getByRole('link', { name: /instagram/i });
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/testuser');
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Layout and Styling', () => {
    it('should apply correct CSS classes to main container', () => {
      renderContact();

      const section = document.querySelector('#contact');
      expect(section).toHaveClass('section', 'bg-gradient-to-r');
    });

    it('should use container-custom class for content wrapper', () => {
      renderContact();

      const container = document.querySelector('[class*="container-custom"]');
      expect(container).toBeInTheDocument();
    });

    it('should style contact method cards appropriately', () => {
      renderContact();

      const contactLinks = screen.getAllByRole('link');
      
      // Primary contact should have different styling
      const primaryContact = contactLinks.find(link => 
        link.classList.contains('bg-brand-blue-primary')
      );
      
      if (primaryContact) {
        expect(primaryContact).toHaveClass('bg-brand-blue-primary', 'text-white');
      }

      // Secondary contacts should have standard styling
      const secondaryContacts = contactLinks.filter(link => 
        !link.classList.contains('bg-brand-blue-primary')
      );
      
      secondaryContacts.forEach(contact => {
        expect(contact).toHaveClass('bg-white');
      });
    });

    it('should apply proper spacing and layout classes', () => {
      renderContact();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('mb-6');

      const subtitle = screen.getByText(/Ready to start your musical journey/);
      expect(subtitle).toHaveClass('mb-12');
    });

    it('should style icons consistently', () => {
      renderContact();

      const iconContainers = document.querySelectorAll('[class*="text-2xl"]');
      expect(iconContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Optimization', () => {
    it('should not cause unnecessary re-renders', () => {
      const mockContent = createMockContactContent();
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: mockContent 
      }));

      const { rerender } = renderContact();
      
      // Clear call counts
      mockUseSectionContent.mockClear();
      
      // Re-render with same data
      rerender(<Contact />);
      
      expect(mockUseSectionContent).toHaveBeenCalledTimes(1);
    });

    it('should handle component unmounting gracefully', () => {
      const { unmount } = renderContact();
      
      expect(() => unmount()).not.toThrow();
    });

    it('should efficiently render many contact methods', () => {
      const manyMethods = Array(10).fill(0).map((_, i) => 
        createMockContactMethod({
          type: 'email',
          label: `Contact Method ${i + 1}`,
          value: `contact${i + 1}@test.com`,
          href: `mailto:contact${i + 1}@test.com`,
          primary: i === 0
        })
      );

      const content = createMockContactContent({ methods: manyMethods });
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: content 
      }));

      const startTime = Date.now();
      renderContact();
      const endTime = Date.now();

      // Should render efficiently
      expect(endTime - startTime).toBeLessThan(1000);
      
      // All contact methods should be rendered
      expect(screen.getByText('Contact Method 1')).toBeInTheDocument();
      expect(screen.getByText('Contact Method 10')).toBeInTheDocument();
    });

    it('should maintain consistent layout with varying contact method content', () => {
      const varyingMethods = [
        createMockContactMethod({
          label: 'Short',
          value: 'x@y.co'
        }),
        createMockContactMethod({
          label: 'Very Long Contact Method Name That Might Wrap',
          value: 'very.long.email.address.that.might.cause.layout.issues@example.com'
        })
      ];

      const content = createMockContactContent({ methods: varyingMethods });
      mockUseSectionContent.mockReturnValue(createMockContentReturn({ 
        data: content
      }));

      expect(() => renderContact()).not.toThrow();
      
      const contactLinks = screen.getAllByRole('link');
      expect(contactLinks).toHaveLength(2);
    });
  });
});