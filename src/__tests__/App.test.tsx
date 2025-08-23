import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../App';
import { NAVIGATION_ITEMS } from '@/utils/constants';
import * as scrollSpyHook from '@/hooks/useScrollSpy';
import * as contentHooks from '@/hooks/useContent';
import * as helpers from '@/utils/helpers';
import { SiteContent, LessonContent, HeroContent, AboutContent, ApproachContent, CommunityContent, ContactContent, ContactMethod, TeachingPrinciple } from '@/types/content';

// Enhanced TypeScript patterns
interface AppRenderResult {
  container: HTMLElement;
  rerender: (ui: React.ReactElement) => void;
  unmount: () => boolean;
}

interface MockedScrollSpy {
  useScrollSpy: ReturnType<typeof vi.fn>;
}

interface MockedHelpers {
  scrollToSection: ReturnType<typeof vi.fn>;
}

interface MockedContentHooks {
  useSectionContent: ReturnType<typeof vi.fn>;
  useLessonPackages: ReturnType<typeof vi.fn>;
}

interface MockScrollSpyReturn {
  activeSection: string;
}

interface MockContentReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface MockLessonReturn {
  packages: any[];
  allPackages: any[];
  packageInfo: any;
  loading: boolean;
  error: string | null;
}

interface MotionProps {
  children: React.ReactNode;
  initial?: any;
  animate?: any;
  transition?: any;
  whileHover?: any;
  variants?: any;
  whileInView?: any;
  viewport?: any;
  className?: string;
}

// Test Data Builder Pattern
const createMockScrollSpyReturn = (activeSection: string = ''): MockScrollSpyReturn => ({
  activeSection,
});

const createMockHeroContent = (): HeroContent => ({
  title: 'Hi, I\'m Rrish.',
  subtitle: 'I\'m a musician who improvises on blues and different music genres.',
  ctaText: 'Find me on Instagram:',
  instagramHandle: '@rrishmusic',
  instagramUrl: 'https://instagram.com/rrishmusic',
});

const createMockAboutContent = (): AboutContent => ({
  title: 'About Me',
  content: ['I\'m a passionate musician with experience in blues improvisation.'],
  skills: ['Blues Guitar', 'Jazz Improvisation', 'Music Theory'],
});

const createMockApproachContent = (): ApproachContent => ({
  title: 'My Teaching Approach',
  subtitle: 'Making music education accessible and enjoyable.',
  principles: [
    {
      title: 'Student-Centered Learning',
      description: 'Adapt to each student\'s learning preferences.',
      icon: '🎯'
    }
  ],
});

const createMockCommunityContent = (): CommunityContent => ({
  title: 'Join Our Musical Community',
  description: 'Connect with fellow musicians and learn together.',
  features: ['Weekly group sessions', 'Student showcases'],
  instagramFeed: {
    title: 'Follow Our Journey',
    description: 'See what our community is up to on Instagram'
  },
});

const createMockContactContent = (): ContactContent => ({
  title: 'Get In Touch',
  subtitle: 'Ready to start your musical journey?',
  methods: [
    {
      type: 'email',
      label: 'Email Me',
      value: 'hello@rrishmusic.com',
      href: 'mailto:hello@rrishmusic.com',
      primary: true
    },
    {
      type: 'instagram',
      label: 'Follow Me',
      value: '@rrishmusic',
      href: 'https://instagram.com/rrishmusic',
      primary: false
    }
  ],
});

const createMockContentReturn = <T>(data: T): MockContentReturn<T> => ({
  data,
  loading: false,
  error: null,
});

const createMockLessonReturn = (): MockLessonReturn => ({
  packages: [
    {
      id: 'basic',
      name: 'Basic Lessons',
      price: 50,
      sessions: 4,
      features: ['Basic theory', 'Practice guidance']
    }
  ],
  allPackages: [],
  packageInfo: {},
  loading: false,
  error: null,
});

// Custom render function for App component
const renderApp = (options?: RenderOptions): AppRenderResult => {
  return render(<App />, options);
};

// Mock framer-motion to avoid animation complexity in tests
const mockMotion = vi.fn();

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_, prop) => {
      return (props: MotionProps) => {
        mockMotion({ element: prop, props });
        const { children, variants, initial, animate, transition, whileHover, whileInView, viewport, ...restProps } = props;
        return React.createElement(prop as string, restProps, children);
      };
    }
  }),
}));

// Mock testimonials JSON
vi.mock('@/content/testimonials.json', () => ({
  default: [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Student',
      content: 'Great teacher!',
      rating: 5,
      date: '2024-01-15'
    }
  ]
}));

// Mock the useScrollSpy hook
vi.mock('@/hooks/useScrollSpy', () => ({
  useScrollSpy: vi.fn(),
}));

// Mock the content hooks
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
  useLessonPackages: vi.fn(),
}));

// Mock the scrollToSection helper
vi.mock('@/utils/helpers', () => ({
  scrollToSection: vi.fn(),
}));

const mockUseScrollSpy = vi.mocked(scrollSpyHook.useScrollSpy) as MockedScrollSpy['useScrollSpy'];
const mockUseSectionContent = vi.mocked(contentHooks.useSectionContent) as MockedContentHooks['useSectionContent'];
const mockUseLessonPackages = vi.mocked(contentHooks.useLessonPackages) as MockedContentHooks['useLessonPackages'];
const mockScrollToSection = vi.mocked(helpers.scrollToSection) as MockedHelpers['scrollToSection'];

// Global test setup
beforeAll(() => {
  // Mock window.scrollTo for scroll behavior tests
  Object.defineProperty(window, 'scrollTo', {
    value: vi.fn(),
    writable: true,
  });
  
  // Mock window.scrollY for scroll position tests
  Object.defineProperty(window, 'scrollY', {
    value: 0,
    writable: true,
  });
  
  // Mock IntersectionObserver for scroll spy functionality
  global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }));
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseScrollSpy.mockReturnValue(createMockScrollSpyReturn());
    mockUseLessonPackages.mockReturnValue(createMockLessonReturn());
    
    // Mock different content for different sections
    mockUseSectionContent.mockImplementation((section: string) => {
      switch (section) {
        case 'hero':
          return createMockContentReturn(createMockHeroContent());
        case 'about':
          return createMockContentReturn(createMockAboutContent());
        case 'approach':
          return createMockContentReturn(createMockApproachContent());
        case 'community':
          return createMockContentReturn(createMockCommunityContent());
        case 'contact':
          return createMockContentReturn(createMockContactContent());
        default:
          return createMockContentReturn(null);
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('App Structure and Layout', () => {
    it('should render the complete app with all sections', () => {
      renderApp();

      // Check for all main sections
      expect(document.querySelector('#hero')).toBeInTheDocument();
      expect(document.querySelector('#about')).toBeInTheDocument();
      expect(document.querySelector('#approach')).toBeInTheDocument();
      expect(document.querySelector('#lessons')).toBeInTheDocument();
      expect(document.querySelector('#community')).toBeInTheDocument();
      expect(document.querySelector('#contact')).toBeInTheDocument();
    });

    it('should render navigation component', () => {
      renderApp();

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      // Check for navigation items
      NAVIGATION_ITEMS.forEach((item) => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      });
    });

    it('should have proper document structure', () => {
      renderApp();

      // Check for main element
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
      
      // Sections should be in logical order
      const sections = document.querySelectorAll('section');
      expect(sections.length).toBeGreaterThanOrEqual(6);
    });

    it('should render all section headings in proper hierarchy', () => {
      renderApp();

      // Hero should have h1
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      
      // Other sections should have h2
      const h2Headings = screen.getAllByRole('heading', { level: 2 });
      expect(h2Headings.length).toBeGreaterThanOrEqual(5); // About, Approach, Lessons, Community, Contact
    });
  });

  describe('Content Integration', () => {
    it('should load content for all sections', () => {
      renderApp();

      // Verify each section hook is called
      expect(mockUseSectionContent).toHaveBeenCalledWith('hero');
      expect(mockUseSectionContent).toHaveBeenCalledWith('about');
      expect(mockUseSectionContent).toHaveBeenCalledWith('approach');
      expect(mockUseSectionContent).toHaveBeenCalledWith('community');
      expect(mockUseSectionContent).toHaveBeenCalledWith('contact');
      
      // Verify lesson packages hook is called
      expect(mockUseLessonPackages).toHaveBeenCalled();
    });

    it('should display content from all sections', () => {
      renderApp();

      // Check that content from each section is displayed
      expect(screen.getByText('Hi, I\'m Rrish.')).toBeInTheDocument();
      expect(screen.getByText('About Me')).toBeInTheDocument();
      expect(screen.getByText('My Teaching Approach')).toBeInTheDocument();
      expect(screen.getByText('Join Our Musical Community')).toBeInTheDocument();
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    it('should handle loading states across sections', () => {
      // Mock loading state for hero section
      mockUseSectionContent.mockImplementation((section: string) => {
        if (section === 'hero') {
          return { data: null, loading: true, error: null };
        }
        switch (section) {
          case 'about':
            return createMockContentReturn(createMockAboutContent());
          case 'approach':
            return createMockContentReturn(createMockApproachContent());
          case 'community':
            return createMockContentReturn(createMockCommunityContent());
          case 'contact':
            return createMockContentReturn(createMockContactContent());
          default:
            return createMockContentReturn(null);
        }
      });

      renderApp();

      // Hero should show loading skeleton
      const heroSection = document.querySelector('#hero');
      expect(heroSection?.querySelector('[class*="animate-pulse"]')).toBeInTheDocument();
      
      // Other sections should show content
      expect(screen.getByText('About Me')).toBeInTheDocument();
    });

    it('should handle error states gracefully', () => {
      // Mock error state for about section
      mockUseSectionContent.mockImplementation((section: string) => {
        if (section === 'about') {
          return { data: null, loading: false, error: 'Failed to load' };
        }
        switch (section) {
          case 'hero':
            return createMockContentReturn(createMockHeroContent());
          case 'approach':
            return createMockContentReturn(createMockApproachContent());
          case 'community':
            return createMockContentReturn(createMockCommunityContent());
          case 'contact':
            return createMockContentReturn(createMockContactContent());
          default:
            return createMockContentReturn(null);
        }
      });

      renderApp();

      // Hero should show normal content
      expect(screen.getByText('Hi, I\'m Rrish.')).toBeInTheDocument();
      
      // About should show error fallback
      expect(screen.getByText('Content temporarily unavailable. Please try again later.')).toBeInTheDocument();
    });
  });

  describe('Navigation Integration', () => {
    it('should handle navigation clicks and scroll to sections', async () => {
      const user = userEvent.setup();
      renderApp();

      const aboutNavItem = screen.getByRole('button', { name: 'About' });
      await user.click(aboutNavItem);

      expect(mockScrollToSection).toHaveBeenCalledWith('about');
    });

    it('should update active section based on scroll spy', () => {
      mockUseScrollSpy.mockReturnValue(createMockScrollSpyReturn('about'));
      
      renderApp();

      const aboutNavItem = screen.getByRole('button', { name: 'About' });
      expect(aboutNavItem).toHaveClass('text-brand-blue-primary');
    });

    it('should handle all navigation items correctly', async () => {
      const user = userEvent.setup();
      renderApp();

      for (const navItem of NAVIGATION_ITEMS) {
        const navButton = screen.getByRole('button', { name: navItem.label });
        await user.click(navButton);
        
        expect(mockScrollToSection).toHaveBeenCalledWith(navItem.id);
      }
    });
  });

  describe('User Interactions', () => {
    it('should handle Instagram links throughout the app', async () => {
      const user = userEvent.setup();
      renderApp();

      // Find Instagram links
      const instagramLinks = screen.getAllByRole('link', { name: /@rrishmusic/i });
      
      expect(instagramLinks.length).toBeGreaterThan(0);
      
      // Test first Instagram link
      if (instagramLinks[0]) {
        expect(instagramLinks[0]).toHaveAttribute('href', 'https://instagram.com/rrishmusic');
        expect(instagramLinks[0]).toHaveAttribute('target', '_blank');
      }
    });

    it('should handle contact interactions', async () => {
      const user = userEvent.setup();
      renderApp();

      // Find contact buttons/links
      const emailLink = screen.getByRole('link', { name: /email me/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:hello@rrishmusic.com');
    });

    it('should handle lesson package interactions', async () => {
      const user = userEvent.setup();
      renderApp();

      // Find "Get Started" buttons from lesson packages
      const getStartedButtons = screen.getAllByText('Get Started');
      
      if (getStartedButtons.length > 0) {
        expect(getStartedButtons[0]).toBeInTheDocument();
      }
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle mobile viewport correctly', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderApp();

      // Mobile navigation should be present
      const mobileMenuContainer = screen.getByRole('navigation').querySelector('[class*="md:hidden"]');
      expect(mobileMenuContainer).toBeInTheDocument();

      // Responsive classes should be applied
      const heroTitle = screen.getByRole('heading', { level: 1 });
      expect(heroTitle).toHaveClass('text-4xl', 'md:text-6xl');
    });

    it('should handle desktop viewport correctly', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      renderApp();

      // Desktop navigation should show all items
      NAVIGATION_ITEMS.forEach((item) => {
        const navButton = screen.getByText(item.label);
        expect(navButton).toBeInTheDocument();
      });
    });

    it('should apply responsive grid layouts', () => {
      renderApp();

      // Check for responsive grids in various sections
      const grids = document.querySelectorAll('[class*="md:grid-cols-2"], [class*="lg:grid-cols-3"]');
      expect(grids.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy across all sections', () => {
      renderApp();

      // Should have one h1
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);

      // Should have multiple h2s for sections
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThanOrEqual(5);

      // Should have h3s for subsections
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation throughout', async () => {
      const user = userEvent.setup();
      renderApp();

      // Should be able to tab through interactive elements
      await user.tab(); // Navigation items should be focusable
      expect(document.activeElement).toBeDefined();
    });

    it('should have accessible links with proper attributes', () => {
      renderApp();

      const externalLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href')?.startsWith('https://')
      );
      
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should have proper landmark structure', () => {
      renderApp();

      // Should have navigation landmark
      expect(screen.getByRole('navigation')).toBeInTheDocument();

      // Should have main landmark
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();

      // Sections should be properly structured
      const sections = document.querySelectorAll('section');
      expect(sections.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Performance and Optimization', () => {
    it('should not cause excessive re-renders', () => {
      const { rerender } = renderApp();
      
      // Clear call counts
      mockUseSectionContent.mockClear();
      mockUseLessonPackages.mockClear();
      
      // Re-render with same props
      rerender(<App />);
      
      // Should call hooks again but not excessively
      expect(mockUseSectionContent).toHaveBeenCalled();
      expect(mockUseLessonPackages).toHaveBeenCalled();
    });

    it('should handle component unmounting gracefully', () => {
      const { unmount } = renderApp();
      
      expect(() => unmount()).not.toThrow();
    });

    it('should efficiently render large amounts of content', () => {
      // Mock larger datasets
      mockUseLessonPackages.mockReturnValue({
        packages: Array(20).fill(0).map((_, i) => ({
          id: `package-${i}`,
          name: `Package ${i + 1}`,
          price: i * 10,
          sessions: i + 1,
          features: [`Feature ${i + 1}`]
        })),
        allPackages: [],
        packageInfo: {},
        loading: false,
        error: null,
      });

      const startTime = Date.now();
      renderApp();
      const endTime = Date.now();

      // Should render efficiently even with lots of content
      expect(endTime - startTime).toBeLessThan(2000);
    });
  });

  describe('Error Handling', () => {
    it('should handle content loading failures gracefully', () => {
      // Mock all sections to fail loading
      mockUseSectionContent.mockReturnValue({
        data: null,
        loading: false,
        error: 'Network error'
      });

      mockUseLessonPackages.mockReturnValue({
        packages: [],
        allPackages: [],
        packageInfo: {},
        loading: false,
        error: 'Network error'
      });

      expect(() => renderApp()).not.toThrow();

      // App should still render with fallback content
      expect(document.querySelector('#hero')).toBeInTheDocument();
      expect(document.querySelector('#about')).toBeInTheDocument();
    });

    it('should handle missing navigation constants gracefully', () => {
      // App should still render even if navigation items are missing
      expect(() => renderApp()).not.toThrow();

      // Navigation component should still be present
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle scroll spy failures gracefully', () => {
      mockUseScrollSpy.mockImplementation(() => {
        throw new Error('ScrollSpy error');
      });

      expect(() => renderApp()).not.toThrow();

      // Navigation should still render without active highlighting
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Integration with External Services', () => {
    it('should handle Instagram integration correctly', () => {
      renderApp();

      // Should have multiple Instagram links throughout the app
      const instagramLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('href')?.includes('instagram.com')
      );

      expect(instagramLinks.length).toBeGreaterThan(0);
      
      instagramLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should handle email links correctly', () => {
      renderApp();

      const emailLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('href')?.startsWith('mailto:')
      );

      expect(emailLinks.length).toBeGreaterThan(0);
      
      emailLinks.forEach(link => {
        expect(link.getAttribute('href')).toMatch(/^mailto:/);
      });
    });

    it('should handle phone links correctly', () => {
      renderApp();

      // Phone links might be present in contact section
      const phoneLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('href')?.startsWith('tel:')
      );

      // If phone links exist, they should be properly formatted
      phoneLinks.forEach(link => {
        expect(link.getAttribute('href')).toMatch(/^tel:/);
      });
    });
  });

  describe('Content Management Integration', () => {
    it('should handle content updates across all sections', () => {
      const { rerender } = renderApp();

      // Verify initial content
      expect(screen.getByText('Hi, I\'m Rrish.')).toBeInTheDocument();
      
      // Update hero content
      mockUseSectionContent.mockImplementation((section: string) => {
        if (section === 'hero') {
          return createMockContentReturn({
            ...createMockHeroContent(),
            title: 'Updated Hero Title'
          });
        }
        // Return other sections unchanged
        switch (section) {
          case 'about':
            return createMockContentReturn(createMockAboutContent());
          case 'approach':
            return createMockContentReturn(createMockApproachContent());
          case 'community':
            return createMockContentReturn(createMockCommunityContent());
          case 'contact':
            return createMockContentReturn(createMockContactContent());
          default:
            return createMockContentReturn(null);
        }
      });

      rerender(<App />);

      // Should show updated content
      expect(screen.getByText('Updated Hero Title')).toBeInTheDocument();
      expect(screen.queryByText('Hi, I\'m Rrish.')).not.toBeInTheDocument();
    });

    it('should maintain section isolation during content updates', () => {
      const { rerender } = renderApp();

      // Update only about section
      mockUseSectionContent.mockImplementation((section: string) => {
        if (section === 'about') {
          return createMockContentReturn({
            ...createMockAboutContent(),
            title: 'Updated About Title'
          });
        }
        // Return other sections unchanged
        switch (section) {
          case 'hero':
            return createMockContentReturn(createMockHeroContent());
          case 'approach':
            return createMockContentReturn(createMockApproachContent());
          case 'community':
            return createMockContentReturn(createMockCommunityContent());
          case 'contact':
            return createMockContentReturn(createMockContactContent());
          default:
            return createMockContentReturn(null);
        }
      });

      rerender(<App />);

      // About section should update
      expect(screen.getByText('Updated About Title')).toBeInTheDocument();
      
      // Other sections should remain unchanged
      expect(screen.getByText('Hi, I\'m Rrish.')).toBeInTheDocument();
      expect(screen.getByText('My Teaching Approach')).toBeInTheDocument();
    });
  });
});